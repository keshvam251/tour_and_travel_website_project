'use client';
 
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
 
const galleryData = [
  {
    id: 5,
    title: "Dal Lake, Srinagar",
    description: "Experience the magic of houseboats and shikaras",
    location: "Srinagar, Kashmir",
    image: "/gallery/dal lake.jpg"
  },
  {
    id: 6,
    title: "Gulmarg in Winter",
    description: "World's highest gondola ride and skiing paradise",
    location: "Gulmarg, Kashmir",
    image: "/gallery/gulmarg.jpg"
  },
  {
    id: 7,
    title: "Pahalgam Valley",
    description: "Lush green meadows and Lidder River",
    location: "Pahalgam, Kashmir",
    image: "/gallery/pahalgam.jpg"
  },
  {
    id: 8,
    title: "Pangong Lake, Ladakh",
    description: "The breathtaking blue lake at 14,000 feet",
    location: "Ladakh",
    image: "/gallery/pangkok.jpg"
  },
  {
    id: 9,
    title: "Nubra Valley",
    description: "Sand dunes and double-humped camels",
    location: "Ladakh",
    image: "/gallery/nubra.jpg"
  },
  {
    id: 10,
    title: "Betaab Valley",
    description: "Beautiful valley named after the Bollywood movie",
    location: "Pahalgam, Kashmir",
    image: "/gallery/valley.jpg"
  },
  {
    id: 11,
    title: "Sonamarg",
    description: "Meadow of Gold with stunning glaciers",
    location: "Kashmir",
    image: "/gallery/sonmarg.jpg"
  },
  {
    id: 12,
    title: "Leh Ladakh",
    description: "explor the  unexplored gem of  leh",
    location: " Ladakh",
    image: "/gallery/ladakh.jpg"
  }
];
 
const INITIAL_VISIBLE = 3;
 
// Image Modal Component
const ImageModal = ({
  image,
  onClose,
}: {
  image: (typeof galleryData)[0];
  onClose: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[55vw] max-h-[65vh] min-h-[220px] bg-gray-900">
          <Image
            src={image.image}
            alt={image.title}
            fill
            className="object-contain"
          />
        </div>
        <div className="p-5">
          <h3 className="text-xl font-playfair font-bold text-gray-900 mb-1">
            {image.title}
          </h3>
          <p className="text-gray-500 text-sm mb-1">{image.description}</p>
          <p className="text-amber-600 text-xs font-medium">📍 {image.location}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
};
 
export default function GalleryPage() {
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<(typeof galleryData)[0] | null>(null);
 
  const visibleImages = showAll ? galleryData : galleryData.slice(0, INITIAL_VISIBLE);
 
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
 
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Photo <span className="text-amber-600">Gallery</span>
          </h1>
          <div className="w-20 h-0.5 bg-amber-500 mx-auto my-4 rounded-full" />
          <p className="font-inter text-base text-gray-600 max-w-xl mx-auto">
            Explore breathtaking tour locations across Kashmir &amp; Ladakh
          </p>
        </motion.div>
 
        {/* Gallery Grid — 1 col on mobile, 2 on sm, 3 on lg */}
        <AnimatePresence mode="wait">
          <motion.div
            key={showAll ? 'all' : 'preview'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {visibleImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                {/* Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-100"
                  style={{ aspectRatio: '4/3' }}
                >
                  <Image
                    src={image.image}
                    alt={image.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="font-playfair text-base font-semibold leading-tight mb-0.5">
                      {image.title}
                    </h3>
                    <p className="text-xs text-amber-300">📍 {image.location}</p>
                  </div>
                </div>
                {/* Title below card — visible on mobile always */}
                <div className="mt-2 px-1 sm:hidden">
                  <p className="font-playfair text-sm font-semibold text-gray-800">{image.title}</p>
                  <p className="text-xs text-amber-600">📍 {image.location}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
 
        {/* View All / Show Less Button */}
        {galleryData.length > INITIAL_VISIBLE && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-10"
          >
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="group relative inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
            >
              <span>{showAll ? 'Show Less' : `View All ${galleryData.length} Photos`}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
 
      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}