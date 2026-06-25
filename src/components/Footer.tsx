import React from 'react';
import { Camera, Phone, Mail, MapPin, Instagram, Facebook, Youtube, MessageSquare } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  return (
    <footer id="app-footer" className="bg-black text-zinc-400 border-t border-zinc-900 text-xs uppercase tracking-wider py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Col 1: Brand details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Camera className="w-5 h-5" />
            <span className="text-base font-bold text-white tracking-widest">Gupta Photo Studio</span>
          </div>
          <p className="text-zinc-500 font-light leading-relaxed normal-case">
            An elite crew of visual storytellers crafting modern luxury photography, 4K videography, drone highlights, and high-contrast digital albums since 2016.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="p-2 border border-zinc-900 rounded-none hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 border border-zinc-900 rounded-none hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 border border-zinc-900 rounded-none hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-[#D4AF37] font-semibold text-[11px] tracking-widest mb-4">Quick Navigation</h4>
          <ul className="space-y-2.5 font-light text-zinc-500">
            <li>
              <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                Home Portfolio
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">
                Studio Services
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('book')} className="hover:text-white transition-colors">
                Book Online Session
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('track')} className="hover:text-white transition-colors">
                Track Order
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('contact')} className="hover:text-white transition-colors">
                Contact Office
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Contact quick facts */}
        <div>
          <h4 className="text-[#D4AF37] font-semibold text-[11px] tracking-widest mb-4">Inquiries Helpline</h4>
          <ul className="space-y-3 font-light text-zinc-500 normal-case">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>info@guptaphotostudio.com</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Plot No. 12, Block C, Sector 62, Noida, Uttar Pradesh - 201301</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Action quick access */}
        <div className="space-y-4">
          <h4 className="text-[#D4AF37] font-semibold text-[11px] tracking-widest mb-4">Immediate Connection</h4>
          <p className="text-zinc-500 font-light normal-case">
            Speak directly with our visual directors for custom package edits or site visits.
          </p>
          <div className="flex flex-col gap-2.5">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-zinc-950 border border-zinc-800 text-center font-semibold text-[10px] tracking-widest uppercase hover:border-[#D4AF37] text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
              WhatsApp Studio
            </a>
            <a
              href="tel:+919876543210"
              className="w-full py-2.5 bg-[#D4AF37] text-black text-center font-bold text-[10px] tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>
        </div>

      </div>

      {/* Copyright row */}
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-zinc-900 text-center text-zinc-600 text-[10px] tracking-widest flex flex-col sm:flex-row justify-between gap-4">
        <span>&copy; {new Date().getFullYear()} Gupta Photo Studio. All Rights Reserved.</span>
        <div className="flex justify-center gap-4 text-zinc-500 text-[9px]">
          <a href="#" className="hover:text-white">Terms & Conditions</a>
          <span>&bull;</span>
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <span>&bull;</span>
          <a href="#" className="hover:text-white">FAQ</a>
        </div>
      </div>
    </footer>
  );
}
