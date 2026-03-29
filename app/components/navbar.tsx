"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide navbar
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close drawer when clicking on a link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={` text-amber-500 fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } bg-transparent px-6 md:px-12 py-4`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-amber-500 text-2xl md:text-3xl font-semibold tracking-wide hover:text-amber-300 transition-colors duration-200 drop-shadow-lg"
          >
            kt&t
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 text-blackfont-medium">
           
            <Link
              href="/review"
              className={`hover:text-black transition-colors duration-200 ${
                pathname === "/reviews" ? "text-amber-300" : ""
              }`}
            >
              Reviews
            </Link>
            <Link
              href="/about"
              className={`hover:text-black transition-colors duration-200 ${
                pathname === "/about" ? "text-amber-300" : ""
              }`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`hover:text-black transition-colors duration-200 ${
                pathname === "/contact" ? "text-amber-300" : ""
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Desktop Book Now Button */}
          

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-5">
              <span
                className={`absolute left-0 w-full h-0.5 bg-white transition-all duration-300 ${
                  isOpen ? "top-1/2 rotate-45 -translate-y-1/2" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 w-full h-0.5 bg-white transition-all duration-300 ${
                  isOpen ? "opacity-0" : "top-1/2 -translate-y-1/2"
                }`}
              />
              <span
                className={`absolute left-0 w-full h-0.5 bg-white transition-all duration-300 ${
                  isOpen ? "top-1/2 -rotate-45 -translate-y-1/2" : "bottom-0"
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer/Sidebar - Light Theme */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer - Light Theme */}
        <div
          className={`absolute top-0 right-0 w-4/5 max-w-sm h-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-2xl transition-transform duration-500 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-amber-200">
            <span className="text-amber-800 text-2xl font-semibold tracking-wide">
              kt&t
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-amber-600 hover:text-amber-800 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <div className="flex flex-col p-6 space-y-4">
            <Link
              href="/"
              onClick={handleLinkClick}
              className={`text-gray-700 hover:text-amber-600 text-lg font-medium py-2 transition-colors duration-200 ${
                pathname === "/" ? "text-amber-600" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/discover"
              onClick={handleLinkClick}
              className={`text-gray-700 hover:text-amber-600 text-lg font-medium py-2 transition-colors duration-200 ${
                pathname === "/discover" ? "text-amber-600" : ""
              }`}
            >
              Discover
            </Link>
            <Link
              href="/review"
              onClick={handleLinkClick}
              className={`text-gray-700 hover:text-amber-600 text-lg font-medium py-2 transition-colors duration-200 ${
                pathname === "/review" ? "text-amber-600" : ""
              }`}
            >
              Reviews
            </Link>
            <Link
              href="/about"
              onClick={handleLinkClick}
              className={`text-gray-700 hover:text-amber-600 text-lg font-medium py-2 transition-colors duration-200 ${
                pathname === "/about" ? "text-amber-600" : ""
              }`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={handleLinkClick}
              className={`text-gray-700 hover:text-amber-600 text-lg font-medium py-2 transition-colors duration-200 ${
                pathname === "/contact" ? "text-amber-600" : ""
              }`}
            >
              Contact Us
            </Link>

            {/* Divider */}
            <div className="my-4 h-px bg-amber-200" />

            {/* Book Now Button in Drawer */}
            <Link href="/book" onClick={handleLinkClick}>
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-md">
                Book Now
              </button>
            </Link>

            {/* Contact Info - Light Theme */}
            <div className="mt-8 pt-6 border-t border-amber-200">
              <p className="text-amber-700 text-sm font-semibold mb-2">
                Contact Us
              </p>
              <a
                href="tel:+919876543210"
                className="text-gray-600 hover:text-amber-600 text-sm block mb-1 transition-colors"
              >
                📞 +91 96977 76463
              </a>
              <a
                href="mailto:atul@gmail.com"
                className="text-gray-600 hover:text-amber-600 text-sm block transition-colors"
              >
                ✉️ atul@gmail.com
              </a>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <p className="text-amber-700 text-sm font-semibold mb-3">
                Follow Us
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-500 hover:text-amber-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-amber-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-amber-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.5-11.758c0-.214-.005-.427-.014-.637A10.015 10.015 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
