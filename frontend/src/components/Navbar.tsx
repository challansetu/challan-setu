'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X, HelpCircle, Info, BookOpen } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from './ui/Button';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center" onClick={closeMobile}>
            <Logo scheme="dark" height={38} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-1">
            {/* Public links - always visible */}
            <Link href="/how-it-works">
              <Button variant="ghost" size="sm" className="text-gray-600">
                How It Works
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="ghost" size="sm" className="text-gray-600">
                FAQ
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="text-gray-600">
                Blog
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="sm:hidden p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors rounded-xl hover:bg-surface-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-gray-50 py-3 space-y-1 animate-in slide-in-from-top-2">
            {/* Public links */}
            <Link
              href="/how-it-works"
              onClick={closeMobile}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-surface-50 transition-colors"
            >
              <Info className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">How It Works</span>
            </Link>
            <Link
              href="/faq"
              onClick={closeMobile}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-surface-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">FAQ</span>
            </Link>
            <Link
              href="/blog"
              onClick={closeMobile}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-surface-50 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Blog</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
