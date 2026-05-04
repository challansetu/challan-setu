import Link from 'next/link';
import { ShieldCheck, Mail, Clock } from 'lucide-react';
import { Logo } from '@/components/Logo';
import siteData from '@/data/site.json';

const FOOTER_LINKS = {
  services: [
    { label: 'Pay Challan', href: '/' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Service Area', href: '/service-area' },
  ],
  cities: [
    { label: 'Delhi', href: '/pay-vehicle-challan-in-delhi' },
    { label: 'Noida', href: '/pay-vehicle-challan-in-noida' },
    { label: 'Gurgaon', href: '/pay-vehicle-challan-in-gurgaon' },
    { label: 'Ghaziabad', href: '/pay-vehicle-challan-in-ghaziabad' },
    { label: 'Faridabad', href: '/pay-vehicle-challan-in-faridabad' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/about#contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main footer */}
      <div className="container-app py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center mb-4 w-fit">
              <Logo scheme="light" height={42} />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-xs">
              India's simplest platform to get challan assistance and settlement support online. Serving Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                <a href={`mailto:${siteData.contact.email}`} className="hover:text-gray-300 transition-colors">
                  {siteData.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                <span>{siteData.contact.supportHours}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase text-xs">Services</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase text-xs">Cities</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.cities.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support + Legal */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase text-xs">Support</h3>
            <ul className="space-y-2.5 mb-6">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase text-xs">Legal</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800/60">
        <div className="container-app py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} {siteData.footer.copyright}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit SSL Encrypted</span>
            </div>
            <div className="text-xs text-gray-600">
              Powered by <span className="text-gray-500 font-medium">Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
