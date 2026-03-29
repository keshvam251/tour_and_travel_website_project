// app/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Reviews data focused on Jammu & Kashmir and nearby regions
const reviews = [
  {
    id: 1,
    name: "Aarav Sharma",
    location: "Srinagar, Jammu & Kashmir",
    rating: 5,
    date: "March 2026",
    review: "The Dal Lake houseboat experience was absolutely magical! Waking up to the sunrise over the lake, the shikara rides, and the warm hospitality of the locals made this trip unforgettable. Kavya Tours arranged everything perfectly!",
    tripType: "Family Trip",
    region: "Kashmir Valley"
  },
  {
    id: 2,
    name: "Meera Gupta",
    location: "Gulmarg, Jammu & Kashmir",
    rating: 5,
    date: "February 2026",
    review: "Gulmarg in winter is a dream! The snow-capped mountains, the gondola ride to Apharwat Peak, and the skiing experience were world-class. The team ensured we had the best accommodations and guides.",
    tripType: "Adventure Trip",
    region: "Gulmarg"
  },
  {
    id: 3,
    name: "Vikram Singh",
    location: "Pahalgam, Jammu & Kashmir",
    rating: 5,
    date: "January 2026",
    review: "Pahalgam's beauty is beyond words! The lush green meadows, the Lidder River flowing alongside, and the Betaab Valley trek were highlights. Thank you for curating such a peaceful getaway.",
    tripType: "Honeymoon",
    region: "Pahalgam"
  },
  {
    id: 4,
    name: "Neha Khanna",
    location: "Sonamarg, Jammu & Kashmir",
    rating: 5,
    date: "December 2025",
    review: "Sonamarg - truly the 'Meadow of Gold'! The Thajiwas Glacier trek was incredible. Our guide was so knowledgeable about the local culture and history. A must-visit destination with Kavya Tours!",
    tripType: "Solo Trip",
    region: "Sonamarg"
  },
  {
    id: 5,
    name: "Rajesh Kumar",
    location: "Dharamshala, Himachal Pradesh",
    rating: 4,
    date: "November 2025",
    review: "Exploring the Tibetan culture in Dharamshala was enriching. The McLeod Ganj experience, the monasteries, and the scenic views of the Dhauladhar range were spectacular. Great arrangements!",
    tripType: "Cultural Tour",
    region: "Himachal Pradesh"
  },
  {
    id: 6,
    name: "Priya Verma",
    location: "Manali, Himachal Pradesh",
    rating: 5,
    date: "October 2025",
    review: "Manali in autumn is breathtaking! The Solang Valley, Rohtang Pass, and the ancient Hadimba Temple - everything was perfectly organized. The local experiences added a special touch.",
    tripType: "Family Trip",
    region: "Himachal Pradesh"
  },
  {
    id: 7,
    name: "Ankit Mehra",
    location: "Leh, Ladakh",
    rating: 5,
    date: "September 2025",
    review: "Ladakh is a biker's paradise! The Pangong Lake, Nubra Valley, and the highest motorable road - Khardung La - were challenges we conquered with Kavya Tours' excellent support. Unforgettable!",
    tripType: "Adventure Trip",
    region: "Ladakh"
  },
  {
    id: 8,
    name: "Sunita Reddy",
    location: "Katra, Jammu & Kashmir",
    rating: 5,
    date: "August 2025",
    review: "The Vaishno Devi pilgrimage was made so comfortable with Kavya Tours' arrangements. The helicopter service, accommodations, and guidance were top-notch. A spiritually fulfilling journey!",
    tripType: "Pilgrimage",
    region: "Jammu Region"
  },
  {
    id: 9,
    name: "Rohit Malhotra",
    location: "Kargil, Ladakh",
    rating: 5,
    date: "July 2025",
    review: "Visiting the Kargil War Memorial was emotional and inspiring. The entire trip through the rugged terrains of Ladakh was well-planned. The local food and hospitality were amazing!",
    tripType: "Heritage Tour",
    region: "Ladakh"
  }
];

const ReviewCard = ({ review }: { review: typeof reviews[0] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-amber-200 hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Region Badge */}
      <div className="mb-4">
        <span className="inline-block bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold">
          {review.region}
        </span>
      </div>

      {/* Rating Stars */}
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

      {/* Review Text */}
      <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">
        "{review.review}"
      </p>

      {/* Customer Info */}
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("All");

  // Get unique regions for filter
  const regions = ["All", ...new Set(reviews.map(r => r.region))];
  
  const filteredReviews = selectedRegion === "All" 
    ? reviews 
    : reviews.filter(r => r.region === selectedRegion);

  // Show only first 3 reviews when not expanded
  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Traveler's <span className="text-amber-600">Voices</span>
            </h1>
            <div className="w-24 h-0.5 bg-amber-500 mx-auto my-4 rounded-full" />
            <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from the heart of Jammu & Kashmir and the Himalayas
            </p>
          </motion.div>
        </div>

        {/* Stats Section with Amber Theme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { number: "500+", label: "Happy Travelers", icon: "😊", color: "amber" },
            { number: "4.9", label: "Average Rating", icon: "⭐", color: "amber" },
            { number: "15+", label: "Destinations in J&K", icon: "🏔️", color: "amber" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-md border border-amber-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-amber-600 mb-1">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Region Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegion(region);
                  setShowAllReviews(false); // Reset show more when changing region
                }}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedRegion === region
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Main Review Carousel - Only showing featured reviews */}
        <div className="max-w-4xl mx-auto relative mb-16">
          <div className="relative">
            <AnimatePresence mode="wait">
              <ReviewCard key={currentIndex} review={reviews[currentIndex]} />
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white hover:bg-amber-50 rounded-full p-2 shadow-lg border border-amber-200 transition-all duration-200"
            >
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white hover:bg-amber-50 rounded-full p-2 shadow-lg border border-amber-200 transition-all duration-200"
            >
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-8 h-2 bg-amber-600'
                    : 'w-2 h-2 bg-amber-300 hover:bg-amber-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Reviews Grid with See More Option */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-playfair text-gray-900">
              More <span className="text-amber-600">Stories</span> from the Himalayas
            </h2>
            {filteredReviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="group flex items-center gap-2 bg-white hover:bg-amber-50 text-amber-600 font-semibold px-5 py-2 rounded-full border border-amber-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {showAllReviews ? (
                  <>
                    <span>Show Less</span>
                    <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>See More Reviews</span>
                    <svg className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={showAllReviews ? "all" : "few"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayedReviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="bg-white rounded-xl p-6 border border-amber-200 hover:shadow-lg transition-all duration-300 hover:border-amber-300"
                >
                  <div className="mb-3">
                    <span className="inline-block bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                      {review.region}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-amber-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {review.review}
                  </p>
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

          {/* Show message when no reviews match filter */}
          {displayedReviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No reviews found for this region.</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center bg-amber-100 rounded-2xl p-8 border border-amber-200"
        >
          <h3 className="text-2xl font-playfair text-gray-900 mb-3">
            Ready to create your own story?
          </h3>
          <p className="text-gray-700 mb-6">
            Join hundreds of happy travelers who explored paradise with us
          </p>
          <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
            Plan Your Kashmir Trip
          </button>
        </motion.div>
      </div>
    </main>
  );
}