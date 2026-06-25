import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  image: string;
  role: string;
}

const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Ananya Sharma',
    rating: 5,
    text: 'Gupta Photo Studio captured our wedding with absolute perfection! Every emotion, laugh, and tear was seized beautifully. The luxury gold album we received is our family treasure.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    role: 'Bride'
  },
  {
    id: 'r2',
    name: 'Rahul Verma',
    rating: 5,
    text: 'Extremely professional team with top-tier equipment. The pre-wedding drone cinematic reels they created was breathtaking. Truly worth every rupee!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    role: 'Groom'
  },
  {
    id: 'r3',
    name: 'Priya Patel',
    rating: 5,
    text: 'The baby portfolio shoot was done with so much patience and care. They customized three adorable backgrounds and the soft light edits are purely magical.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300',
    role: 'Happy Mother'
  },
  {
    id: 'r4',
    name: 'Vikram Gupta',
    rating: 5,
    text: 'Superb corporate event coverage! We hired them for our product launch seminar. The 4K cinematic video and crisp headshots were delivered in just 3 days.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    role: 'Director, Zenith Corp'
  },
  {
    id: 'r5',
    name: 'Sneha Reddy',
    rating: 5,
    text: 'Gupta Photo Studio made my fashion portfolio shoot incredibly comfortable. Their creative director suggested outstanding poses, and the light grading is elite.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    role: 'Professional Model'
  },
  {
    id: 'r6',
    name: 'Amit Singhal',
    rating: 5,
    text: 'The drone coverage and LED setup during our anniversary party was the highlight. All guests were mesmerized by the real-time live streaming quality.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    role: 'Host'
  },
  {
    id: 'r7',
    name: 'Kavita Joshi',
    rating: 5,
    text: 'Amazing maternity shoot! They provided beautiful luxury gowns and chose a scenic garden sunset. The photos look absolutely dreamy and premium.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    role: 'Client'
  },
  {
    id: 'r8',
    name: 'Deepak Malhotra',
    rating: 5,
    text: 'Their Haldi and Mehendi candid captures are so lively and colorful. The team merged into our family and snapped the most natural smiles.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
    role: 'Brother of the Bride'
  }
];

export default function ReviewCards() {
  return (
    <section id="reviews-section" className="py-20 bg-black border-t border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.3em] block mb-2">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-widest">
            Loved By <span className="font-serif italic text-[#D4AF37]">Premium</span> Clients
          </h2>
          <div className="w-20 h-[1.5px] bg-[#D4AF37] mx-auto mt-4" />
        </div>

        {/* 8 Review Cards in a responsive grid */}
        <div id="reviews-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="relative p-6 bg-zinc-950 border border-zinc-900 rounded-none hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl shadow-black/40"
            >
              {/* Background Quote Icon for premium feeling */}
              <div className="absolute top-4 right-4 text-zinc-900/40 group-hover:text-[#D4AF37]/10 transition-colors duration-300">
                <Quote className="w-12 h-12 stroke-[1]" />
              </div>

              <div>
                {/* 5 Stars Rating */}
                <div className="flex items-center gap-1 mb-4 text-[#D4AF37]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-zinc-300 text-xs sm:text-sm font-light tracking-wide leading-relaxed mb-6 italic">
                  "{review.text}"
                </p>
              </div>

              {/* Author Info footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-900/60">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-medium text-white tracking-wide uppercase">{review.name}</h4>
                  <span className="text-[10px] text-[#D4AF37] tracking-widest uppercase">{review.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
