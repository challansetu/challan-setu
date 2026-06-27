'use client';

import { useCallback, useRef, useState } from 'react';
import axios from 'axios';
import { paymentsApi, type PaymentStatusValue } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 500000;
const PHONE_REGEX = /^[6-9]\d{9}$/;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) return resolve(true);
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Poll the backend until the payment reaches a conclusive state (or attempts run out).
async function pollStatus(orderId: string, attempts = 4, delayMs = 3000): Promise<PaymentStatusValue> {
  let last: PaymentStatusValue = 'PENDING';
  for (let i = 0; i < attempts; i++) {
    await sleep(delayMs);
    try {
      const { data } = await paymentsApi.getStatus(orderId);
      last = data.status;
      if (['PAID', 'FAILED', 'FLAGGED', 'VERIFICATION_FAILED'].includes(data.status)) return data.status;
    } catch {
      /* keep trying */
    }
  }
  return last;
}

type Status = 'idle' | 'processing' | 'confirming' | 'success' | 'pending';

export function PaymentForm() {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null); // non-error notices (e.g. cancelled)
  const [success, setSuccess] = useState<{ amount: number; paymentId: string } | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  // Avoids double-charge from rapid double-clicks (#16).
  const busyRef = useRef(false);

  const validate = useCallback((): string | null => {
    const amt = Number(amount);
    if (!amount || Number.isNaN(amt)) return 'Please enter a valid amount.';
    if (amt < MIN_AMOUNT) return `Minimum payment is ₹${MIN_AMOUNT}.`;
    if (amt > MAX_AMOUNT) return `Maximum payment is ₹${MAX_AMOUNT.toLocaleString('en-IN')}.`;
    if (name.trim().length < 2) return 'Please enter your name.';
    if (!PHONE_REGEX.test(phone.trim())) return 'Please enter a valid 10-digit mobile number.';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address.';
    return null;
  }, [amount, name, phone, email]);

  const resolveOutcome = useCallback((finalStatus: PaymentStatusValue, amt: number, orderId: string, paymentId?: string) => {
    if (finalStatus === 'PAID') {
      trackEvent('payment_succeeded', { amount: amt });
      setSuccess({ amount: amt, paymentId: paymentId ?? '—' });
      setStatus('success');
      return;
    }
    if (finalStatus === 'FAILED') {
      trackEvent('payment_failed', { reason: 'failed' });
      setStatus('idle');
      setError('Your payment did not go through. If any amount was deducted, it is auto-refunded by your bank within 5–7 working days. You can try again.');
      return;
    }
    // AUTHORIZED / FLAGGED / VERIFICATION_FAILED / PENDING → not confirmed yet.
    setPendingOrderId(orderId);
    setStatus('pending');
  }, []);

  const handlePay = useCallback(async () => {
    setError(null);
    setInfo(null);
    if (busyRef.current) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    busyRef.current = true;
    setStatus('processing');
    trackEvent('payment_initiated', { amount: Number(amount) });

    const scriptOk = await loadRazorpay();
    if (!scriptOk) {
      busyRef.current = false;
      setStatus('idle');
      setError('Payment service is currently unavailable (it may be blocked by an ad blocker or a slow connection). Please try again.');
      return;
    }

    const amt = Number(amount);

    try {
      const { data: order } = await paymentsApi.createOrder({
        amount: amt,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        note: note.trim() || undefined,
      });

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'ChallanSetu',
        description: note.trim() || 'Service payment',
        prefill: {
          name: order.name,
          contact: order.phone,
          ...(order.email ? { email: order.email } : {}),
        },
        theme: { color: '#1c1c24' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (resp: any) => {
          setStatus('confirming');
          try {
            const { data } = await paymentsApi.verify({
              razorpayOrderId: resp.razorpay_order_id,
              razorpayPaymentId: resp.razorpay_payment_id,
              razorpaySignature: resp.razorpay_signature,
            });
            if (data.status === 'PAID') {
              resolveOutcome('PAID', amt, resp.razorpay_order_id, resp.razorpay_payment_id);
            } else {
              // Not conclusively paid yet — poll the backend (webhook/reconciliation may finalize).
              const finalStatus = await pollStatus(resp.razorpay_order_id);
              resolveOutcome(finalStatus, amt, resp.razorpay_order_id, resp.razorpay_payment_id);
            }
          } catch (err) {
            // Verification rejected (signature/mismatch) OR a transient error.
            if (axios.isAxiosError(err) && err.response && err.response.status >= 400 && err.response.status < 500) {
              // Backend explicitly refused to confirm — treat as needs-review, not success.
              setPendingOrderId(resp.razorpay_order_id);
              setStatus('pending');
            } else {
              const finalStatus = await pollStatus(resp.razorpay_order_id);
              resolveOutcome(finalStatus, amt, resp.razorpay_order_id, resp.razorpay_payment_id);
            }
          } finally {
            busyRef.current = false;
          }
        },
        modal: {
          ondismiss: () => {
            // #3 — user closed the modal / pressed back. Not a failure; order stays pending.
            busyRef.current = false;
            setStatus('idle');
            setInfo('Payment was cancelled. You can try again whenever you are ready.');
          },
        },
      });

      // #4 — checkout reported a failed payment attempt.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp.on('payment.failed', (resp: any) => {
        busyRef.current = false;
        setStatus('idle');
        trackEvent('payment_failed', { reason: resp?.error?.description ?? 'failed' });
        const reason = resp?.error?.description ? ` (${resp.error.description})` : '';
        setError(`Payment failed${reason}. If any amount was deducted, it is auto-refunded by your bank within 5–7 working days. You can try again.`);
      });

      rzp.open();
    } catch (err) {
      busyRef.current = false;
      setStatus('idle');
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message[0]
            : err.response.data.message
          : 'Something went wrong starting your payment. Please try again.';
      setError(msg);
    }
  }, [amount, name, phone, email, note, validate, resolveOutcome]);

  // ─── Confirming screen ────────────────────────────────────────────────────────
  if (status === 'confirming') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="w-12 h-12 mx-auto rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
        <h2 className="text-xl font-bold text-gray-900 mt-5">Confirming your payment…</h2>
        <p className="text-sm text-gray-600 mt-2">Please don&apos;t close or refresh this page.</p>
      </div>
    );
  }

  // ─── Success screen ───────────────────────────────────────────────────────────
  if (status === 'success' && success) {
    return (
      <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 mt-5">Payment Successful</h2>
        <p className="text-gray-600 mt-2">
          We&apos;ve received your payment of <strong>₹{success.amount.toLocaleString('en-IN')}</strong>.
        </p>
        <p className="text-xs text-gray-500 mt-4">Payment ID: <span className="font-mono">{success.paymentId}</span></p>
        <p className="text-sm text-gray-600 mt-6">Keep this Payment ID for your records. Our team will follow up with you shortly.</p>
      </div>
    );
  }

  // ─── Pending / needs-confirmation screen ───────────────────────────────────────
  if (status === 'pending') {
    return (
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-2xl">⏳</div>
        <h2 className="text-xl font-bold text-gray-900 mt-5">We&apos;re confirming your payment</h2>
        <p className="text-sm text-gray-600 mt-2">
          Your payment is being verified. If any amount was deducted, it will reflect once confirmed, or be auto-refunded by your bank within 5–7 working days if it didn&apos;t go through.
        </p>
        {pendingOrderId && (
          <p className="text-xs text-gray-500 mt-4">Order ID: <span className="font-mono">{pendingOrderId}</span></p>
        )}
        <p className="text-sm text-gray-600 mt-6">
          Please save this Order ID and contact us on WhatsApp if it isn&apos;t confirmed shortly — our team will check it for you.
        </p>
        <button
          type="button"
          onClick={() => { setStatus('idle'); setError(null); setInfo(null); }}
          className="mt-6 text-sm font-medium text-amber-600 hover:text-amber-700"
        >
          ← Back to payment
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition';

  // ─── Form (idle / processing) ───────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Payment Details</h2>
      <p className="text-sm text-gray-500 mb-6">All fields marked * are required.</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1.5">Amount (₹) *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input id="amount" type="number" inputMode="decimal" min={MIN_AMOUNT} max={MAX_AMOUNT} step="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className={`${inputClass} pl-8`} />
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClass} maxLength={100} />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number *</label>
          <input id="phone" type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" className={inputClass} />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-gray-400 font-normal">(optional)</span></label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} maxLength={150} />
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1.5">Note <span className="text-gray-400 font-normal">(optional)</span></label>
          <input id="note" type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Drink & drive case consultation" className={inputClass} maxLength={500} />
        </div>
      </div>

      {info && (
        <div className="mt-5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">{info}</div>
      )}
      {error && (
        <div className="mt-5 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={status === 'processing'}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.99] text-gray-900 font-bold rounded-xl px-6 py-3.5 text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'processing' ? 'Processing…' : amount ? `Pay ₹${Number(amount || 0).toLocaleString('en-IN')}` : 'Pay Securely'}
      </button>

      <p className="mt-4 text-center text-xs text-gray-400">
        🔒 Payments are processed securely by Razorpay. ChallanSetu never stores your card details.
      </p>
    </div>
  );
}
