import React, { useState } from 'react';
import { Camera, Film, Sparkles, Heart, Play, X, ExternalLink } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: 'photos' | 'videos' | 'weddings' | 'birthdays' | 'reels';
  title: string;
  url: string;
  type: 'image' | 'video';
  aspect: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    category: 'weddings',
    title: 'The Golden Phere Ceremony',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    type: 'image',
    aspect: 'md:col-span-2 md:row-span-2',
  },
  {
    id: 'g2',
    category: 'photos',
    title: 'Royal Bridal Portrait',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    aspect: 'col-span-1 row-span-1',
  },
  {
    id: 'g3',
    category: 'reels',
    title: 'Cinematic Ring exchange reel',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800',
    type: 'video',
    aspect: 'col-span-1 row-span-2',
  },
  {
    id: 'g4',
    category: 'birthdays',
    title: 'First Birthday Celebration Sparkles',
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    aspect: 'col-span-1 row-span-1',
  },
  {
    id: 'g5',
    category: 'videos',
    title: 'Pre-Wedding Cinematic Highlight',
    url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1200',
    type: 'video',
    aspect: 'md:col-span-2 row-span-1',
  },
  {
    id: 'g6',
    category: 'photos',
    title: 'Outdoor Couple Session',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    aspect: 'col-span-1 row-span-1',
  },
  {
    id: 'g7',
    category: 'weddings',
    title: 'The Haldi Splash Celebration',
    url: 'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    aspect: 'col-span-1 row-span-1',
  },
  {
    id: 'g8',
    category: 'reels',
    title: 'Pre-Wedding Slow-mo Highlights',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    type: 'video',
    aspect: 'col-span-1 row-span-1',
  }
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'photos' | 'videos' | 'weddings' | 'birthdays' | 'reels'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filters = [
    { id: 'all', label: 'All Work' },
    { id: 'photos', label: 'Photo Gallery' },
    { id: 'videos', label: 'Video Gallery' },
    { id: 'weddings', label: 'Wedding Highlights' },
    { id: 'birthdays', label: 'Birthday Moments' },
    { id: 'reels', label: 'Cinematic Reels' },
  ];

  const filteredItems = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  return (
    <section id="gallery-section" className="py-20 bg-[#070707] border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.3em] block mb-2">Our Portfolio</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-widest">
            The Art Of <span className="font-serif italic text-[#D4AF37]">Preserving</span> Time
          </h2>
          <div className="w-20 h-[1.5px] bg-[#D4AF37] mx-auto mt-4" />
        </div>

        {/* Gallery Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 max-w-4xl mx-auto">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-light rounded-none transition-all duration-300 border cursor-pointer ${
                activeFilter === filter.id
                  ? 'border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#B89020] text-black font-semibold shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                  : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:border-[#D4AF37]/50 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Instagram Style Bento Grid */}
        <div id="gallery-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`group relative overflow-hidden bg-zinc-950 border border-zinc-900 cursor-pointer ${item.aspect}`}
            >
              {/* Image background */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                style={{ backgroundImage: `url(${item.url})` }}
              />

              {/* Gold luxury hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/90 opacity-65 group-hover:opacity-95 transition-opacity duration-300" />
              <div className="absolute inset-0 border border-transparent group-hover:border-[#D4AF37]/50 transition-all duration-500 m-2.5 shadow-[inset_0_0_15px_rgba(212,175,55,0.15)]" />

              {/* Icon markers (Video vs Image) */}
              <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 text-[#D4AF37]">
                {item.type === 'video' ? <Film className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              </div>

              {/* Title & Info bottom overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] font-medium block mb-1">
                  {item.category}
                </span>
                <h3 className="text-white font-light text-sm tracking-wider uppercase truncate">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-zinc-400 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>View Masterpiece</span>
                  <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full max-h-[85vh] flex flex-col justify-center relative">
            {selectedItem.type === 'video' ? (
              <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden flex items-center justify-center rounded border border-[#D4AF37]/30">
                {/* Simulated Premium Video Player */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter brightness-50"
                  style={{ backgroundImage: `url(${selectedItem.url})` }}
                />
                <div className="z-10 text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/90 text-black flex items-center justify-center mx-auto mb-4 animate-bounce cursor-pointer shadow-lg shadow-[#D4AF37]/20">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                  <span className="text-xs text-[#D4AF37] tracking-[0.3em] uppercase block mb-1">Gupta Cinematic Reels</span>
                  <h4 className="text-xl font-light text-white uppercase tracking-widest">{selectedItem.title}</h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto mt-2">
                    Premium full-length video outputs are exported in 4K UHD and processed under luxury cinematic soundtracks.
                  </p>
                </div>
              </div>
            ) : (
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                className="max-h-[75vh] w-auto mx-auto object-contain rounded border border-zinc-900 shadow-2xl"
              />
            )}

            <div className="text-center mt-4">
              <span className="text-[10px] text-[#D4AF37] uppercase tracking-[0.25em] font-semibold">
                Gupta Photo Studio Original
              </span>
              <h3 className="text-lg text-white font-light uppercase tracking-wider mt-1">{selectedItem.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
