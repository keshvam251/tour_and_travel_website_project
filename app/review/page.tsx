'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Fallback hardcoded reviews (shown when Firebase has no data)
const fallbackReviews = [
  {
    id: 'f1',
    name: "Aarav Sharma",
    location: "Delhi, India",
    rating: 5,
    date: "March 2026",
    review: "The Dal Lake houseboat experience was absolutely magical! Waking up to the sunrise over the lake, the shikara rides, and the warm hospitality of the locals made this trip unforgettable. Kavya Tours arranged everything perfectly!",
    tripType: "Family Trip",
    region: "Kashmir Valley"
  },
  {
    id: 'f2',
    name: "Meera Gupta",
    location: "Mumbai, India",
    rating: 5,
    date: "February 2026",
    review: "Gulmarg in winter is a dream! The snow-capped mountains, the gondola ride to Apharwat Peak, and the skiing experience were world-class. The team ensured we had the best accommodations and guides.",
    tripType: "Adventure Trip",
    region: "Gulmarg"
  },
  {
    id: 'f3',
    name: "Vikram Singh",
    location: "Chandigarh, India",
    rating: 5,
    date: "January 2026",
    review: "Pahalgam's beauty is beyond words! The lush green meadows, the Lidder River flowing alongside, and the Betaab Valley trek were highlights. Thank you for curating such a peaceful getaway.",
    tripType: "Honeymoon",
    region: "Pahalgam"
  },
  {
    id: 'f4',
    name: "Neha Khanna",
    location: "Bangalore, India",
    rating: 5,
    date: "December 2025",
    review: "Sonamarg - truly the 'Meadow of Gold'! The Thajiwas Glacier trek was incredible. Our guide was so knowledgeable about the local culture and history. A must-visit destination with Kavya Tours!",
    tripType: "Solo Trip",
    region: "Sonamarg"
  },
  {
    id: 'f5',
    name: "Rajesh Kumar",
    location: "Jaipur, India",
    rating: 4,
    date: "November 2025",
    review: "Exploring the Tibetan culture in Dharamshala was enriching. The McLeod Ganj experience, the monasteries, and the scenic views of the Dhauladhar range were spectacular. Great arrangements!",
    tripType: "Cultural Tour",
    region: "Himachal Pradesh"
  },
  {
    id: 'f6',
    name: "Ankit Mehra",
    location: "Pune, India",
    rating: 5,
    date: "September 2025",
    review: "Ladakh is a biker's paradise! The Pangong Lake, Nubra Valley, and the highest motorable road - Khardung La - were challenges we conquered with Kavya Tours' excellent support. Unforgettable!",
    tripType: "Adventure Trip",
    region: "Ladakh"
  }
];

