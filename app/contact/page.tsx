"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const whatsappURL = `https://wa.me/91788934250?text=Hello, my name is ${form.name}. Phone: ${form.phone}. Message: ${form.message}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 flex items-center justify-center">
      <div className="max-w-6xl w-full bg-white shadow-xl rounded-2xl p-8 md:p-12">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-6">
          Contact Us
        </h1>

        <div className="w-20 h-1 bg-amber-500 mx-auto mb-10 rounded-full" />

        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT: Contact Info */}
          <div className="space-y-6">

            <h2 className="text-2xl font-semibold text-gray-800">
              Kaavya Tour & Travel
            </h2>

            <p className="text-gray-600">
              We provide taxi services and ticket booking for your trips.
              Contact us anytime for safe and comfortable travel.
            </p>

            {/* Address */}
            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <p className="text-gray-600">
                Kanyala, near Basant Gate,<br />
                15 Fed Dansal, Jammu
              </p>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <span className="text-xl">📞</span>
              <a href="tel:788934250" className="text-gray-700 hover:text-amber-600">
                788934250
              </a>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center gap-3">
              <span className="text-xl">💬</span>
              <a
                href="https://wa.me/91788934250"
                target="_blank"
                className="text-green-600 hover:underline"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <span className="text-xl">✉️</span>
              <a
                href="mailto:atul@gmail.com"
                className="text-gray-700 hover:text-amber-600"
              >
                atul@gmail.com
              </a>
            </div>

            {/* Timing */}
            <div className="flex items-center gap-3">
              <span className="text-xl">⏰</span>
              <p className="text-gray-600">Mon–Sat: 9 AM – 7 PM</p>
            </div>

          </div>

          {/* RIGHT: Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              required
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              required
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Send via WhatsApp
            </button>
          </form>
        </div>

        {/* MAP SECTION */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Our Location
          </h2>

          <div className="w-full h-80 rounded-xl overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps?q=Jammu&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
            ></iframe>
          </div>
        </div>

      </div>
    </main>
  );
}