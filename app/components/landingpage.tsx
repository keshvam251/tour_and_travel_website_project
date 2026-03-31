// app/page.tsx
import Image from 'next/image';
import Navbar from './navbar';
import Link from 'next/link';


export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/mata.png"
          alt="Breathtaking travel destination"
          fill
          priority
          className="object-cover object-[center_30%]"
          sizes="100vw"
          quality={75}
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-slide-up">
        <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight">
          Explore the<br />
          <span className="text-amber-300">unexplored</span>
        </h1>
        
        <div className="w-20 h-0.5 bg-amber-400 mx-auto my-6 rounded-full" />
        
        <p className="font-inter text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          Curated journeys, authentic moments —<br />
          discover the world with wanderlust & soul <span className='text-amber-300'>With kavya tours and travels.</span>
        </p>
        
      

<Link href="/booking">
  <button className="group mt-8 sm:mt-10 inline-flex items-center gap-2 bg-white hover:bg-amber-400 text-gray-900 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:translate-y-0">
    Start your journey
    <svg 
      className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </button>
</Link>
      </div>
    </main>
  );
}