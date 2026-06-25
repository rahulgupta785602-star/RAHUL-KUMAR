import React, { useState, useEffect } from 'react';
import { Service, Booking } from '../types';
import { Calendar, CheckCircle, ArrowRight, Smartphone, Mail, MapPin, CreditCard, Clock, Sparkles, Search } from 'lucide-react';

interface BookingFormProps {
  services: Service[];
  preselectedServiceId?: string;
  onBookingComplete: (newBooking: Booking) => void;
  onTrackRedirect: (orderId: string, phone: string) => void;
  nextOrderIndex: number;
}

export default function BookingForm({
  services,
  preselectedServiceId,
  onBookingComplete,
  onTrackRedirect,
  nextOrderIndex,
}: BookingFormProps) {
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId || '');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [advanceAmount, setAdvanceAmount] = useState<number>(5000);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Auto filled service variables
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  useEffect(() => {
    const found = services.find((s) => s.id === selectedServiceId);
    setSelectedService(found || null);
  }, [selectedServiceId, services]);

  const servicePrice = selectedService ? selectedService.price - (selectedService.discount || 0) : 0;
  const remainingAmount = Math.max(0, servicePrice - advanceAmount);

  // Form validity check
  const isFormValid =
    customerName.trim() !== '' &&
    phone.trim() !== '' &&
    whatsapp.trim() !== '' &&
    email.trim() !== '' &&
    selectedServiceId !== '' &&
    bookingDate !== '' &&
    bookingTime !== '' &&
    address.trim() !== '' &&
    city.trim() !== '' &&
    state.trim() !== '' &&
    pincode.trim() !== '' &&
    agreeTerms;

  // Form Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<Booking | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !selectedService) return;

    setIsSubmitting(true);
    try {
      // Format current index into GPS20260001, etc.
      const formattedIndex = String(nextOrderIndex).padStart(4, '0');
      const orderId = `GPS2026${formattedIndex}`;

      const bookingData: Booking = {
        orderId,
        customerName,
        phone,
        whatsapp,
        email,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        price: servicePrice,
        bookingDate,
        bookingTime,
        address,
        city,
        state,
        pincode,
        instructions,
        paymentMethod,
        advanceAmount: Number(advanceAmount),
        remainingAmount: Number(remainingAmount),
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onBookingComplete(bookingData);
      setShowConfirmation(bookingData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyWhatsApp = () => {
    if (!showConfirmation) return;
    const msg = `Thank you for booking with Gupta Photo Studio.\n\nOrder ID:\n${showConfirmation.orderId}\n\nService:\n${showConfirmation.serviceName}\n\nBooking Date:\n${showConfirmation.bookingDate}\n\nAmount:\n₹${showConfirmation.price.toLocaleString()}\n\nStatus:\nPending Confirmation\n\nThank You.\nGupta Photo Studio`;
    navigator.clipboard.writeText(msg);
    alert('WhatsApp confirmation message copied to clipboard!');
  };

  return (
    <div id="booking-online-section" className="bg-[#050505] py-16 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Step Headings */}
        <div className="text-center mb-12">
          <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.3em] block mb-2">Book Session</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-widest">
            Reserve Your <span className="font-serif italic text-[#D4AF37]">Time</span> Slot
          </h2>
          <div className="w-20 h-[1.5px] bg-[#D4AF37] mx-auto mt-4" />
        </div>

        {showConfirmation ? (
          /* Confirmation WhatsApp Message Display */
          <div id="booking-confirmation-alert" className="p-8 bg-zinc-950 border border-[#D4AF37] text-center max-w-2xl mx-auto rounded-none shadow-2xl">
            <CheckCircle className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
            <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.25em] block mb-2">
              Booking Created Successfully!
            </span>
            <h3 className="text-2xl font-light text-white uppercase tracking-wider mb-4">
              Order ID: <span className="font-mono font-bold text-[#D4AF37]">{showConfirmation.orderId}</span>
            </h3>
            
            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed mb-6">
              Your details have been securely logged in our systems. Below is your automatic confirmation notification.
            </p>

            {/* Simulated WhatsApp Notification Box */}
            <div id="simulated-whatsapp-notif" className="text-left bg-[#075E54]/10 border-l-4 border-[#075E54] p-5 rounded-none font-mono text-xs sm:text-sm text-zinc-300 max-w-md mx-auto mb-8 whitespace-pre-line shadow-inner">
              <span className="text-[10px] text-[#075E54] uppercase tracking-wider font-bold block mb-2">&bull; Simulated WhatsApp Alert</span>
              ---------------------------------<br />
              Thank you for booking with Gupta Photo Studio.<br /><br />
              Order ID:<br /><strong className="text-white">{showConfirmation.orderId}</strong><br /><br />
              Service:<br /><strong className="text-white">{showConfirmation.serviceName}</strong><br /><br />
              Booking Date:<br /><strong className="text-white">{showConfirmation.bookingDate}</strong><br /><br />
              Amount:<br /><strong className="text-white">₹{showConfirmation.price.toLocaleString()}</strong><br /><br />
              Status:<br /><span className="text-[#D4AF37] font-semibold">Pending Confirmation</span><br /><br />
              Thank You.<br />
              Gupta Photo Studio<br />
              ---------------------------------
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onTrackRedirect(showConfirmation.orderId, showConfirmation.phone)}
                className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B89020] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.25)]"
              >
                <Search className="w-4 h-4 text-black stroke-[3]" />
                Track Order Live
              </button>
              <button
                onClick={handleCopyWhatsApp}
                className="px-6 py-3 bg-[#075E54] hover:bg-[#128C7E] text-white text-xs font-semibold uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Copy WhatsApp Text
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(null);
                  // Reset form fields
                  setCustomerName('');
                  setPhone('');
                  setWhatsapp('');
                  setEmail('');
                  setSelectedServiceId('');
                  setBookingDate('');
                  setBookingTime('');
                  setAddress('');
                  setCity('');
                  setState('');
                  setPincode('');
                  setInstructions('');
                  setAgreeTerms(false);
                }}
                className="px-6 py-3 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-white text-xs font-semibold uppercase tracking-wider rounded-none transition-all cursor-pointer"
              >
                Create Another Booking
              </button>
            </div>
          </div>
        ) : (
          /* Real Booking Form */
          <form id="main-booking-form" onSubmit={handleSubmit} className="space-y-8 bg-zinc-950 p-8 border border-zinc-900 shadow-2xl">
            {/* Step 1: Customer Details */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-4 pb-2 border-b border-zinc-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                1. Customer & Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Customer Name *</label>
                  <input
                    id="book-customerName"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Email Address *</label>
                  <input
                    id="book-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Phone Number *</label>
                  <input
                    id="book-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">WhatsApp Number *</label>
                  <input
                    id="book-whatsapp"
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="WhatsApp alert number"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Service and Schedule Selection */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-4 pb-2 border-b border-zinc-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                2. Choose Luxury Service & Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Select Service *</label>
                  <select
                    id="book-service"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all uppercase"
                  >
                    <option value="">Select Package</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (₹{(s.price - (s.discount || 0)).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Event Date *</label>
                  <input
                    id="book-date"
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Event Start Time *</label>
                  <input
                    id="book-time"
                    type="time"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Event Address */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-4 pb-2 border-b border-zinc-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                3. Venue Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Full Event Address *</label>
                  <textarea
                    id="book-address"
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Building name, landmark, street etc."
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">City *</label>
                    <input
                      id="book-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Noida"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">State *</label>
                    <input
                      id="book-state"
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Uttar Pradesh"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Pincode *</label>
                    <input
                      id="book-pincode"
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="6-digit PIN"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Special Instructions & Payments */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-4 pb-2 border-b border-zinc-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                4. Instructions & Booking Advance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Special instructions (Optional)</label>
                  <textarea
                    id="book-instructions"
                    rows={3}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Specify shoot styles, key guests or equipment preferences..."
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>

                {/* Pricing / Advance details calculation */}
                <div className="p-4 bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs uppercase tracking-wider text-zinc-400">
                      <span>Base Package Price:</span>
                      <span className="font-mono text-white">₹{servicePrice.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs uppercase tracking-wider text-zinc-400">
                      <span>Advance Amount (INR):</span>
                      <input
                        type="number"
                        min={1000}
                        max={servicePrice}
                        value={advanceAmount}
                        onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                        className="w-24 bg-zinc-950 border border-zinc-800 text-right px-2 py-1 text-xs text-[#D4AF37] font-mono focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="flex justify-between text-xs uppercase tracking-wider text-zinc-400 pt-2 border-t border-zinc-800">
                      <span>Remaining Balance:</span>
                      <span className="font-mono text-[#D4AF37] font-semibold">₹{remainingAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Preferred Payment Method</label>
                    <select
                      id="book-paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-2 text-xs tracking-wider uppercase focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Cash">Cash at Studio</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Submission */}
            <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  id="book-agreeTerms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 bg-zinc-900 border-zinc-800 rounded-none text-[#D4AF37] focus:ring-0 focus:ring-offset-0 focus:outline-none accent-[#D4AF37]"
                />
                <span className="text-xs text-zinc-400 uppercase tracking-wider">
                  I agree to Gupta Photo Studio Terms & Conditions *
                </span>
              </label>

              <button
                id="btn-submit-booking"
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full sm:w-auto px-10 py-3.5 bg-[#D4AF37] text-black font-semibold text-xs tracking-[0.2em] uppercase rounded-none transition-all flex items-center justify-center gap-2 hover:bg-white disabled:opacity-30 disabled:pointer-events-none disabled:border-zinc-800"
              >
                {isSubmitting ? 'Processing Session...' : 'Continue to Reserve'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
