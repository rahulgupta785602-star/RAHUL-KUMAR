import React from 'react';
import { Booking } from '../types';
import { Printer, Download, Receipt, Camera, Check } from 'lucide-react';

interface InvoiceViewProps {
  booking: Booking;
  onClose: () => void;
}

export default function InvoiceView({ booking, onClose }: InvoiceViewProps) {
  // Generate invoice number from booking date/timestamp
  const invoiceNumber = `GINV-${booking.orderId.replace('GPS', '')}`;
  const basePrice = booking.price;
  const discount = booking.price > 30000 ? 2000 : 0; // Simulated discount based on package
  const gstPercentage = 18;
  const gstAmount = Math.round(basePrice * (gstPercentage / 100));
  const finalAmount = basePrice + gstAmount - discount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="invoice-modal-overlay" className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto print:bg-white print:p-0">
      <div className="bg-zinc-950 border border-zinc-800 p-8 max-w-3xl w-full rounded-none shadow-2xl relative print:bg-white print:border-none print:shadow-none print:p-0 print:absolute print:inset-0">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-900 print:hidden">
          <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.25em] flex items-center gap-1.5">
            <Receipt className="w-4 h-4" />
            Invoice Generated
          </span>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-zinc-800 text-zinc-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 text-xs uppercase tracking-wider rounded-none flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-wider rounded-none flex items-center gap-1.5 hover:bg-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white text-xs uppercase tracking-wider rounded-none transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="bg-black border border-zinc-900 p-8 space-y-8 text-white print:bg-white print:text-black print:border-none print:p-0">
          
          {/* Header Row: Company & Invoice Info */}
          <div className="flex justify-between items-start border-b border-zinc-900 pb-6 print:border-zinc-300">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] print:bg-zinc-100 print:border-black print:text-black">
                  <Camera className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-bold tracking-wider uppercase text-white print:text-black">Gupta Photo Studio</h1>
              </div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest print:text-zinc-600">
                Premium Photography & Videography Services<br />
                Plot No. 12, Block C, Sector 62, Noida, UP &bull; 201301<br />
                GSTIN: 09AAPCG1234F1Z0
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#D4AF37] uppercase tracking-[0.2em] font-semibold block print:text-black">Tax Invoice</span>
              <h2 className="text-lg font-mono font-bold mt-1 text-white print:text-black">{invoiceNumber}</h2>
              <p className="text-zinc-500 text-[10px] uppercase tracking-wider mt-1 print:text-zinc-600">
                Invoice Date: {new Date().toLocaleDateString('en-IN')}<br />
                Order ID: {booking.orderId}
              </p>
            </div>
          </div>

          {/* Client & Event Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs uppercase tracking-widest text-zinc-400 print:text-zinc-600">
            <div>
              <h3 className="text-[10px] text-zinc-500 font-bold mb-2 print:text-zinc-700">Billed To:</h3>
              <p className="text-sm text-white font-medium mb-1 print:text-black">{booking.customerName}</p>
              <p className="leading-relaxed">
                Phone: {booking.phone}<br />
                Email: {booking.email}<br />
                Address: {booking.address}, {booking.city}, {booking.state} - {booking.pincode}
              </p>
            </div>

            <div className="sm:text-right">
              <h3 className="text-[10px] text-zinc-500 font-bold mb-2 print:text-zinc-700">Session Schedule:</h3>
              <p className="text-sm text-white font-medium mb-1 print:text-black">{booking.serviceName}</p>
              <p className="leading-relaxed">
                Date: {booking.bookingDate}<br />
                Time: {booking.bookingTime}<br />
                Location: {booking.city}
              </p>
            </div>
          </div>

          {/* Line Item Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs uppercase tracking-wider border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 print:border-zinc-300 print:text-zinc-700">
                  <th className="py-3 font-semibold">Service Description</th>
                  <th className="py-3 text-right font-semibold">Rate</th>
                  <th className="py-3 text-right font-semibold">Discount</th>
                  <th className="py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-900 text-white print:border-zinc-200 print:text-black">
                  <td className="py-4">
                    <p className="font-semibold text-sm">{booking.serviceName}</p>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mt-0.5">
                      Elite 4K Cinematic & High-Res Digital Coverage
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono">₹{basePrice.toLocaleString()}</td>
                  <td className="py-4 text-right font-mono text-red-400 print:text-red-600">₹{discount.toLocaleString()}</td>
                  <td className="py-4 text-right font-mono">₹{(basePrice - discount).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pricing Calculations & QR */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-6 border-t border-zinc-900 print:border-zinc-300">
            {/* Left: QR Code & Payment Method */}
            <div className="flex items-center gap-4 bg-zinc-950 p-4 border border-zinc-900 print:bg-zinc-100 print:border-zinc-300 rounded-none w-full sm:max-w-xs">
              <div className="w-20 h-20 bg-white p-1 flex items-center justify-center shrink-0 border border-zinc-300">
                {/* Simulated Custom Premium Payment QR Code */}
                <div className="w-full h-full border-2 border-black flex flex-col justify-between p-1 bg-white">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-black" />
                    <div className="w-4 h-4 bg-black" />
                  </div>
                  <div className="text-[6px] text-black font-bold text-center leading-none">SCAN TO PAY</div>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-black" />
                    <div className="w-2 h-2 bg-black" />
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider print:text-zinc-600">
                <span className="text-white font-semibold block mb-1 print:text-black">Scan to Pay Advance</span>
                Method: {booking.paymentMethod}<br />
                Status: <span className="text-[#D4AF37] font-semibold print:text-black">Partially Paid (Advance)</span>
              </div>
            </div>

            {/* Right: Calculations Summary */}
            <div className="w-full sm:max-w-xs space-y-2 text-xs uppercase tracking-widest text-zinc-400 print:text-zinc-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-white print:text-black">₹{(basePrice - discount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%):</span>
                <span className="font-mono text-white print:text-black">₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#D4AF37] pt-2 border-t border-zinc-900 print:border-zinc-300 print:text-black">
                <span>Total Amount:</span>
                <span className="font-mono text-white print:text-black">₹{finalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#D4AF37] font-semibold pt-1">
                <span>Advance Paid:</span>
                <span className="font-mono text-emerald-400">₹{booking.advanceAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span>Balance Due:</span>
                <span className="font-mono text-white print:text-black">₹{booking.remainingAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer with Signatures */}
          <div className="flex justify-between items-center pt-8 border-t border-zinc-900 print:border-zinc-300">
            <p className="text-[9px] text-zinc-600 uppercase tracking-widest">
              Thank you for choosing Gupta Photo Studio.<br />
              Subject to Noida jurisdiction. This is a computer-generated tax invoice.
            </p>

            <div className="text-right">
              {/* Mock Signature display */}
              <div className="font-serif italic text-base text-[#D4AF37] font-semibold tracking-wider print:text-black">
                Rahul Gupta
              </div>
              <div className="w-24 h-[1px] bg-[#D4AF37] ml-auto my-1 print:bg-zinc-300" />
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Authorized Signatory</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
