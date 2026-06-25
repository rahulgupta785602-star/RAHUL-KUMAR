import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';

interface HeroProps {
  onBookNow: () => void;
  onExploreServices: () => void;
}

const SLIDES = [
  {
    title: 'Wedding Photography',
    subtitle: 'Capturing Timeless Eternal Vows',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600',
  },
  {
    title: 'Pre Wedding',
    subtitle: 'Romantic Pre-Wedding Narratives',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1600',
  },
  {
    title: 'Birthday Events',
    subtitle: 'Vibrant & Joyous Birthday Moments',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1600',
  },
  {
    title: 'Corporate Events',
    subtitle: 'Sophisticated Professional Coverage',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1600',
  },
  {
    title: 'Baby Shoot',
    subtitle: 'Pure & Wholesome New Born Memories',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=1600',
  },
  {
    title: 'Fashion Shoot',
    subtitle: 'High Contrast Editorial Glamour',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600',
  },
  {
    title: 'Drone Shoot',
    subtitle: 'Spectacular High-Altitude Perspective',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1600',
  },
  {
    title: 'Cinematic Video',
    subtitle: '4K Storytelling and Emotional Films',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1600',
  },
];

export default function Hero({ onBookNow, onExploreServices }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div id="hero-slider-section" className="relative h-[80vh] w-full bg-black overflow-hidden select-none">
      {/* Background Slides */}
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
          } transform transition-transform duration-[4500ms]`}
        >
          {/* Parallax Image Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          {/* Luxury Dark + Gold Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-black/30 backdrop-brightness-[0.85]" />
        </div>
      ))}

      {/* Floating Elements / Ambient luxury lines */}
      <div className="absolute inset-0 border-x border-[#D4AF37]/10 max-w-7xl mx-auto pointer-events-none z-20" />

      {/* Slide Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 px-4">
        <span className="text-[#D4AF37] uppercase text-xs sm:text-sm font-semibold tracking-[0.4em] mb-4 drop-shadow-md">
          {SLIDES[currentSlide].subtitle}
        </span>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light text-white uppercase tracking-wider max-w-4xl leading-tight mb-3">
          Capturing Moments,<br />
          <span className="font-serif italic text-[#D4AF37] font-semibold tracking-wide lowercase">Creating</span> Memories
        </h1>

        <p className="text-zinc-400 text-xs sm:text-base font-light tracking-widest max-w-xl mb-8 uppercase">
          Gupta Photo Studio &bull; Deluxe Visual Storytellers since 2016
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
          <button
            id="hero-btn-book"
            onClick={onBookNow}
            className="w-full sm:w-auto px-10 py-4 rounded-none bg-gradient-to-r from-[#D4AF37] to-[#F3CD50] text-black font-bold text-xs tracking-[0.25em] uppercase hover:brightness-110 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 border-0 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </button>
          <button
            id="hero-btn-services"
            onClick={onExploreServices}
            className="w-full sm:w-auto px-10 py-4 rounded-none bg-black/45 backdrop-blur-md text-white border border-[#D4AF37]/50 font-medium text-xs tracking-[0.25em] uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            Explore Services
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-white/10 bg-black/60 text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-white/10 bg-black/60 text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              idx === currentSlide ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-zinc-600 hover:bg-zinc-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
