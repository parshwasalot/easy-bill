import { Bill, Customer, ShopDetails, Product } from '../types/database';

export const generateMockProduct = (override?: Partial<Product>): Product => ({
  id: Math.random().toString(),
  name: 'Saree',
  price: 1000,
  quantity: 1,
  ...override
});

export const generateMockBill = (override?: Partial<Bill>): Bill => ({
  id: Math.random().toString(),
  date: new Date(),
  customerName: 'Test Customer',
  customerPhone: '1234567890',
  items: [generateMockProduct()],
  totalAmount: 1000,
  paymentMode: 'CASH',
  ...override
});

export const generateMockCustomer = (override?: Partial<Customer>): Customer => ({
  name: 'Test Customer',
  phone: '1234567890',
  ...override
});

export const generateMockShopDetails = (override?: Partial<ShopDetails>): ShopDetails => ({
  id: 'details',
  name: 'Test Shop',
  address: 'Test Address',
  phone: '1234567890',
  gst: 'TESTGST123',
  logo: '',
  upiId: 'testshop@upi',
  ...override
});

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const simulateNetworkDelay = async () => {
  if (__DEV__) {
    await wait(Math.random() * 1000);
  }
}; 