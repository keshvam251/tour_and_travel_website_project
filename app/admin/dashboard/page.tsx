'use client';

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type GalleryItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  image: string;
  createdAt: any;
};

type ReviewItem = {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  tripType: string;
  region: string;
  date: string;
  createdAt: any;
};

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

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'gallery' | 'reviews' | 'packages'>('gallery');

  // Gallery states
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', location: '' });
  const [selectedBase64, setSelectedBase64] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Review states
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Package states
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [packageSubmitting, setPackageSubmitting] = useState(false);
  const [packageForm, setPackageForm] = useState({
    title: '',
    duration: '',
    price: '',
    startingFrom: '',
    destinations: '',
    inclusions: '',
    highlights: '',
    category: 'Popular',
    featured: false,
  });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);

  // Compress image and return base64 data URL
  const compressImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new window.Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions to keep file size manageable
          const maxWidth = 1200;
          const maxHeight = 900;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 data URL (JPEG at 60% quality to stay under Firestore 1MB limit)
          const base64 = canvas.toDataURL('image/jpeg', 0.6);
          resolve(base64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/admin/login');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch gallery
  const fetchGallery = useCallback(async () => {
    setGalleryLoading(true);
    try {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setGalleryItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem)));
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() } as ReviewItem)));
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  // Fetch packages
  const fetchPackages = useCallback(async () => {
    setPackagesLoading(true);
    try {
      const q = query(collection(db, 'packages'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setPackages(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as PackageItem)));
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setPackagesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchGallery();
      fetchReviews();
      fetchPackages();
    }
  }, [user, fetchGallery, fetchReviews, fetchPackages]);

  // File selection handler with compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be under 10MB');
        return;
      }

      // Compress and convert to base64
      try {
        const base64 = await compressImageToBase64(file);
        setSelectedBase64(base64);
        setPreviewUrl(base64);
        const sizeKB = (base64.length * 0.75 / 1024).toFixed(0);
        console.log(`Compressed to ~${sizeKB}KB base64`);
      } catch (err) {
        console.error('Compression error:', err);
        // Fallback: read as-is
        const reader = new FileReader();
        reader.onload = (ev) => {
          const result = ev.target?.result as string;
          setSelectedBase64(result);
          setPreviewUrl(result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Upload gallery photo (saves base64 directly to Firestore)
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBase64 || !uploadForm.title) {
      alert('Please fill all required fields');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for UX
      setUploadProgress(30);

      // Save image as base64 directly to Firestore
      await addDoc(collection(db, 'gallery'), {
        title: uploadForm.title.trim(),
        description: uploadForm.description.trim(),
        location: uploadForm.location.trim(),
        image: selectedBase64,
        createdAt: Timestamp.now()
      });

      setUploadProgress(100);

      // Reset form
      setUploadForm({ title: '', description: '', location: '' });
      setSelectedBase64(null);
      setPreviewUrl(null);
      setShowUploadForm(false);
      setUploadProgress(0);
      await fetchGallery();
      alert('Photo uploaded successfully!');

    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Delete gallery item
  const deleteGalleryItem = async (item: GalleryItem) => {
    try {
      await deleteDoc(doc(db, 'gallery', item.id));
      await fetchGallery();
      alert('Photo deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete photo.');
    }
    setDeleteConfirm(null);
  };

  // Delete review
  const deleteReview = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
      await fetchReviews();
      alert('Review deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete review.');
    }
    setDeleteConfirm(null);
  };

  // Add package
  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageForm.title || !packageForm.price || !packageForm.duration) {
      alert('Please fill required fields (Title, Price, Duration)');
      return;
    }
    setPackageSubmitting(true);
    try {
      await addDoc(collection(db, 'packages'), {
        title: packageForm.title.trim(),
        duration: packageForm.duration.trim(),
        price: packageForm.price.trim(),
        startingFrom: packageForm.startingFrom.trim(),
        destinations: packageForm.destinations.split(',').map((s: string) => s.trim()).filter(Boolean),
        inclusions: packageForm.inclusions.split(',').map((s: string) => s.trim()).filter(Boolean),
        highlights: packageForm.highlights.split(',').map((s: string) => s.trim()).filter(Boolean),
        category: packageForm.category,
        image: '',
        featured: packageForm.featured,
        createdAt: Timestamp.now()
      });
      setPackageForm({ title: '', duration: '', price: '', startingFrom: '', destinations: '', inclusions: '', highlights: '', category: 'Popular', featured: false });
      setShowPackageForm(false);
      await fetchPackages();
      alert('Package added successfully!');
    } catch (err) {
      console.error('Error adding package:', err);
      alert('Failed to add package.');
    } finally {
      setPackageSubmitting(false);
    }
  };

  // Delete package
  const deletePackage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'packages', id));
      await fetchPackages();
      alert('Package deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete package.');
    }
    setDeleteConfirm(null);
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Top Header */}
      <header className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin Dashboard</h1>
              <p className="text-slate-400 text-xs">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{galleryItems.length}</p>
              <p className="text-slate-400 text-sm">Gallery Photos</p>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{reviews.length}</p>
              <p className="text-slate-400 text-sm">User Reviews</p>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{packages.length}</p>
              <p className="text-slate-400 text-sm">Tour Packages</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-1.5 mb-8">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${activeTab === 'gallery'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
          >
            📸 Gallery
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${activeTab === 'packages'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
          >
            📦 Packages
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${activeTab === 'reviews'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
          >
            💬 Reviews
          </button>
        </div>

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div>
            {/* Upload Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Gallery Photos</h2>
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${showUploadForm
                    ? 'bg-slate-700 text-slate-300'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                  }`}
              >
                {showUploadForm ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Upload Photo
                  </>
                )}
              </button>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
                <h3 className="text-white font-semibold text-lg mb-4">Add New Photo</h3>
                <form onSubmit={handleUpload} className="space-y-4">
                  {/* File Drop Area */}
                  <div
                    className="border-2 border-dashed border-slate-600 hover:border-amber-500/50 rounded-xl p-6 text-center transition-colors cursor-pointer relative"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    {previewUrl ? (
                      <div className="relative">
                        <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBase64(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="w-10 h-10 text-slate-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="text-slate-400 text-sm">Click to select a photo</p>
                        <p className="text-slate-500 text-xs mt-1">JPG, PNG, WebP up to 10MB (will be compressed)</p>
                      </>
                    )}
                    <input
                      id="file-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">Title *</label>
                      <input
                        type="text"
                        required
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
                        placeholder="e.g. Dal Lake Sunset"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">Location</label>
                      <input
                        type="text"
                        value={uploadForm.location}
                        onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
                        placeholder="e.g. Srinagar, Kashmir"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">Description</label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                      placeholder="Brief description of the photo..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={uploading || !selectedBase64}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading {Math.round(uploadProgress)}%
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload Photo
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Gallery Grid */}
            {galleryLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : galleryItems.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
                <p className="text-slate-400 text-lg font-medium">No photos yet</p>
                <p className="text-slate-500 text-sm mt-1">Upload your first gallery photo above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryItems.map((item) => (
                  <div key={item.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden group">
                    <div className="relative aspect-[4/3] bg-slate-700">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => setDeleteConfirm({ type: 'gallery', id: item.id })}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-sm truncate">{item.title}</h3>
                      {item.location && (
                        <p className="text-amber-400 text-xs mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {item.location}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-slate-400 text-xs mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">User Reviews</h2>
              <button
                onClick={fetchReviews}
                className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-slate-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {reviewsLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                <p className="text-slate-400 text-lg font-medium">No reviews yet</p>
                <p className="text-slate-500 text-sm mt-1">Reviews submitted by users will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                            {review.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-white font-semibold text-sm truncate">{review.name}</h3>
                            <p className="text-slate-400 text-xs">{review.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < review.rating ? 'text-amber-400' : 'text-slate-600'}`}>★</span>
                            ))}
                          </div>
                          <span className="text-slate-500 text-xs">•</span>
                          <span className="text-slate-500 text-xs">{review.tripType}</span>
                          <span className="text-slate-500 text-xs">•</span>
                          <span className="bg-slate-700/50 text-slate-300 text-xs px-2 py-0.5 rounded-full">{review.region}</span>
                        </div>

                        <p className="text-slate-300 text-sm leading-relaxed">&quot;{review.review}&quot;</p>
                        <p className="text-slate-500 text-xs mt-2">{review.date}</p>
                      </div>

                      <button
                        onClick={() => setDeleteConfirm({ type: 'review', id: review.id })}
                        className="text-slate-500 hover:text-red-400 transition-colors shrink-0 p-1.5 rounded-lg hover:bg-red-500/10"
                        title="Delete review"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Tour Packages</h2>
              <button
                onClick={() => setShowPackageForm(!showPackageForm)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${showPackageForm
                    ? 'bg-slate-700 text-slate-300'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                  }`}
              >
                {showPackageForm ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Package
                  </>
                )}
              </button>
            </div>

            {/* Add Package Form */}
            {showPackageForm && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
                <h3 className="text-white font-semibold text-lg mb-4">Create New Package</h3>
                <form onSubmit={handleAddPackage} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">Package Title *</label>
                      <input
                        type="text"
                        required
                        value={packageForm.title}
                        onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
                        placeholder="e.g. Jammu & Kashmir Complete Tour"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">Duration *</label>
                      <input
                        type="text"
                        required
                        value={packageForm.duration}
                        onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
                        placeholder="e.g. 9 Days / 10 Nights"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">Price *</label>
                      <input
                        type="text"
                        required
                        value={packageForm.price}
                        onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
                        placeholder="e.g. ₹28,500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">Starting From</label>
                      <input
                        type="text"
                        value={packageForm.startingFrom}
                        onChange={(e) => setPackageForm({ ...packageForm, startingFrom: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
                        placeholder="e.g. Ex Delhi"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-1.5">Category</label>
                      <select
                        value={packageForm.category}
                        onChange={(e) => setPackageForm({ ...packageForm, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-amber-500/50 transition-all"
                      >
                        {['Popular', 'Best Seller', 'Honeymoon', 'Adventure', 'Budget', 'Pilgrimage', 'Premium', 'Group'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">Destinations (comma separated)</label>
                    <input
                      type="text"
                      value={packageForm.destinations}
                      onChange={(e) => setPackageForm({ ...packageForm, destinations: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
                      placeholder="Srinagar, Gulmarg, Pahalgam, Sonamarg"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">Inclusions (comma separated)</label>
                    <textarea
                      value={packageForm.inclusions}
                      onChange={(e) => setPackageForm({ ...packageForm, inclusions: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                      placeholder="Deluxe Hotels, Dal Lake Shikara Ride, AC Transport, All Meals"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">Highlights (comma separated)</label>
                    <input
                      type="text"
                      value={packageForm.highlights}
                      onChange={(e) => setPackageForm({ ...packageForm, highlights: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
                      placeholder="Gondola Ride, Houseboat Stay, Betaab Valley"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured-check"
                      checked={packageForm.featured}
                      onChange={(e) => setPackageForm({ ...packageForm, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500/50"
                    />
                    <label htmlFor="featured-check" className="text-slate-300 text-sm">Mark as Featured Package</label>
                  </div>

                  <button
                    type="submit"
                    disabled={packageSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {packageSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Package
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Packages List */}
            {packagesLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-slate-400 text-lg font-medium">No packages yet</p>
                <p className="text-slate-500 text-sm mt-1">Click &quot;Add Package&quot; to create your first tour package</p>
              </div>
            ) : (
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-white font-semibold">{pkg.title}</h3>
                          <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">{pkg.category}</span>
                          {pkg.featured && <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full">⭐ Featured</span>}
                        </div>
                        <div className="flex items-center gap-4 text-sm mb-3">
                          <span className="text-amber-400 font-bold text-lg">{pkg.price}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-400">{pkg.duration}</span>
                          {pkg.startingFrom && <><span className="text-slate-400">•</span><span className="text-slate-500">{pkg.startingFrom}</span></>}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {pkg.destinations?.map((dest, i) => (
                            <span key={i} className="bg-slate-700/50 text-slate-300 text-xs px-2 py-0.5 rounded-full">📍 {dest}</span>
                          ))}
                        </div>
                        {pkg.inclusions && pkg.inclusions.length > 0 && (
                          <div className="text-slate-400 text-xs mt-2">
                            <span className="text-slate-500">Inclusions:</span> {pkg.inclusions.join(' • ')}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'package', id: pkg.id })}
                        className="text-slate-500 hover:text-red-400 transition-colors shrink-0 p-1.5 rounded-lg hover:bg-red-500/10"
                        title="Delete package"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-2">Confirm Delete</h3>
            <p className="text-slate-400 text-sm text-center mb-6">
              Are you sure you want to delete this {deleteConfirm.type === 'gallery' ? 'photo' : deleteConfirm.type === 'package' ? 'package' : 'review'}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'gallery') {
                    const item = galleryItems.find(i => i.id === deleteConfirm.id);
                    if (item) deleteGalleryItem(item);
                  } else if (deleteConfirm.type === 'package') {
                    deletePackage(deleteConfirm.id);
                  } else {
                    deleteReview(deleteConfirm.id);
                  }
                }}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}