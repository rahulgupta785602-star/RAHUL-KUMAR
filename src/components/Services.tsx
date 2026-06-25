import React, { useState } from 'react';
import { Service } from '../types';
import { Search, Edit, Percent, Check, HelpCircle } from 'lucide-react';

interface ServicesProps {
  services: Service[];
  isAdmin: boolean;
  onUpdateService: (updated: Service) => Promise<void>;
  onBookNowClick: (service: Service) => void;
}

export default function Services({
  services,
  isAdmin,
  onUpdateService,
  onBookNowClick,
}: ServicesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDiscount, setEditDiscount] = useState<number>(0);
  const [editTax, setEditTax] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  // Filtered services
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setEditPrice(service.price);
    setEditDiscount(service.discount || 0);
    setEditTax(service.tax || 18);
  };

  const handleSave = async () => {
    if (!editingService) return;
    setIsSaving(true);
    try {
      const updated: Service = {
        ...editingService,
        price: Number(editPrice),
        discount: Number(editDiscount),
        tax: Number(editTax),
      };
      await onUpdateService(updated);
      setEditingService(null);
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Failed to update service prices. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="services-page-section" className="py-16 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-12">
          <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.3em] block mb-2">Our Offerings</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-widest">
            Premium <span className="font-serif italic text-[#D4AF37]">Photography</span> Services
          </h2>
          <div className="w-20 h-[1.5px] bg-[#D4AF37] mx-auto mt-4" />
          <p className="text-zinc-500 text-xs sm:text-sm font-light mt-3 max-w-xl mx-auto uppercase tracking-wider">
            All packages are customized with luxury standards & high definition output.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-900">
          <div className="relative w-full sm:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              id="service-search-input"
              type="text"
              placeholder="Search services or packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-none py-2.5 pl-10 pr-4 text-xs tracking-wider uppercase focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-zinc-600"
            />
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-widest">
            Showing {filteredServices.length} Luxury Packages
          </div>
        </div>

        {/* Services Grid */}
        <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const finalPrice = service.price - (service.discount || 0);
            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between bg-zinc-950 border border-zinc-900 rounded-none overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl"
              >
                {/* Service Card Image */}
                <div className="relative h-60 w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url(${service.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-black/40" />

                  {/* Discount Tag */}
                  {service.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-[#D4AF37] text-black font-semibold text-[10px] tracking-widest uppercase px-2.5 py-1 flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      ₹{service.discount.toLocaleString()} Off
                    </div>
                  )}

                  {/* Standard Price Badge overlay */}
                  <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 px-3 py-1.5 text-[#D4AF37] font-mono text-sm tracking-wider font-bold">
                    {service.discount > 0 ? (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] line-through text-zinc-500">₹{service.price.toLocaleString()}</span>
                        <span>₹{finalPrice.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span>₹{service.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-white text-base font-light tracking-widest uppercase mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm font-light tracking-wide leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    {/* GST Tag */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 uppercase tracking-widest mb-4">
                      <span>GST Extra ({service.tax || 18}%)</span>
                      {isAdmin && (
                        <button
                          id={`edit-price-btn-${service.id}`}
                          onClick={() => handleEditClick(service)}
                          className="flex items-center gap-1 text-[#D4AF37] hover:text-white transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          Edit Config
                        </button>
                      )}
                    </div>

                    {/* Book Now Action */}
                    <button
                      id={`book-service-${service.id}`}
                      onClick={() => onBookNowClick(service)}
                      className="w-full py-3.5 border border-[#D4AF37]/80 text-white bg-black/40 hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#B89020] hover:text-black hover:border-transparent font-bold text-xs tracking-[0.25em] uppercase rounded-none transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Service Edit Configuration Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-[#D4AF37] p-6 max-w-md w-full rounded-none">
            <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.2em] block mb-1">
              Admin Configuration Mode
            </span>
            <h3 className="text-lg text-white font-light uppercase tracking-wider mb-4 border-b border-zinc-900 pb-2">
              Update {editingService.name} Prices
            </h3>

            <div className="space-y-4">
              {/* Base Price */}
              <div>
                <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                  Base Price (₹)
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2 px-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Discount Amount */}
              <div>
                <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                  Discount Amount (₹)
                </label>
                <input
                  type="number"
                  value={editDiscount}
                  onChange={(e) => setEditDiscount(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2 px-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Tax GST percentage */}
              <div>
                <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                  GST Tax rate (%)
                </label>
                <input
                  type="number"
                  value={editTax}
                  onChange={(e) => setEditTax(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2 px-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-zinc-900">
              <button
                onClick={() => setEditingService(null)}
                className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white text-xs uppercase tracking-wider rounded-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-wider rounded-none hover:bg-white transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
