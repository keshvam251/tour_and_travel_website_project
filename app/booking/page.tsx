// app/book/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Tour packages data
const tourPackages = [
  {
    id: 1,
    name: "Kashmir Paradise Tour",
    duration: "5 Days / 4 Nights",
    price: 24999,
    destinations: ["Srinagar", "Gulmarg", "Pahalgam"],
    includes: ["Hotel", "Meals", "Transport", "Sightseeing"],
    highlights: ["Dal Lake Houseboat", "Gondola Ride", "Betaab Valley"]
  },
  {
    id: 2,
    name: "Ladakh Adventure",
    duration: "7 Days / 6 Nights",
    price: 34999,
    destinations: ["Leh", "Nubra Valley", "Pangong Lake"],
    includes: ["Hotel", "Meals", "Transport", "Inner Line Permits"],
    highlights: ["Khardung La Pass", "Pangong Lake", "Diskit Monastery"]
  },
  {
    id: 3,
    name: "Himachal Explorer",
    duration: "6 Days / 5 Nights",
    price: 27999,
    destinations: ["Manali", "Shimla", "Dharamshala"],
    includes: ["Hotel", "Meals", "Transport", "Sightseeing"],
    highlights: ["Rohtang Pass", "Mall Road", "McLeod Ganj"]
  },
  {
    id: 4,
    name: "Vaishno Devi Yatra",
    duration: "3 Days / 2 Nights",
    price: 12999,
    destinations: ["Katra", "Vaishno Devi", "Bhawan"],
    includes: ["Hotel", "Meals", "Transport", "Helicopter Booking"],
    highlights: ["Helicopter Service", "Prasad", "Darshan"]
  },
  {
    id: 5,
    name: "Custom Tour Package",
    duration: "Flexible",
    price: 0,
    destinations: ["Any Destination"],
    includes: ["Customizable Itinerary"],
    highlights: ["Personalized Experience"]
  }
];

// Add-ons options
const addOns = [
  { id: 1, name: "Railway Pickup", price: 599, description: "Pickup amd Drop" },
  { id: 2, name: "Professional Photographer", price: 4999, description: "Capture your memories" },
  { id: 3, name: "Adventure Activities Package", price: 2999, description: "Paragliding, River Rafting, etc." },
  { id: 4, name: "Airport Transfer", price: 1999, description: "Pickup and drop" }
];

