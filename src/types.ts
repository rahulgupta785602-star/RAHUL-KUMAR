export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  tax: number; // percentage, e.g. 18 for 18% GST
  image: string;
}

export interface Booking {
  id?: string;
  orderId: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  serviceId: string;
  serviceName: string;
  price: number;
  bookingDate: string;
  bookingTime: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  instructions: string;
  paymentMethod: string;
  advanceAmount: number;
  remainingAmount: number;
  status: 'Pending' | 'Confirmed' | 'Photographer Assigned' | 'Payment Pending' | 'Work in Progress' | 'Editing' | 'Ready for Delivery' | 'Completed' | 'Cancelled';
  photographerAssigned?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  orderId: string;
  amount: number;
  method: string;
  status: 'Pending' | 'Paid' | 'Partially Paid' | 'Refunded';
  transactionId: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  serviceName: string;
  bookingDate: string;
  amount: number;
  gst: number;
  discount: number;
  finalAmount: number;
  paymentStatus: string;
  qrCodeData?: string;
  signature?: string;
  createdAt: string;
}

export interface Admin {
  uid: string;
  email: string;
  role: string;
}
