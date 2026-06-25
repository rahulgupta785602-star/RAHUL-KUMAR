import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { Search, Loader2, Check, Clock, ShieldAlert, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';

interface TrackOrderProps {
  onSearch: (orderId: string, phone: string) => Promise<Booking | null>;
  initialOrderId?: string;
  initialPhone?: string;
  autoExecute?: boolean;
}

export default function TrackOrder({
  onSearch,
  initialOrderId = '',
  initialPhone = '',
  autoExecute = false,
}: TrackOrderProps) {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState(initialPhone);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // If the props change, update state
    if (initialOrderId) setOrderId(initialOrderId);
    if (initialPhone) setPhone(initialPhone);
  }, [initialOrderId, initialPhone]);

  useEffect(() => {
    if (autoExecute && initialOrderId && initialPhone) {
      const executeTrack = async () => {
        setIsSearching(true);
        setSearched(true);
        try {
          const result = await onSearch(initialOrderId, initialPhone);
          setBooking(result);
        } catch (err) {
          console.error(err);
          setBooking(null);
        } finally {
          setIsSearching(false);
        }
      };
      executeTrack();
    }
  }, [autoExecute, initialOrderId, initialPhone, onSearch]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim() === '' || phone.trim() === '') return;

    setIsSearching(true);
    setSearched(true);
    try {
      const result = await onSearch(orderId.trim(), phone.trim());
      setBooking(result);
    } catch (err) {
      console.error(err);
      setBooking(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Status mapping
  const STATUSES = [
    'Pending',
    'Confirmed',
    'Photographer Assigned',
    'Payment Pending',
    'Work in Progress',
    'Editing',
    'Ready for Delivery',
    'Completed'
  ];

  const currentStatusIndex = booking ? STATUSES.indexOf(booking.status) : -1;

  return (
    <div id="track-order-section" className="bg-black py-16 text-white min-h-screen flex flex-col justify-start">
      <div className="max-w-4xl mx-auto px-4 w-full">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.3em] block mb-2">Order Tracking</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-widest">
            Track Your <span className="font-serif italic text-[#D4AF37]">Masterpiece</span>
          </h2>
          <div className="w-20 h-[1.5px] bg-[#D4AF37] mx-auto mt-4" />
          <p className="text-zinc-500 text-xs sm:text-sm font-light mt-3 uppercase tracking-wider">
            Monitor real-time progress of your photoshoot & digital editing.
          </p>
        </div>

        {/* Input panel */}
        <div className="bg-zinc-950 border border-zinc-900 p-8 shadow-2xl mb-12 max-w-2xl mx-auto">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Order ID *</label>
                <input
                  id="track-orderId"
                  type="text"
                  required
                  placeholder="e.g. GPS20260001"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white font-mono rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Registered Phone Number *</label>
                <input
                  id="track-phone"
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>
            </div>

            <button
              id="btn-track-submit"
              type="submit"
              disabled={isSearching || orderId.trim() === '' || phone.trim() === ''}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B89020] hover:from-white hover:to-white text-black font-semibold text-xs tracking-[0.25em] uppercase rounded-none transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Searching database...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Track Order Progress
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results display */}
        {searched && (
          <div id="tracking-results-panel">
            {booking ? (
              <div className="bg-zinc-950 border border-zinc-900 p-8 shadow-2xl space-y-8 animate-fade-in">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-900">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Gupta Photo Studio Verified Order</span>
                    <h3 className="text-xl font-light tracking-wide uppercase">
                      Order ID: <span className="font-mono font-bold text-[#D4AF37]">{booking.orderId}</span>
                    </h3>
                  </div>

                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Status:</span>
                    <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-none ${
                      booking.status === 'Completed' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40' :
                      booking.status === 'Cancelled' ? 'bg-red-950 text-red-400 border border-red-900' :
                      'bg-zinc-900 text-zinc-300 border border-zinc-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Details layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs uppercase tracking-widest text-zinc-400">
                  {/* Left Column */}
                  <div className="space-y-4 bg-zinc-900/40 p-5 border border-zinc-900/60">
                    <div className="flex justify-between">
                      <span>Customer Name:</span>
                      <strong className="text-white font-medium">{booking.customerName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Booked Service:</span>
                      <strong className="text-white font-medium">{booking.serviceName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Booking Date:</span>
                      <strong className="text-white font-medium">{booking.bookingDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Preferred Slot:</span>
                      <strong className="text-white font-medium">{booking.bookingTime}</strong>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 bg-zinc-900/40 p-5 border border-zinc-900/60">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <strong className="text-white font-mono">₹{booking.price.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Advance Paid:</span>
                      <strong className="text-emerald-400 font-mono">₹{booking.advanceAmount.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining Balance:</span>
                      <strong className="text-[#D4AF37] font-mono">₹{booking.remainingAmount.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Photographer Assigned:</span>
                      <strong className="text-white">{booking.photographerAssigned || 'Assigning soon...'}</strong>
                    </div>
                  </div>
                </div>

                {/* Real-time Status Progress Line */}
                {booking.status !== 'Cancelled' ? (
                  <div className="pt-6 border-t border-zinc-900">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37] mb-8">
                      Real-Time Processing Pipeline
                    </h4>
                    
                    {/* Desktop Horizontal Line */}
                    <div className="hidden md:flex items-center justify-between relative">
                      {/* Horizontal back-line */}
                      <div className="absolute top-4 left-0 right-0 h-[2px] bg-zinc-800 z-0" />
                      
                      {STATUSES.map((step, idx) => {
                        const isDone = idx <= currentStatusIndex;
                        const isCurrent = idx === currentStatusIndex;

                        return (
                          <div key={idx} className="flex flex-col items-center z-10 w-24 text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isDone ? 'bg-[#D4AF37] text-black ring-4 ring-[#D4AF37]/20 font-bold' : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                            }`}>
                              {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                            </div>
                            <span className={`text-[9px] uppercase tracking-widest mt-3 leading-tight block ${
                              isCurrent ? 'text-[#D4AF37] font-bold' : isDone ? 'text-zinc-300' : 'text-zinc-600'
                            }`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile Vertical Pipeline */}
                    <div className="md:hidden space-y-6 relative pl-6 border-l-2 border-zinc-800">
                      {STATUSES.map((step, idx) => {
                        const isDone = idx <= currentStatusIndex;
                        const isCurrent = idx === currentStatusIndex;

                        return (
                          <div key={idx} className="relative flex items-start gap-4">
                            <div className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center border ${
                              isDone ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                            }`}>
                              {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                            </div>
                            <div>
                              <span className={`text-xs uppercase tracking-widest block ${
                                isCurrent ? 'text-[#D4AF37] font-bold' : isDone ? 'text-zinc-200' : 'text-zinc-600'
                              }`}>
                                {step}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-red-950/20 border border-red-900 text-red-400 text-xs uppercase tracking-wider text-center">
                    This order has been cancelled. Please reach out to Gupta Photo Studio helpline for assistance.
                  </div>
                )}
              </div>
            ) : (
              <div id="tracking-error-alert" className="p-8 bg-zinc-950 border border-red-900/60 text-center rounded-none shadow-2xl max-w-xl mx-auto">
                <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h4 className="text-white text-base font-light uppercase tracking-wider">No Booking Found</h4>
                <p className="text-zinc-500 text-xs font-light tracking-wide leading-relaxed mt-2 uppercase">
                  We couldn't locate any booking matching Order ID <strong className="text-white font-mono">{orderId}</strong> & phone <strong className="text-white font-mono">{phone}</strong>. Please verify details and try again.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
