import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '' || email.trim() === '' || message.trim() === '') return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <div id="contact-us-section" className="bg-black py-16 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.3em] block mb-2">Connect With Us</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-widest">
            Let's Craft <span className="font-serif italic text-[#D4AF37]">Visual</span> Magic
          </h2>
          <div className="w-20 h-[1.5px] bg-[#D4AF37] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Studio Details */}
          <div className="lg:col-span-5 space-y-8 bg-zinc-950 p-8 border border-zinc-900 shadow-2xl">
            <div>
              <span className="text-xs text-[#D4AF37] tracking-widest uppercase font-semibold">Corporate Office</span>
              <h3 className="text-2xl font-light text-white uppercase tracking-wider mt-1 mb-2">Gupta Photo Studio</h3>
              <div className="w-12 h-[1px] bg-[#D4AF37]" />
            </div>

            <div className="space-y-6">
              {/* Phone info */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">Call Helpline</h4>
                  <p className="text-sm text-zinc-200 mt-1 font-mono hover:text-[#D4AF37] transition-colors">
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </p>
                </div>
              </div>

              {/* WhatsApp info */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">WhatsApp Chat</h4>
                  <p className="text-sm text-zinc-200 mt-1 font-mono hover:text-[#D4AF37] transition-colors">
                    <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">+91 98765 43210</a>
                  </p>
                </div>
              </div>

              {/* Email info */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">Inquiries Email</h4>
                  <p className="text-sm text-zinc-200 mt-1 font-mono hover:text-[#D4AF37] transition-colors">
                    <a href="mailto:info@guptaphotostudio.com">info@guptaphotostudio.com</a>
                  </p>
                </div>
              </div>

              {/* Office Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">Main Studio Address</h4>
                  <p className="text-sm text-zinc-300 mt-1 leading-relaxed">
                    Plot No. 12, Block C, Sector 62,<br />
                    Opposite Park, Noida,<br />
                    Uttar Pradesh - 201301
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">Business Hours</h4>
                  <p className="text-sm text-zinc-300 mt-1">
                    Monday - Sunday: 10:00 AM - 09:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-6 border-t border-zinc-900">
              <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-4">Join our community</h4>
              <div className="flex gap-4">
                <a href="#" className="w-9 h-9 border border-zinc-800 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all text-zinc-400">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 border border-zinc-800 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all text-zinc-400">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 border border-zinc-800 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all text-zinc-400">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form & Map */}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-between">
            {/* Contact Form */}
            <div className="bg-zinc-950 p-8 border border-zinc-900 shadow-2xl flex-grow">
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37] mb-6 pb-2 border-b border-zinc-900">
                Direct Inquiry Mailbox
              </h3>

              {sent ? (
                <div id="contact-success-alert" className="p-8 border border-[#D4AF37] text-center bg-[#D4AF37]/5">
                  <Clock className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 animate-spin-slow" />
                  <h4 className="text-white text-base font-medium uppercase tracking-wider">Inquiry Sent Successfully</h4>
                  <p className="text-zinc-400 text-xs mt-2 uppercase tracking-wide">
                    Thank you for your message. The executive team from Gupta Photo Studio will contact you within 2 business hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 px-6 py-2.5 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form id="contact-main-form" onSubmit={handleSendMessage} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Full Name *</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Email Address *</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Subject (Optional)</label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Wedding Package Enquiry"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Message *</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message detail here..."
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    id="btn-contact-submit"
                    type="submit"
                    disabled={isSending || name.trim() === '' || email.trim() === '' || message.trim() === ''}
                    className="w-full sm:w-auto px-8 py-3 bg-[#D4AF37] text-black font-semibold text-xs tracking-[0.2em] uppercase rounded-none transition-all flex items-center justify-center gap-2 hover:bg-white disabled:opacity-50"
                  >
                    {isSending ? 'Sending...' : 'Send Message'}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Google Map */}
            <div id="contact-map-frame" className="w-full h-64 border border-zinc-900 bg-zinc-950 overflow-hidden relative shadow-2xl">
              <iframe
                title="Gupta Photo Studio Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.4081077651036!2d77.37123987625126!3d28.617511775673062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m3!1d1!2sSector%2062%20Noida!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin&q=Sector+62+Noida&zoom=15"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(95%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