const ReviewCard = ({ review }: { review: any }) => {
  if (!review) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-amber-200 hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="mb-4">
        <span className="inline-block bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold">
          {review.region}
        </span>
      </div>

      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < review.rating ? 'text-amber-500' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">
        &quot;{review.review}&quot;
      </p>

      <div className="flex items-center justify-between border-t border-amber-100 pt-4">
        <div>
          <h4 className="text-gray-900 font-semibold text-lg">{review.name}</h4>
          <p className="text-amber-600 text-sm font-medium">{review.location}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">{review.tripType}</p>
          <p className="text-amber-500 text-xs">{review.date}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function ReviewsPage() {
  const [allReviews, setAllReviews] = useState<any[]>(fallbackReviews);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("All");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    tripType: 'Family Trip',
    region: 'Kashmir Valley',
    review: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch reviews from Firebase
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const firebaseReviews = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (firebaseReviews.length > 0) {
          setAllReviews(firebaseReviews);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        // Keep fallback reviews on error
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Clamp currentIndex when allReviews changes to prevent out-of-bounds
  useEffect(() => {
    if (allReviews.length === 0) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prev) => prev >= allReviews.length ? 0 : prev);
    }
  }, [allReviews]);

  // Auto-rotate carousel
  useEffect(() => {
    if (allReviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allReviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [allReviews]);

  const nextReview = () => {
    if (allReviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % allReviews.length);
  };

  const prevReview = () => {
    if (allReviews.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + allReviews.length) % allReviews.length);
  };

  // Handle review submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.review || !formData.location) return;

    try {
      setSubmitting(true);
      const dateObj = new Date();
      const month = dateObj.toLocaleString('default', { month: 'long' });
      const year = dateObj.getFullYear();
      const formattedDate = `${month} ${year}`;

      await addDoc(collection(db, 'reviews'), {
        ...formData,
        date: formattedDate,
        createdAt: Timestamp.now()
      });

      setFormData({
        name: '', location: '', rating: 5, tripType: 'Family Trip', region: 'Kashmir Valley', review: ''
      });
      setSubmitSuccess(true);
      setShowForm(false);
      setTimeout(() => setSubmitSuccess(false), 5000);

      // Refresh reviews
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const firebaseReviews = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (firebaseReviews.length > 0) {
        setAllReviews(firebaseReviews);
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const regions = ["All", ...Array.from(new Set(allReviews.map((r: any) => r.region)))];
  const filteredReviews = selectedRegion === "All" ? allReviews : allReviews.filter((r: any) => r.region === selectedRegion);
  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);

  return (
    <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Traveler&apos;s <span className="text-amber-600">Voices</span>
            </h2>
            <div className="w-24 h-0.5 bg-amber-500 mx-auto my-4 rounded-full" />
            <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Real stories from the heart of Jammu & Kashmir and the Himalayas
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {showForm ? 'Cancel' : '✍️ Share Your Experience'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto mb-8 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3"
          >
            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">Thank you! Your review has been submitted successfully.</p>
          </motion.div>
        )}

        {/* Submission Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-w-3xl mx-auto mb-16 overflow-hidden"
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Where are you from? *</label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                        placeholder="Delhi, India"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <select
                        value={formData.rating}
                        onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white transition-all"
                      >
                        {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                      <select
                        value={formData.tripType}
                        onChange={e => setFormData({ ...formData, tripType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white transition-all"
                      >
                        {['Family Trip', 'Couple / Honeymoon', 'Solo Trip', 'Adventure Trip', 'Pilgrimage', 'Friends Group'].map(type =>
                          <option key={type} value={type}>{type}</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Region Visited</label>
                      <select
                        value={formData.region}
                        onChange={e => setFormData({ ...formData, region: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white transition-all"
                      >
                        {['Kashmir Valley', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Ladakh', 'Himachal Pradesh', 'Jammu Region', 'Other'].map(r =>
                          <option key={r} value={r}>{r}</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                    <textarea
                      required
                      value={formData.review}
                      onChange={e => setFormData({ ...formData, review: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none transition-all"
                      placeholder="Tell us about your experience..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <>
            {/* Main Review Carousel */}
            <div className="max-w-4xl mx-auto relative mb-16">
              <div className="relative">
                <AnimatePresence mode="wait">
                  {allReviews[currentIndex] && (
                    <ReviewCard key={currentIndex} review={allReviews[currentIndex]} />
                  )}
                </AnimatePresence>

                <button onClick={prevReview} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white hover:bg-amber-50 rounded-full p-2 shadow-lg border border-amber-200 transition-all duration-200">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={nextReview} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white hover:bg-amber-50 rounded-full p-2 shadow-lg border border-amber-200 transition-all duration-200">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center gap-2 mt-8">
                {allReviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 h-2 bg-amber-600' : 'w-2 h-2 bg-amber-300 hover:bg-amber-400'}`}
                  />
                ))}
              </div>
            </div>

            {/* Region Filter */}
            <div className="mb-12 flex flex-wrap justify-center gap-3">
              {regions.map((region) => (
                <button
                  key={region as string}
                  onClick={() => { setSelectedRegion(region as string); setShowAllReviews(false); }}
                  className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${selectedRegion === region ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-amber-100 border border-amber-200'}`}
                >
                  {region as string}
                </button>
              ))}
            </div>

            {/* Reviews Grid */}
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl md:text-3xl font-playfair text-gray-900">
                More <span className="text-amber-600">Stories</span> from Travelers
              </h3>
              {filteredReviews.length > 3 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="group flex items-center gap-2 bg-white hover:bg-amber-50 text-amber-600 font-semibold px-5 py-2 rounded-full border border-amber-200 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {showAllReviews ? <span>Show Less</span> : <span>See More Reviews</span>}
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={showAllReviews ? "all" : "few"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {displayedReviews.map((review: any, idx: number) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-xl p-6 border border-amber-200 hover:shadow-lg transition-all duration-300 hover:border-amber-300"
                  >
                    <div className="mb-3">
                      <span className="inline-block bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">{review.region}</span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < review.rating ? 'text-amber-500' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">{review.review}</p>
                    <div className="flex items-center justify-between border-t border-amber-100 pt-3">
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">{review.name}</p>
                        <p className="text-amber-600 text-xs">{review.location}</p>
                      </div>
                      <p className="text-gray-400 text-xs">{review.tripType}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {displayedReviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No reviews found for this region.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}