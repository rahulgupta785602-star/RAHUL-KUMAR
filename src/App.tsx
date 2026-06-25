import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDocFromServer,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Booking, Service } from './types';
import { INITIAL_SERVICES } from './data/services';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import ReviewCards from './components/ReviewCards';
import Services from './components/Services';
import BookingForm from './components/BookingForm';
import TrackOrder from './components/TrackOrder';
import Contact from './components/Contact';
import AdminLogin from './components/AdminLogin';
import InvoiceView from './components/InvoiceView';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

import { Camera, ArrowUp, MessageSquare, ChevronRight, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  
  // Selected booking for invoice generation viewing
  const [viewingInvoiceBooking, setViewingInvoiceBooking] = useState<Booking | null>(null);
  
  // Selected service passed from Service Card click to Booking Form
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);

  // Prefilled values for TrackOrder component
  const [prefilledTracking, setPrefilledTracking] = useState<{ orderId: string; phone: string } | null>(null);

  // Scroll to top states
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Test connection to Firestore on initialization
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Fetch Services from Firestore or seed them
  useEffect(() => {
    const servicesPath = 'services';
    const unsub = onSnapshot(
      collection(db, servicesPath),
      async (snapshot) => {
        if (snapshot.empty) {
          console.log('Seeding initial services to database...');
          try {
            for (const service of INITIAL_SERVICES) {
              await setDoc(doc(db, servicesPath, service.id), service);
            }
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, servicesPath);
          }
        } else {
          const loadedServices: Service[] = [];
          snapshot.forEach((d) => {
            loadedServices.push({ id: d.id, ...d.data() } as Service);
          });
          setServices(loadedServices);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, servicesPath);
      }
    );

    return () => unsub();
  }, []);

  // Fetch all Bookings in realtime
  useEffect(() => {
    const bookingsPath = 'bookings';
    const unsub = onSnapshot(
      collection(db, bookingsPath),
      (snapshot) => {
        const loadedBookings: Booking[] = [];
        snapshot.forEach((d) => {
          loadedBookings.push({ id: d.id, ...d.data() } as Booking);
        });
        // Sort bookings chronologically by creation
        loadedBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(loadedBookings);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, bookingsPath);
      }
    );

    return () => unsub();
  }, []);

  // Monitor scroll for Scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Triggered when a user completes their booking form
  const handleBookingComplete = async (newBooking: Booking) => {
    const bookingsPath = 'bookings';
    try {
      const newDocRef = doc(collection(db, bookingsPath));
      const bookingWithId = {
        ...newBooking,
        id: newDocRef.id,
      };
      
      // Optimistically update the local bookings state so tracking or listing is immediate
      setBookings((prev) => {
        // Avoid duplicate additions if onSnapshot triggers instantly
        if (prev.some(b => b.orderId === bookingWithId.orderId)) return prev;
        return [bookingWithId, ...prev];
      });

      await setDoc(newDocRef, bookingWithId);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, bookingsPath);
    }
  };

  // Tracking query helper with intelligent, loose local search & Firestore fallback
  const handleSearchBooking = async (orderId: string, phone: string): Promise<Booking | null> => {
    const cleanOrderId = orderId.trim().toUpperCase();
    const cleanPhoneDigits = phone.replace(/\D/g, '');

    // 1. Try to find in the local state first (instantaneous & offline-safe)
    const localMatch = bookings.find((b) => {
      const bOrderId = (b.orderId || '').trim().toUpperCase();
      const bPhoneDigits = (b.phone || '').replace(/\D/g, '');
      const orderMatch = bOrderId === cleanOrderId;
      
      // Check for exact digit match or suffix/prefix matches to avoid country code issues
      const phoneMatch = bPhoneDigits === cleanPhoneDigits || 
                         (cleanPhoneDigits.length >= 10 && bPhoneDigits.endsWith(cleanPhoneDigits)) ||
                         (bPhoneDigits.length >= 10 && cleanPhoneDigits.endsWith(bPhoneDigits));
      
      return orderMatch && phoneMatch;
    });

    if (localMatch) {
      return localMatch;
    }

    // 2. Try to find in the local state by Order ID only as a reliable fallback
    const localOrderIdMatch = bookings.find((b) => {
      return (b.orderId || '').trim().toUpperCase() === cleanOrderId;
    });

    if (localOrderIdMatch) {
      return localOrderIdMatch;
    }

    // 3. Fallback: Query Firestore securely
    const bookingsPath = 'bookings';
    try {
      // First try standard strict query
      const q = query(
        collection(db, bookingsPath),
        where('orderId', '==', cleanOrderId),
        where('phone', '==', phone.trim())
      );
      let snapshot = await getDocs(q);

      // If empty, try querying by Order ID only
      if (snapshot.empty) {
        const q2 = query(
          collection(db, bookingsPath),
          where('orderId', '==', cleanOrderId)
        );
        snapshot = await getDocs(q2);
      }

      if (snapshot.empty) return null;
      
      const docData = snapshot.docs[0].data();
      return { id: snapshot.docs[0].id, ...docData } as Booking;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, bookingsPath);
      return null;
    }
  };

  // Admin Dashboard handlers
  const handleUpdateBooking = async (updated: Booking) => {
    if (!updated.id) return;
    const path = `bookings/${updated.id}`;
    try {
      const docRef = doc(db, 'bookings', updated.id);
      await updateDoc(docRef, { ...updated });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    const path = `bookings/${id}`;
    if (!confirm('Are you absolutely sure you want to delete this booking permanently?')) return;
    try {
      const docRef = doc(db, 'bookings', id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleUpdateServicePrice = async (updated: Service) => {
    const path = `services/${updated.id}`;
    try {
      const docRef = doc(db, 'services', updated.id);
      await updateDoc(docRef, { ...updated });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookNowFromService = (service: Service) => {
    setPreselectedServiceId(service.id);
    setActiveTab('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe unique order index calculation
  const nextOrderIndex = bookings.length + 1;

  return (
    <div className="bg-black text-white font-sans min-h-screen selection:bg-[#D4AF37] selection:text-black">
      {/* Navbar Component */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'book') setPreselectedServiceId(undefined);
          if (tab !== 'track') setPrefilledTracking(null);
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLoginClick={() => setShowAdminLogin(true)}
        onAdminLogout={() => {
          setIsAdminLoggedIn(false);
          setActiveTab('home');
        }}
      />

      {/* Primary Tab Content Layout Router */}
      <main className="transition-all duration-500">
        {activeTab === 'home' && (
          <div className="animate-fade-in space-y-0">
            {/* Hero Slider */}
            <Hero
              onBookNow={() => setActiveTab('book')}
              onExploreServices={() => setActiveTab('services')}
            />

            {/* Why Choose Us Luxury block */}
            <section id="why-choose-us" className="py-20 bg-black relative border-t border-zinc-900 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                  <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.3em] block mb-2">Our Standards</span>
                  <h2 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-widest">
                    Why Choose <span className="font-serif italic text-[#D4AF37]">Gupta</span> Studio
                  </h2>
                  <div className="w-20 h-[1.5px] bg-[#D4AF37] mx-auto mt-4" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { title: "Premium Quality", desc: "Superb high definition 50MP portrait captures" },
                    { title: "Professional Team", desc: "Expert crew and styling directors in Delhi NCR" },
                    { title: "Affordable Price", desc: "Transparent upfront fixed packages with no hidden costs" },
                    { title: "Fast Delivery", desc: "Candid processing and dynamic delivery within 14 days" },
                    { title: "HD Photography", desc: "Tuned light setups capturing crystal clear detailing" },
                    { title: "4K Cinematic Videos", desc: "Premium grading and emotional narratives storylines" },
                    { title: "Drone Coverage", desc: "Breathtaking aerial clips for outdoor venues" },
                    { title: "Creative Editing", desc: "Professional signature color palettes grading" }
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-6 bg-zinc-950 border border-zinc-900 rounded-none hover:border-[#D4AF37]/40 transition-all duration-300 shadow-xl group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                        <Camera className="w-4 h-4" />
                      </div>
                      <h3 className="text-white text-sm sm:text-base font-light tracking-wider uppercase mb-1">{feat.title}</h3>
                      <p className="text-zinc-500 text-xs font-light tracking-wide leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Counter Stats Section */}
            <section id="counter-statistics" className="py-16 bg-zinc-950 border-y border-zinc-900/60 relative">
              <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: "5000+", label: "Happy Customers" },
                  { value: "3500+", label: "Events Covered" },
                  { value: "10+", label: "Years Experience" },
                  { value: "4.9★", label: "Customer Rating" }
                ].map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <strong className="text-3xl sm:text-5xl font-mono text-[#D4AF37] font-semibold">{stat.value}</strong>
                    <p className="text-zinc-500 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium pt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Photo & Video Gallery Bento Grid */}
            <Gallery />

            {/* Testimonials */}
            <ReviewCards />

            {/* FAQ Accordion Section */}
            <section id="faq-section" className="py-20 bg-[#050505] border-t border-zinc-900">
              <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                  <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.3em] block mb-2">Assistance</span>
                  <h2 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-widest">
                    Frequently Asked <span className="font-serif italic text-[#D4AF37]">Questions</span>
                  </h2>
                  <div className="w-20 h-[1.5px] bg-[#D4AF37] mx-auto mt-4" />
                </div>

                <div className="space-y-4">
                  {[
                    { q: "How early should we book our wedding photo shoot?", a: "We recommend booking at least 3 to 6 months in advance, especially during the peak wedding season in Delhi NCR (November to February) to secure our prime dates." },
                    { q: "What is the turnaround time for delivery of photos and videos?", a: "We deliver raw captures and sneak-peek edits within 3 days. The fully processed high-resolution photo library and cinematic 4K video highlights are delivered within 14 business days." },
                    { q: "Can we customize our photography package?", a: "Absolutely! While our catalog lists pre-designed service packages with transparent pricing, you can connect with our team to add custom elements like LED walls, additional drone coverage, or extra deluxe albums." },
                    { q: "Do you cover events outside of Noida and Delhi?", a: "Yes, our team regularly travels pan-India for destination weddings and corporate sessions. Travel and lodging arrangements are calculated based on location." }
                  ].map((item, idx) => (
                    <details key={idx} className="group bg-zinc-950 border border-zinc-900 p-5 rounded-none cursor-pointer open:border-[#D4AF37]/50 transition-all duration-300">
                      <summary className="flex justify-between items-center text-xs sm:text-sm font-medium tracking-wider uppercase text-white list-none">
                        <span>{item.q}</span>
                        <span className="text-[#D4AF37] transition-transform duration-300 group-open:rotate-90">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </summary>
                      <p className="text-zinc-400 text-xs sm:text-sm font-light mt-4 leading-relaxed normal-case tracking-wide">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'services' && (
          <Services
            services={services}
            isAdmin={isAdminLoggedIn}
            onUpdateService={handleUpdateServicePrice}
            onBookNowClick={handleBookNowFromService}
          />
        )}

        {activeTab === 'book' && (
          <BookingForm
            services={services}
            preselectedServiceId={preselectedServiceId}
            onBookingComplete={handleBookingComplete}
            onTrackRedirect={(orderId, phone) => {
              setPrefilledTracking({ orderId, phone });
              setActiveTab('track');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            nextOrderIndex={nextOrderIndex}
          />
        )}

        {activeTab === 'track' && (
          <TrackOrder
            onSearch={handleSearchBooking}
            initialOrderId={prefilledTracking?.orderId}
            initialPhone={prefilledTracking?.phone}
            autoExecute={!!prefilledTracking}
          />
        )}

        {activeTab === 'contact' && (
          <Contact />
        )}

        {activeTab === 'admin' && isAdminLoggedIn && (
          <AdminDashboard
            bookings={bookings}
            services={services}
            onUpdateBooking={handleUpdateBooking}
            onDeleteBooking={handleDeleteBooking}
            onUpdateService={handleUpdateServicePrice}
            onLogout={() => {
              setIsAdminLoggedIn(false);
              setActiveTab('home');
            }}
            onViewInvoice={(booking) => setViewingInvoiceBooking(booking)}
          />
        )}
      </main>

      {/* Footer (Always shown except on Admin Dashboard View to maintain privacy) */}
      {activeTab !== 'admin' && <Footer setActiveTab={setActiveTab} />}

      {/* Admin Login Popup Trigger Modal */}
      {showAdminLogin && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            setActiveTab('admin');
          }}
        />
      )}

      {/* Invoice Generator Modal Overlay */}
      {viewingInvoiceBooking && (
        <InvoiceView
          booking={viewingInvoiceBooking}
          onClose={() => setViewingInvoiceBooking(null)}
        />
      )}

      {/* Floating WhatsApp Floating Button */}
      {activeTab !== 'admin' && (
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 left-6 z-40 bg-[#25D366] text-white p-3.5 rounded-full hover:bg-emerald-600 shadow-2xl transition-all hover:scale-110 shadow-black"
          aria-label="WhatsApp Studio Chat"
        >
          <MessageSquare className="w-6 h-6 fill-current" />
        </a>
      )}

      {/* Scroll to Top floating Button */}
      {showScrollTop && activeTab !== 'admin' && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-[#D4AF37] text-black p-3 rounded-none border border-[#D4AF37] hover:bg-white hover:text-black transition-all hover:-translate-y-1 shadow-xl shadow-black/40"
          aria-label="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5 stroke-[3]" />
        </button>
      )}
    </div>
  );
}
