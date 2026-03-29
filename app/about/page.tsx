// app/about/page.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/navbar';

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Kavya Sharma",
      role: "Founder & Travel Curator",
      experience: "10+ years in travel industry",
      quote: "Creating memories that last a lifetime",
      image: "/team/kavya.jpg"
    },
    {
      name: "Rajesh Khanna",
      role: "Operations Head",
      experience: "15+ years experience",
      quote: "Ensuring seamless travel experiences",
      image: "/team/rajesh.jpg"
    },
    {
      name: "Priya Mehra",
      role: "Customer Experience Manager",
      experience: "8+ years in hospitality",
      quote: "Your comfort is our priority",
      image: "/team/priya.jpg"
    },
    {
      name: "Vikram Singh",
      role: "Tour Guide Specialist",
      experience: "12+ years guiding",
      quote: "Revealing hidden gems of Kashmir",
      image: "/team/vikram.jpg"
    }
  ];

  const values = [
    {
      icon: "🏔️",
      title: "Authentic Experiences",
      description: "We believe in showcasing the true essence of Kashmir and Himalayan culture"
    },
    {
      icon: "❤️",
      title: "Personalized Service",
      description: "Every journey is crafted uniquely for your preferences and needs"
    },
    {
      icon: "🌟",
      title: "Quality Assurance",
      description: "Handpicked accommodations and verified local guides"
    },
    {
      icon: "🌱",
      title: "Sustainable Tourism",
      description: "Promoting eco-friendly practices and supporting local communities"
    }
  ];

  const milestones = [
    { year: "2015", title: "The Beginning", description: "Started with a vision to showcase Kashmir's beauty" },
    { year: "2017", title: "Expansion", description: "Expanded to Ladakh and Himachal Pradesh" },
    { year: "2019", title: "1000+ Travelers", description: "Celebrated serving over 1000 happy travelers" },
    { year: "2022", title: "Award Winning", description: "Recognized for excellence in travel services" },
    { year: "2024", title: "Digital Transformation", description: "Launched online booking platform" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <Navbar/>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              About <span className="text-amber-600">kt&t</span>
            </h1>
            <div className="w-24 h-0.5 bg-amber-500 mx-auto my-4 rounded-full" />
            <p className="font-inter text-lg text-gray-600 max-w-3xl mx-auto">
              Your trusted partner in exploring the paradise on earth and beyond
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-playfair text-gray-900 mb-6">
                Our <span className="text-amber-600">Story</span>
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded with a passion for showcasing the untouched beauty of Jammu & Kashmir, 
                  kt&t (Kavya Tours & Travels) has been creating unforgettable journeys since 2015. 
                  What started as a small dream has now grown into a trusted name in Himalayan tourism.
                </p>
                <p>
                  Our founder, Kavya Sharma, a native of Srinagar, always believed that the true essence 
                  of Kashmir lies beyond the postcard-perfect images. This belief drives us to craft 
                  experiences that connect travelers with the authentic culture, warm hospitality, and 
                  breathtaking landscapes of the region.
                </p>
                <p>
                  Today, we're proud to have served over 5,000+ happy travelers, offering curated tours 
                  across Kashmir, Ladakh, Himachal Pradesh, and beyond. Every journey with us is designed 
                  to create lasting memories while supporting local communities and preserving the natural 
                  beauty of these pristine destinations.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/about-story.jpg"
                  alt="Beautiful Kashmir landscape"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-4 rounded-xl shadow-lg">
                <p className="text-2xl font-bold">10+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-gray-900 mb-4">
              Our <span className="text-amber-600">Values</span>
            </h2>
            <div className="w-20 h-0.5 bg-amber-500 mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              The principles that guide us in creating exceptional travel experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-amber-200"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-playfair text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      

      {/* Team Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-gray-900 mb-4">
              Meet Our <span className="text-amber-600">Team</span>
            </h2>
            <div className="w-20 h-0.5 bg-amber-500 mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Passionate experts dedicated to making your journey extraordinary
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-64 bg-amber-100">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500">
                      <span className="text-6xl text-white">{member.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-playfair text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-semibold text-sm mb-2">{member.role}</p>
                  <p className="text-gray-500 text-xs mb-3">{member.experience}</p>
                  <p className="text-gray-600 italic text-sm">"{member.quote}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "5000+", label: "Happy Travelers", icon: "😊" },
              { number: "50+", label: "Destinations", icon: "🏔️" },
              { number: "100+", label: "Custom Tours", icon: "🎯" },
              { number: "98%", label: "Satisfaction Rate", icon: "⭐" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center text-white"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-amber-200"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Let us help you create memories that will last a lifetime. Contact us today to plan your dream vacation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
                <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                  Plan Your Trip
                </button>
              </Link>
              <Link href="/contact">
                <button className="bg-white hover:bg-amber-50 text-amber-600 font-semibold px-8 py-3 rounded-full transition-all duration-300 border-2 border-amber-600">
                  Contact Us
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}