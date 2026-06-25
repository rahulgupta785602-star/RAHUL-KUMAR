import React, { useState } from 'react';
import { Booking, Service, Invoice } from '../types';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Film,
  CreditCard,
  FileSpreadsheet,
  Settings as SettingsIcon,
  LogOut,
  Search,
  Check,
  X,
  FileText,
  Trash2,
  Sliders,
  DollarSign,
  Clock,
  AlertCircle,
  TrendingUp,
  UserCheck,
  ClipboardList
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AdminDashboardProps {
  bookings: Booking[];
  services: Service[];
  onUpdateBooking: (updated: Booking) => Promise<void>;
  onDeleteBooking: (id: string) => Promise<void>;
  onUpdateService: (updated: Service) => Promise<void>;
  onLogout: () => void;
  onViewInvoice: (booking: Booking) => void;
}

type MenuTab = 'dashboard' | 'bookings' | 'customers' | 'services' | 'payments' | 'invoices' | 'reports' | 'settings';

export default function AdminDashboard({
  bookings,
  services,
  onUpdateBooking,
  onDeleteBooking,
  onUpdateService,
  onLogout,
  onViewInvoice,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<MenuTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  
  // Quick status updates
  const [photographerName, setPhotographerName] = useState('');
  const [whatsappSimulationLog, setWhatsappSimulationLog] = useState<string | null>(null);

  // Statistics calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookingsCount = bookings.filter((b) => b.bookingDate === todayStr).length;

  const monthlyRevenue = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (b.price || 0), 0);

  const pendingOrdersCount = bookings.filter((b) => b.status === 'Pending').length;
  const completedOrdersCount = bookings.filter((b) => b.status === 'Completed').length;
  const cancelledOrdersCount = bookings.filter((b) => b.status === 'Cancelled').length;

  const upcomingBookingsCount = bookings.filter(
    (b) => b.status !== 'Cancelled' && b.status !== 'Completed' && b.bookingDate >= todayStr
  ).length;

  // Filter Bookings
  const filteredBookings = bookings.filter((b) =>
    b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.phone.includes(searchQuery)
  );

  // Chart Data: Bookings by Service type
  const serviceStatsMap: { [key: string]: number } = {};
  bookings.forEach((b) => {
    serviceStatsMap[b.serviceName] = (serviceStatsMap[b.serviceName] || 0) + 1;
  });
  const chartDataServices = Object.keys(serviceStatsMap).map((key) => ({
    name: key.length > 15 ? key.substring(0, 15) + '...' : key,
    Bookings: serviceStatsMap[key],
  }));

  // Chart Data: Revenue Trend
  const chartDataRevenue = [
    { month: 'Jan', Revenue: Math.round(monthlyRevenue * 0.4) },
    { month: 'Feb', Revenue: Math.round(monthlyRevenue * 0.5) },
    { month: 'Mar', Revenue: Math.round(monthlyRevenue * 0.7) },
    { month: 'Apr', Revenue: Math.round(monthlyRevenue * 0.8) },
    { month: 'May', Revenue: Math.round(monthlyRevenue * 0.9) },
    { month: 'Jun', Revenue: monthlyRevenue },
  ];

  // Excel / CSV Export
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'OrderID,CustomerName,Phone,WhatsApp,Email,Service,Price,BookingDate,Time,Status,PhotographerAssigned\n';

    bookings.forEach((b) => {
      csvContent += `"${b.orderId}","${b.customerName}","${b.phone}","${b.whatsapp}","${b.email}","${b.serviceName}",${b.price},"${b.bookingDate}","${b.bookingTime}","${b.status}","${b.photographerAssigned || ''}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Gupta_Studio_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Action handler
  const handleStatusUpdate = async (booking: Booking, newStatus: Booking['status']) => {
    const updated: Booking = {
      ...booking,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    // Auto WhatsApp Notification Messages Simulation
    let simulationMessage = '';
    if (newStatus === 'Confirmed') {
      simulationMessage = `WhatsApp Alert sent to ${booking.customerName} (${booking.whatsapp}):\n"Your booking has been confirmed."`;
    } else if (newStatus === 'Cancelled') {
      simulationMessage = `WhatsApp Alert sent to ${booking.customerName} (${booking.whatsapp}):\n"Unfortunately your booking has been cancelled."`;
    } else if (newStatus === 'Completed') {
      simulationMessage = `WhatsApp Alert sent to ${booking.customerName} (${booking.whatsapp}):\n"Your project is completed. Thank you for choosing Gupta Photo Studio."`;
    }

    if (simulationMessage) {
      setWhatsappSimulationLog(simulationMessage);
      setTimeout(() => setWhatsappSimulationLog(null), 5000);
    }

    await onUpdateBooking(updated);
  };

  const handleAssignPhotographerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    const updated: Booking = {
      ...editingBooking,
      status: 'Photographer Assigned',
      photographerAssigned: photographerName,
      updatedAt: new Date().toISOString(),
    };

    await onUpdateBooking(updated);
    setEditingBooking(null);
    setPhotographerName('');
  };

  return (
    <div id="admin-dashboard-layout" className="bg-[#050505] min-h-screen text-white flex flex-col md:flex-row border-t border-zinc-900">
      {/* Simulation WhatsApp Banner */}
      {whatsappSimulationLog && (
        <div id="simulation-whatsapp-banner" className="fixed bottom-6 right-6 z-50 p-4 bg-[#075E54] border border-[#25D366] text-white text-xs font-mono max-w-sm rounded shadow-2xl animate-bounce">
          <div className="flex justify-between items-center mb-1 font-bold">
            <span>&bull; REALTIME WHATSAPP DISPATCH</span>
            <button onClick={() => setWhatsappSimulationLog(null)} className="text-white hover:text-red-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {whatsappSimulationLog}
        </div>
      )}

      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between shrink-0">
        <div className="p-6">
          {/* Brand header */}
          <div className="flex items-center gap-2 pb-6 border-b border-zinc-900 mb-6">
            <Sliders className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-sm font-bold tracking-widest uppercase text-white">Console Panel</span>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'bookings', label: 'Bookings', icon: CalendarDays },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'services', label: 'Services', icon: Film },
              { id: 'payments', label: 'Payments', icon: CreditCard },
              { id: 'invoices', label: 'Invoices', icon: FileText },
              { id: 'reports', label: 'Reports', icon: ClipboardList },
              { id: 'settings', label: 'Settings', icon: SettingsIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-light rounded-none transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37] font-semibold'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout bottom button */}
        <div className="p-6 border-t border-zinc-900">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-950 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-white text-xs uppercase tracking-wider font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout Console
          </button>
        </div>
      </aside>

      {/* Main workspace */}
      <main className="flex-grow p-8 overflow-x-hidden">
        
        {/* Dynamic header row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-zinc-900">
          <div>
            <span className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold">Authorized Session</span>
            <h2 className="text-2xl font-light text-white uppercase tracking-wider mt-1">
              {activeTab} Management
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'bookings' && (
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs uppercase tracking-wider rounded-none font-semibold transition-all flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Export to Excel
              </button>
            )}
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
              NCR Server Status: <span className="text-emerald-500">● Live</span>
            </div>
          </div>
        </div>

        {/* RENDER TAB CONTROLLER */}

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Statistics Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { title: "Today's Bookings", val: todayBookingsCount, icon: Clock, color: "text-[#D4AF37]" },
                { title: "Monthly Revenue", val: `₹${monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400" },
                { title: "Pending Orders", val: pendingOrdersCount, icon: AlertCircle, color: "text-amber-400" },
                { title: "Completed", val: completedOrdersCount, icon: Check, color: "text-green-400" },
                { title: "Cancelled", val: cancelledOrdersCount, icon: X, color: "text-red-400" },
                { title: "Upcoming Sessions", val: upcomingBookingsCount, icon: CalendarDays, color: "text-sky-400" },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-zinc-950 border border-zinc-900 p-5 rounded-none flex flex-col justify-between shadow-lg">
                    <div className="flex justify-between items-center text-zinc-500 mb-2">
                      <span className="text-[10px] uppercase tracking-widest">{stat.title}</span>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <strong className="text-lg sm:text-2xl font-mono text-white tracking-tight">{stat.val}</strong>
                  </div>
                );
              })}
            </div>

            {/* Recharts Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Trends */}
              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-none">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] mb-6 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                  Cumulative Revenue Growth (INR)
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartDataRevenue}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="month" stroke="#666" fontSize={10} />
                      <YAxis stroke="#666" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }} />
                      <Area type="monotone" dataKey="Revenue" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Booking Distribution */}
              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-none">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] mb-6 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                  Popular Shoot Packages Distribution
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataServices}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="name" stroke="#666" fontSize={8} />
                      <YAxis stroke="#666" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }} />
                      <Bar dataKey="Bookings" fill="#D4AF37" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quick recent logs */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-none">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 pb-2 border-b border-zinc-900">
                Recent Bookings Timeline
              </h3>
              <div className="space-y-4">
                {bookings.slice(-3).reverse().map((b) => (
                  <div key={b.orderId} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono text-[#D4AF37] font-semibold">{b.orderId}</span>
                      <span className="text-zinc-500 mx-2">&bull;</span>
                      <span>{b.customerName} booked <strong>{b.serviceName}</strong></span>
                    </div>
                    <span className="text-zinc-500">{new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search filter bar */}
            <div className="flex items-center max-w-md bg-zinc-950 border border-zinc-900 px-3 py-2">
              <Search className="w-4 h-4 text-zinc-500 mr-2" />
              <input
                type="text"
                placeholder="Search by ID, name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-xs text-white uppercase tracking-wider"
              />
            </div>

            {/* Bookings listing table */}
            <div className="overflow-x-auto border border-zinc-900">
              <table className="w-full text-left text-xs uppercase tracking-wider">
                <thead className="bg-zinc-950 text-zinc-500 border-b border-zinc-900">
                  <tr>
                    <th className="p-4">OrderID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Package</th>
                    <th className="p-4">Booking Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Staff</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-900/30">
                      <td className="p-4 font-mono font-bold text-[#D4AF37]">{b.orderId}</td>
                      <td className="p-4">
                        <div className="font-semibold">{b.customerName}</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{b.phone}</div>
                      </td>
                      <td className="p-4 text-zinc-300">{b.serviceName}</td>
                      <td className="p-4">
                        <div>{b.bookingDate}</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{b.bookingTime}</div>
                      </td>
                      <td className="p-4 font-mono text-[#D4AF37]">₹{b.price.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase border ${
                          b.status === 'Confirmed' ? 'border-[#D4AF37]/50 text-[#D4AF37] bg-[#D4AF37]/10' :
                          b.status === 'Completed' ? 'border-green-800 text-green-400 bg-green-950/20' :
                          b.status === 'Cancelled' ? 'border-red-900 text-red-400 bg-red-950/20' :
                          'border-zinc-800 text-zinc-400 bg-zinc-950'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-400 text-[10px]">
                        {b.photographerAssigned || 'None'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          {b.status === 'Pending' && (
                            <button
                              onClick={() => handleStatusUpdate(b, 'Confirmed')}
                              className="px-2 py-1 bg-zinc-900 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] text-[10px] uppercase font-bold"
                            >
                              Confirm
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingBooking(b);
                              setPhotographerName(b.photographerAssigned || '');
                            }}
                            className="px-2 py-1 border border-zinc-800 hover:border-zinc-500 text-zinc-300 text-[10px] uppercase"
                          >
                            Assign Staff
                          </button>
                          
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusUpdate(b, e.target.value as any)}
                            className="bg-zinc-950 border border-zinc-800 text-[10px] uppercase text-zinc-300 py-1"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Photographer Assigned">Photographer Assigned</option>
                            <option value="Payment Pending">Payment Pending</option>
                            <option value="Work in Progress">Work in Progress</option>
                            <option value="Editing">Editing</option>
                            <option value="Ready for Delivery">Ready for Delivery</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          {(b.status === 'Confirmed' || b.status === 'Completed' || b.status === 'Photographer Assigned' || b.status === 'Ready for Delivery') && (
                            <button
                              onClick={() => onViewInvoice(b)}
                              className="p-1 text-[#D4AF37] hover:text-white transition-colors"
                              title="Generate Invoice"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => onDeleteBooking(b.id || '')}
                            className="p-1 text-red-500 hover:text-white transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fade-in">
            {/* Customer directories */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-none">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 pb-2 border-b border-zinc-900">
                Studio Premium Customer Registry
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((b, idx) => (
                  <div key={idx} className="p-4 bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase">{b.customerName}</h4>
                      <p className="text-xs text-[#D4AF37] font-mono mt-1">{b.phone}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{b.email}</p>
                      <p className="text-[11px] text-zinc-500 mt-2">Latest Order: <span className="font-mono text-zinc-300">{b.orderId}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xs text-zinc-400 uppercase tracking-widest">
              As Admin, you have access to modify the catalog price structures, taxes and discount rates. Select a card inside standard Services view or edit fields here.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((s) => (
                <div key={s.id} className="p-5 bg-zinc-950 border border-zinc-900 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-white">{s.name}</h4>
                    <span className="text-[11px] text-zinc-500 font-mono">ID: {s.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#D4AF37] font-mono font-bold block">₹{s.price.toLocaleString()}</span>
                    <span className="text-[10px] text-zinc-500">Tax: {s.tax}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-none">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 pb-2 border-b border-zinc-900">
                Payment Transactions Logs
              </h3>
              <div className="space-y-4">
                {bookings.map((b, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-3 bg-zinc-900 border border-zinc-800">
                    <div>
                      <span className="font-mono text-[#D4AF37] font-semibold">{b.orderId}</span>
                      <span className="text-zinc-500 mx-2">&bull;</span>
                      <span>Paid via <strong>{b.paymentMethod}</strong></span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-emerald-400 font-semibold block">₹{b.advanceAmount.toLocaleString()}</span>
                      <span className="text-[9px] uppercase tracking-widest text-zinc-500">Advance Paid</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-none">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 pb-2 border-b border-zinc-900">
                Generated Studio Invoice directory
              </h3>
              <div className="space-y-4">
                {bookings.filter(b => b.status !== 'Cancelled').map((b, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-4 bg-zinc-900 border border-zinc-800">
                    <div>
                      <span className="font-mono text-zinc-400 font-bold block">GINV-{b.orderId.replace('GPS', '')}</span>
                      <span className="text-zinc-500 font-medium">Customer: {b.customerName} &bull; {b.serviceName}</span>
                    </div>
                    <button
                      onClick={() => onViewInvoice(b)}
                      className="px-4 py-2 border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] text-[10px] uppercase font-bold flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Invoice
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-zinc-950 border border-zinc-900 p-6">
                <h4 className="text-xs font-bold uppercase text-[#D4AF37] mb-4">Bookings Summary Reports</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span>Total Bookings Logged:</span>
                    <strong className="text-white font-mono">{bookings.length}</strong>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span>Confirmed & Active Sessions:</span>
                    <strong className="text-white font-mono">{bookings.filter(b => b.status === 'Confirmed').length}</strong>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span>Completed Productions:</span>
                    <strong className="text-white font-mono">{bookings.filter(b => b.status === 'Completed').length}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancelled Orders:</span>
                    <strong className="text-white font-mono">{bookings.filter(b => b.status === 'Cancelled').length}</strong>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-6">
                <h4 className="text-xs font-bold uppercase text-[#D4AF37] mb-4">Financial Projections</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span>Total Estimated Revenue:</span>
                    <strong className="text-white font-mono">₹{monthlyRevenue.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span>Advance Collected:</span>
                    <strong className="text-emerald-400 font-mono">
                      ₹{bookings.reduce((sum, b) => sum + (b.advanceAmount || 0), 0).toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance Outstanding:</span>
                    <strong className="text-amber-400 font-mono">
                      ₹{bookings.reduce((sum, b) => sum + (b.remainingAmount || 0), 0).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in bg-zinc-950 p-6 border border-zinc-900">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] mb-4 pb-2 border-b border-zinc-900">
              System Configuration Settings
            </h3>
            <div className="space-y-4 text-xs text-zinc-400 uppercase tracking-wider">
              <div className="flex items-center justify-between">
                <span>Auto-Send SMS on updates:</span>
                <span className="text-emerald-500 font-semibold">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Auto-Send WhatsApp Confirmations:</span>
                <span className="text-emerald-500 font-semibold">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Default GST Tax Rate:</span>
                <span className="text-white font-mono">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Currency:</span>
                <span className="text-white font-mono">INR (₹)</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Staff Assignment Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-[#D4AF37] p-6 max-w-sm w-full rounded-none">
            <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1">
              Gupta Studio Operations
            </span>
            <h3 className="text-lg text-white font-light uppercase tracking-wider mb-4 border-b border-zinc-900 pb-2">
              Assign Photographer
            </h3>

            <form onSubmit={handleAssignPhotographerSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">
                  Photographer Name / Team Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Gupta (Lead)"
                  value={photographerName}
                  onChange={(e) => setPhotographerName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 px-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white text-xs uppercase tracking-wider rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-wider rounded-none hover:bg-white transition-all"
                >
                  Confirm Staff Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
