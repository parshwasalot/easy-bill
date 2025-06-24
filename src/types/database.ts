import { Timestamp } from 'firebase/firestore';

// Shop Details Type
export interface ShopDetails {
  id: string;
  name: string;
  address: string;
  phone: string;
  gst?: string;
  logo?: string;
  upiId: string;
}

// Customer Type
export interface Customer {
  name: string;
  phone: string;
}

// Product Type
export interface Product {
  id: string;
  name: 'Saree' | 'Dress' | 'Suit-Piece';
  customName?: string;
  price: number;
  quantity: number;
}

// Bill Type
export interface Bill {
  id: string;
  urlHash: string;
  date: Date | Timestamp;
  customerName?: string;
  customerPhone: string;
  items: Product[];
  totalAmount: number;
  paymentMode: 'CASH' | 'UPI';
}