export default function BookingPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    packageId: '',
    travelDate: '',
    numberOfTravelers: '1',
    specialRequests: '',
    addOns: [] as number[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const YOUR_PHONE_NUMBER = "7889342650"; 

  const calculateTotal = () => {
    const selectedPackage = tourPackages.find(p => p.id.toString() === formData.packageId);
    let total = selectedPackage ? selectedPackage.price * parseInt(formData.numberOfTravelers) : 0;
    
    // Add add-ons total
    formData.addOns.forEach(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId);
      if (addOn) total += addOn.price;
    });
    
    return total;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOnChange = (addOnId: number) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter(id => id !== addOnId)
        : [...prev.addOns, addOnId]
    }));
  };

  const formatMessage = () => {
    const selectedPackage = tourPackages.find(p => p.id.toString() === formData.packageId);
    const selectedAddOns = addOns.filter(a => formData.addOns.includes(a.id));
    
    return `*NEW BOOKING REQUEST* 🎉
    
*Customer Details:*
👤 Name: ${formData.fullName}
📧 Email: ${formData.email}
📱 Phone: ${formData.phone}
🎂 Age: ${formData.age}
📍 City: ${formData.city}

*Package Details:*
✈️ Package: ${selectedPackage?.name || 'Not selected'}
📅 Travel Date: ${formData.travelDate || 'Not specified'}
👥 Travelers: ${formData.numberOfTravelers}
💰 Package Price: ₹${selectedPackage?.price || 0} x ${formData.numberOfTravelers} = ₹${selectedPackage ? selectedPackage.price * parseInt(formData.numberOfTravelers) : 0}

*Add-ons Selected:*
${selectedAddOns.length > 0 ? selectedAddOns.map(a => `✅ ${a.name} - ₹${a.price}`).join('\n') : '❌ None selected'}

*Total Amount:*
💰 Total: ₹${calculateTotal()}

*Special Requests:*
${formData.specialRequests || 'No special requests'}

---
*Booking Status:* Pending Confirmation
*Booking Source:* Website`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.packageId) {
      alert('Please fill in all required fields (*)');
      return;
    }
    
    setIsSubmitting(true);
    
    const message = encodeURIComponent(formatMessage());
    const whatsappUrl = `https://wa.me/${YOUR_PHONE_NUMBER}?text=${message}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitting(false);
    
    // Optional: Reset form
    // setFormData({
    //   fullName: '',
    //   email: '',
    //   phone: '',
    //   age: '',
    //   city: '',
    //   packageId: '',
    //   travelDate: '',
    //   numberOfTravelers: '1',
    //   specialRequests: '',
    //   addOns: []
    // });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Book Your <span className="text-amber-600">Journey</span>
          </h1>
          <div className="w-24 h-0.5 bg-amber-500 mx-auto my-4 rounded-full" />
          <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
            Fill in your details and we'll help you create unforgettable memories in paradise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form - Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-amber-200"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-2xl font-playfair text-gray-900 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Full Name <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Email <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Phone Number <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                        placeholder="9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                        placeholder="Enter your age"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                        placeholder="Your city"
                      />
                    </div>
                  </div>
                </div>

                {/* Tour Details */}
                <div>
                  <h2 className="text-2xl font-playfair text-gray-900 mb-4">Tour Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Select Package <span className="text-amber-600">*</span>
                      </label>
                      <select
                        name="packageId"
                        value={formData.packageId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                      >
                        <option value="">Select a package</option>
                        {tourPackages.map(pkg => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} - {pkg.duration} (₹{pkg.price.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Travel Date <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="date"
                        name="travelDate"
                        value={formData.travelDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Number of Travelers <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="number"
                        name="numberOfTravelers"
                        value={formData.numberOfTravelers}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Add-ons */}
                <div>
                  <h2 className="text-2xl font-playfair text-gray-900 mb-4">Add-ons (Optional)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {addOns.map(addOn => (
                      <label
                        key={addOn.id}
                        className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-amber-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.addOns.includes(addOn.id)}
                          onChange={() => handleAddOnChange(addOn.id)}
                          className="mt-1 w-4 h-4 text-amber-600 focus:ring-amber-500"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{addOn.name}</p>
                          <p className="text-sm text-gray-600">{addOn.description}</p>
                          <p className="text-amber-600 font-semibold text-sm">+₹{addOn.price}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                    placeholder="Any special requirements, dietary restrictions, or preferences?"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Confirm Booking via WhatsApp'}
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our terms and conditions. You'll be redirected to WhatsApp to confirm your booking.
                </p>
              </form>
            </motion.div>
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="sticky top-24"
            >
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 border border-amber-200 shadow-lg">
                <h2 className="text-2xl font-playfair text-gray-900 mb-4">Booking Summary</h2>
                
                {formData.packageId && (
                  <div className="space-y-3 mb-4 pb-4 border-b border-amber-200">
                    <p className="text-sm text-gray-600">Selected Package</p>
                    <p className="font-semibold text-gray-900">
                      {tourPackages.find(p => p.id.toString() === formData.packageId)?.name}
                    </p>
                    <p className="text-amber-600 font-bold">
                      ₹{tourPackages.find(p => p.id.toString() === formData.packageId)?.price?.toLocaleString()} x {formData.numberOfTravelers}
                    </p>
                  </div>
                )}
                
                {formData.addOns.length > 0 && (
                  <div className="space-y-2 mb-4 pb-4 border-b border-amber-200">
                    <p className="text-sm text-gray-600">Add-ons</p>
                    {formData.addOns.map(id => {
                      const addOn = addOns.find(a => a.id === id);
                      return addOn ? (
                        <div key={id} className="flex justify-between text-sm">
                          <span>{addOn.name}</span>
                          <span className="text-amber-600">+₹{addOn.price}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-amber-600">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white/50 rounded-lg">
                  <p className="text-sm text-gray-700 font-semibold mb-2">Why Book With Us?</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>✓ Best Price Guarantee</li>
                    <li>✓ 24/7 Customer Support</li>
                    <li>✓ Flexible Cancellation</li>
                    <li>✓ Local Expertise</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}