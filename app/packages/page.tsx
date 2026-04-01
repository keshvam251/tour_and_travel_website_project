'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type PackageItem = {
  id: string;
  title: string;
  duration: string;
  price: string;
  startingFrom: string;
  destinations: string[];
  inclusions: string[];
  highlights: string[];
  category: string;
  image: string;
  featured: boolean;
  createdAt: any;
};

const categoryColors: Record<string, string> = {
  'Popular': 'bg-amber-500 text-white',
  'Best Seller': 'bg-emerald-500 text-white',
  'Honeymoon': 'bg-rose-500 text-white',
  'Adventure': 'bg-blue-500 text-white',
  'Budget': 'bg-violet-500 text-white',
  'Pilgrimage': 'bg-orange-500 text-white',
  'Premium': 'bg-yellow-600 text-white',
  'Group': 'bg-teal-500 text-white',
};

const categoryIcons: Record<string, string> = {
  'Popular': '🔥',
  'Best Seller': '⭐',
  'Honeymoon': '💕',
  'Adventure': '🏔️',
  'Budget': '💰',
  'Pilgrimage': '🙏',
  'Premium': '👑',
  'Group': '👥',
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const q = query(collection(db, 'packages'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const firebasePackages = snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as PackageItem));
      
      setPackages(firebasePackages);
      
      if (firebasePackages.length === 0) {
        setError('No packages available. Please add packages from admin dashboard.');
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = (packageTitle?: string) => {
    const phoneNumber = '9697776463';
    let message = 'Hello! I am interested in booking a tour package.';
    
    if (packageTitle) {
      message = `Hello! I am interested in booking the "${packageTitle}" tour package. Could you please provide more details?`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const categories = ['All', ...Array.from(new Set(packages.map(p => p.category)))];
  const filteredPackages = selectedCategory === 'All' ? packages : packages.filter(p => p.category === selectedCategory);
  const featuredPackages = packages.filter(p => p.featured);

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading packages...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && packages.length === 0) {
    return (
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-6">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Packages Available</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchPackages}
              className="px-6 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <span>🏔️</span> Explore Paradise
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4">
            Tour <span className="text-amber-600">Packages</span>
          </h1>
          <div className="w-24 h-0.5 bg-amber-500 mx-auto my-6 rounded-full" />
          <p className="font-inter text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Curated Kashmir & Himalayan experiences — from budget-friendly getaways to premium luxury tours.
            <br />
            <span className="text-amber-600 font-medium">Choose your dream adventure today!</span>
          </p>
        </motion.div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12"
        >
          {[
            { icon: '🗺️', label: 'Tour Packages', value: `${packages.length}+` },
            { icon: '📍', label: 'Destinations', value: '15+' },
            { icon: '🚗', label: 'Vehicle Options', value: 'Ertiga, Innova, Tempo' },
            { icon: '📞', label: 'Support', value: '24/7' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-amber-100 text-center shadow-sm">
              <span className="text-2xl mb-1 block">{stat.icon}</span>
              <p className="text-gray-900 font-bold text-sm">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Category Filter - Only show if packages exist */}
        {packages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/25'
                    : 'bg-white text-gray-700 hover:bg-amber-50 border border-amber-200 hover:border-amber-300'
                }`}
              >
                {cat !== 'All' && <span className="mr-1">{categoryIcons[cat] || '📦'}</span>}
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Featured Banner (only on "All" category) */}
        {selectedCategory === 'All' && featuredPackages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-amber-500">★</span> Featured Packages
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPackages.slice(0, 2).map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500 rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/20 group"
                >
                  {pkg.image && (
                    <div className="absolute inset-0 opacity-20">
                      <img src={pkg.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="relative p-6 md:p-8 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold backdrop-blur-sm">
                          {categoryIcons[pkg.category]} {pkg.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 text-xs">Starting from</p>
                        <p className="text-3xl font-bold">{pkg.price}</p>
                        <p className="text-white/70 text-xs">Per Person • {pkg.startingFrom}</p>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{pkg.title}</h3>
                    <p className="text-white/80 text-sm mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {pkg.duration}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {pkg.destinations.map((dest, i) => (
                        <span key={i} className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                          📍 {dest}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleWhatsAppClick(pkg.title)}
                        className="flex-1 bg-white text-amber-600 font-bold py-3 rounded-xl hover:bg-amber-50 transition-all shadow-lg text-sm"
                      >
                        Book Now on WhatsApp →
                      </button>
                      <button
                        onClick={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
                        className="bg-white/20 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-xl hover:bg-white/30 transition-all text-sm"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Packages Grid */}
        {packages.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900 mb-6">
                {selectedCategory === 'All' ? 'All' : selectedCategory} <span className="text-amber-600">Packages</span>
              </h2>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredPackages.map((pkg, idx) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100 hover:border-amber-200 group flex flex-col"
                  >
                    {/* Package Header */}
                    <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 p-5">
                      {pkg.image && (
                        <div className="absolute inset-0 opacity-30">
                          <img src={pkg.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${categoryColors[pkg.category] || 'bg-gray-500 text-white'}`}>
                            {categoryIcons[pkg.category]} {pkg.category}
                          </span>
                          {pkg.featured && (
                            <span className="text-amber-400 text-xs font-semibold flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="text-white font-bold text-lg leading-tight mb-1">{pkg.title}</h3>
                        <p className="text-white/60 text-sm flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {pkg.duration}
                        </p>
                      </div>
                    </div>

                    {/* Price Bar */}
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-xs">Starting from</p>
                        <p className="text-white font-bold text-2xl">{pkg.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/80 text-xs">Per Person</p>
                        <p className="text-white text-xs font-medium">{pkg.startingFrom}</p>
                      </div>
                    </div>

                    {/* Destinations */}
                    <div className="p-5 flex-1">
                      <h4 className="text-gray-900 font-semibold text-sm mb-3 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Destinations
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {pkg.destinations.map((dest, i) => (
                          <span key={i} className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full border border-amber-200">
                            {dest}
                          </span>
                        ))}
                      </div>

                      {/* Highlights */}
                      {pkg.highlights && pkg.highlights.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-gray-900 font-semibold text-sm mb-2">✨ Highlights</h4>
                          <div className="space-y-1">
                            {pkg.highlights.map((h, i) => (
                              <p key={i} className="text-gray-600 text-xs flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0"></span>
                                {h}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expandable Inclusions */}
                      <AnimatePresence>
                        {expandedPackage === pkg.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <h4 className="text-gray-900 font-semibold text-sm mb-2 mt-2">📋 Inclusions</h4>
                            <div className="space-y-1.5 mb-2">
                              {pkg.inclusions.map((inc, i) => (
                                <p key={i} className="text-gray-600 text-xs flex items-start gap-2">
                                  <svg className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                  {inc}
                                </p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <div className="p-5 pt-0 space-y-2">
                      <button
                        onClick={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
                        className="w-full text-amber-600 hover:bg-amber-50 font-medium py-2 rounded-xl transition-all text-sm border border-amber-200"
                      >
                        {expandedPackage === pkg.id ? 'Show Less ↑' : 'View Details ↓'}
                      </button>
                      <button
                        onClick={() => handleWhatsAppClick(pkg.title)}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.725 3.891 1.746 5.321l-.996 3.702 3.739-1.722z"/>
                          <path d="M17.394 14.706c-.204-.307-.768-.482-1.092-.595-.324-.113-.846-.376-1.158-.426-.312-.05-.558.038-.768.307-.281.33-.505.548-.708.667-.203.119-.407.125-.746-.036-.339-.161-1.139-.441-2.165-1.342-.801-.704-1.341-1.572-1.498-1.839-.157-.266-.017-.41.118-.543.122-.12.271-.313.407-.469.136-.156.181-.267.272-.445.09-.178.045-.334-.023-.468-.068-.134-.602-1.424-.826-1.95-.217-.511-.438-.441-.603-.449-.159-.008-.341-.01-.523-.01-.182 0-.478.068-.728.34-.25.273-.954.916-.954 2.234 0 1.318.976 2.592 1.112 2.771.136.179 1.913 2.863 4.656 3.888.65.243 1.158.388 1.554.497.653.174 1.247.149 1.717.091.524-.066 1.614-.647 1.842-1.272.228-.625.228-1.16.159-1.271-.068-.111-.25-.179-.455-.285z"/>
                        </svg>
                        Book on WhatsApp
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredPackages.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No packages found for this category.</p>
              </div>
            )}
          </>
        )}

        {/* Vehicle Fleet Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900 text-center mb-3">
            Choose Your <span className="text-amber-600">Comfortable Ride</span>
          </h2>
          <p className="text-gray-500 text-center mb-10 text-sm">Our reliable vehicles and expert drivers for a safe journey</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Maruti Suzuki Ertiga', type: 'Efficient 7-Seater', icon: '🚗', best: 'Small Families' },
              { name: 'Toyota Innova', type: 'Premium 7-Seater', icon: '🚙', best: 'Comfort Seekers' },
              { name: 'Maruti Suzuki Rumion', type: 'Premium 7-Seater', icon: '🚗', best: 'Premium Travel' },
              { name: 'Tempo Traveller', type: '12/17 Seater', icon: '🚌', best: 'Group Travel' },
            ].map((vehicle, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-5 border border-amber-100 shadow-sm hover:shadow-md transition-all text-center group hover:border-amber-300"
              >
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{vehicle.icon}</span>
                <h3 className="text-gray-900 font-bold text-sm">{vehicle.name}</h3>
                <p className="text-amber-600 text-xs font-medium mt-1">{vehicle.type}</p>
                <p className="text-gray-400 text-xs mt-2">Best for: {vehicle.best}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tour Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 text-white mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            🚌 Our Exclusive <span className="text-amber-400">Tour Features</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '💰', title: 'Affordable Packages', desc: 'Quality service at the best prices' },
              { icon: '🛡️', title: 'Safe Journeys', desc: 'Experienced drivers & maintained vehicles' },
              { icon: '✏️', title: 'Customized Itineraries', desc: 'Tailored to your specific needs' },
              { icon: '🚗', title: 'Full Vehicle Fleet', desc: 'Ertiga, Innova, Rumion & Tempo Traveller' },
              { icon: '📞', title: '24/7 Support', desc: 'Dedicated customer support anytime' },
              { icon: '🍽️', title: 'Meals Included', desc: 'Breakfast & dinner in most packages' },
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-amber-400/30 transition-all">
                <span className="text-2xl block mb-2">{feature.icon}</span>
                <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-white/60 text-xs">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA - Book Now */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl shadow-amber-500/20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Book Your Dream Kashmir Tour Now! 📞</h2>
          <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
            Contact <strong>Kavya Holiday Tour and Travel</strong> today to check availability and book your personalized tour package!
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => handleWhatsAppClick()}
              className="bg-white text-amber-600 font-bold px-6 py-3 rounded-full hover:bg-amber-50 transition-all shadow-lg text-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.725 3.891 1.746 5.321l-.996 3.702 3.739-1.722z"/>
                <path d="M17.394 14.706c-.204-.307-.768-.482-1.092-.595-.324-.113-.846-.376-1.158-.426-.312-.05-.558.038-.768.307-.281.33-.505.548-.708.667-.203.119-.407.125-.746-.036-.339-.161-1.139-.441-2.165-1.342-.801-.704-1.341-1.572-1.498-1.839-.157-.266-.017-.41.118-.543.122-.12.271-.313.407-.469.136-.156.181-.267.272-.445.09-.178.045-.334-.023-.468-.068-.134-.602-1.424-.826-1.95-.217-.511-.438-.441-.603-.449-.159-.008-.341-.01-.523-.01-.182 0-.478.068-.728.34-.25.273-.954.916-.954 2.234 0 1.318.976 2.592 1.112 2.771.136.179 1.913 2.863 4.656 3.888.65.243 1.158.388 1.554.497.653.174 1.247.149 1.717.091.524-.066 1.614-.647 1.842-1.272.228-.625.228-1.16.159-1.271-.068-.111-.25-.179-.455-.285z"/>
              </svg>
              Chat on WhatsApp
            </button>
          </div>
          <p className="text-white/50 text-xs">*Price subject to change. Terms and conditions apply.</p>
        </motion.div>

      </div>
    </section>
  );
}