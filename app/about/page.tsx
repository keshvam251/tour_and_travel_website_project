'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-amber-600">Us</span>
          </h1>
          <div className="w-20 h-0.5 bg-amber-500 mx-auto rounded-full" />
        </motion.div>

        {/* Company Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Kavya Holiday Tour and Travel</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We are a trusted travel agency specializing in Kashmir and Himalayan tours. 
            With years of experience, we provide quality travel services at affordable prices.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to make your travel experience memorable, safe, and hassle-free.
          </p>
        </motion.div>

        {/* Our Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              '✈️ Tour Packages',
              '🚗 Vehicle Rentals',
              '🏨 Hotel Booking',
              '📍 Sightseeing Tours',
              '👥 Group Tours',
              '💑 Honeymoon Packages',
            ].map((service, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <span className="text-xl">{service}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: '💰', title: 'Best Prices', desc: 'Affordable packages without hidden charges' },
              { icon: '🛡️', title: 'Safe Travel', desc: 'Experienced drivers & well-maintained vehicles' },
              { icon: '📞', title: '24/7 Support', desc: 'Always available to assist you' },
              { icon: '✏️', title: 'Customizable', desc: 'Tailor-made itineraries as per your needs' },
            ].map((item, index) => (
              <div key={index} className="text-center p-4 border border-amber-100 rounded-xl">
                <span className="text-3xl block mb-2">{item.icon}</span>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-center text-white shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-3">Ready to Travel?</h2>
          <p className="mb-6">Contact us today to plan your dream vacation</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <button className="bg-white text-amber-600 px-6 py-3 rounded-full font-semibold hover:bg-amber-50 transition">
                Contact Us
              </button>
            </Link>
            <Link href="/packages">
              <button className="bg-amber-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-800 transition">
                View Packages
              </button>
            </Link>
          </div>
        </motion.div>

      </div>
    </main>
  );
}