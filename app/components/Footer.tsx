'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Package', href: '/packages' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">

          {/* Brand */}
          <div className="max-w-xs">
            <h3 className="text-2xl font-bold mb-2">
              <span className="text-amber-400">Kaavya</span> Tour & Travel
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We provide taxi services and ticket booking for your trips. 
              Travel comfortably with us and enjoy your journey.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-amber-500 rounded-full flex items-center justify-center transition">
                <FaFacebook />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-amber-500 rounded-full flex items-center justify-center transition">
                <FaInstagram />
              </a>
              <a href="https://wa.me/91788934250" target="_blank"
                className="w-9 h-9 bg-white/10 hover:bg-green-500 rounded-full flex items-center justify-center transition">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}
                    className="text-gray-400 hover:text-amber-400 text-sm transition flex items-center gap-1">
                    <span className="text-amber-400">›</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                📍 main bazar katra jammu 
              </li>
              <li>
                <a href="tel:96977 76463" className="flex items-center gap-2 hover:text-amber-400">
                  📞 +91 96977 76463
                </a>
              </li>
              <li>
                <a href="https://wa.me/919697776463" target="_blank"
                  className="flex items-center gap-2 hover:text-green-400">
                  💬 WhatsApp Chat
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <span>© {currentYear} Kaavya Tour & Travel. All rights reserved.</span>
          <span>Owner: Atul Sharma</span>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-amber-500 hover:bg-amber-600 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition hover:scale-110"
      >
        ↑
      </button>
    </footer>
  );
}