'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const INITIAL_VISIBLE = 4;

const ImageModal = ({ image, onClose }: { image: any; onClose: () => void }) => {
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
        className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[60vw] max-h-[70vh] min-h-[300px] bg-gray-900 w-full flex items-center justify-center">
          <img src={image.image} alt={image.title} className="w-full h-full object-contain" />
        </div>
        <div className="p-5 bg-white">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{image.title}</h3>
          {image.description && <p className="text-gray-600 text-sm mb-2">{image.description}</p>}
          {image.location && <p className="text-amber-600 text-sm font-medium">📍 {image.location}</p>}
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default function GalleryPage() {
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [galleryData, setGalleryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGalleryData(items);
      } catch (err) {
        console.error("Error fetching gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const visibleImages = showAll ? galleryData : galleryData.slice(0, INITIAL_VISIBLE);

  return (
    <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Our <span className="text-amber-600">Gallery</span>
          </h2>
          <div className="w-24 h-0.5 bg-amber-500 mx-auto my-6 rounded-full" />
          <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
            Explore breathtaking moments and beautiful destinations captured during our tours.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : galleryData.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No photos have been uploaded yet.</p>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={showAll ? 'all' : 'preview'}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {visibleImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="group cursor-pointer block h-full"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-amber-100 flex flex-col h-full">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                        <img
                          src={image.image}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10">
                          {image.location && (
                            <span className="text-amber-400 text-sm font-medium mb-1 drop-shadow-md flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {image.location}
                            </span>
                          )}
                          <h3 className="font-playfair text-xl font-semibold text-white leading-tight drop-shadow-md">
                            {image.title}
                          </h3>
                        </div>
                      </div>

                      {/* Mobile visible info */}
                      <div className="p-5 flex flex-col flex-grow sm:hidden bg-white">
                        <h3 className="font-playfair text-lg font-bold text-gray-900 mb-1 leading-tight">{image.title}</h3>
                        {image.location && (
                          <p className="text-sm font-medium text-amber-600 mb-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {image.location}
                          </p>
                        )}
                        {image.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mt-auto">{image.description}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* View All Button */}
            {galleryData.length > INITIAL_VISIBLE && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-12"
              >
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="group relative inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white font-medium px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base active:scale-95 border border-amber-500"
                >
                  <span>{showAll ? 'Show Less' : `View All ${galleryData.length} Photos`}</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}