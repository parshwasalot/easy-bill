import { collection, doc, setDoc, getDoc, query, where, orderBy, getDocs, deleteDoc, limit, writeBatch } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Bill, Customer, ShopDetails } from '../types/database';
import { sendWhatsAppMessage } from '../utils/whatsappUtils';
import { generateBillHash } from '@/utils/billUtils';

// Collection References
const COLLECTIONS = {
  SHOP: 'shop',
  CUSTOMERS: 'customers',
  BILLS: 'bills',
};

// Shop Details Services
export const shopService = {
  async getShopDetails(): Promise<ShopDetails | null> {
    const docRef = doc(db, COLLECTIONS.SHOP, 'details');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as ShopDetails : null;
  },

  async updateShopDetails(details: ShopDetails): Promise<void> {
    const docRef = doc(db, COLLECTIONS.SHOP, 'details');
    await setDoc(docRef, details);
  },
};

// Customer Services
export const customerService = {
  async getCustomerBills(phone: string): Promise<Bill[]> {
    const q = query(
      collection(db, COLLECTIONS.BILLS),
      where('customerPhone', '==', phone),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore Timestamp to Date
      return {
        ...data,
        date: data.date?.toDate() || new Date(),
      } as Bill;
    });
  },

  async addCustomer(customer: Customer): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CUSTOMERS, customer.phone);
    await setDoc(docRef, {
      name: customer.name,
      phone: customer.phone
    });
  },

  async getCustomers(): Promise<Customer[]> {
    const q = query(collection(db, COLLECTIONS.CUSTOMERS), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Customer);
  },

  async searchCustomers(searchText: string): Promise<Customer[]> {
    const q = query(
      collection(db, COLLECTIONS.CUSTOMERS),
      where('name', '>=', searchText),
      where('name', '<=', searchText + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Customer);
  },
};

// Bill Services
export const billService = {
  async addBill(bill: Bill): Promise<void> {
    const docRef = doc(db, COLLECTIONS.BILLS, bill.id);
    await setDoc(docRef, bill);
  },

  async getBills(startDate?: Date, endDate?: Date): Promise<Bill[]> {
    let q = query(collection(db, COLLECTIONS.BILLS), orderBy('date', 'desc'));
    
    if (startDate && endDate) {
      // Set start date to beginning of day (00:00:00)
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      // Set end date to end of day (23:59:59.999)
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      q = query(q, where('date', '>=', start), where('date', '<=', end));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Bill);
  },

  async getCustomerBills(phone: string): Promise<Bill[]> {
    const q = query(
      collection(db, COLLECTIONS.BILLS),
      where('customerPhone', '==', phone),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Bill);
  },

  async deleteBill(billId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.BILLS, billId);
    await deleteDoc(docRef);
  },

  async shareBillOnWhatsApp(bill: Bill): Promise<void> {
    const billUrl = `https://saree-shop-app.firebaseapp.com/${bill.urlHash}`;
    const message = `Thank you for shopping with us!\nBill #${bill.id}\nAmount: ₹${bill.totalAmount}\nView Bill: ${billUrl}`;
    await sendWhatsAppMessage(bill.customerPhone, message);
  },

  async moveBillToTrash(bill: Bill): Promise<void> {
    try {
      // First, add the bill to trash collection with additional metadata
      const trashBillRef = doc(db, 'trash', bill.id);
      await setDoc(trashBillRef, {
        ...bill,
        deletedAt: new Date(),
        originalCollection: 'bills'
      });

      // Then remove it from the bills collection
      const billRef = doc(db, COLLECTIONS.BILLS, bill.id);
      await deleteDoc(billRef);
    } catch (error) {
      console.error('Error moving bill to trash:', error);
      throw error;
    }
  },

  async restoreBillFromTrash(billId: string): Promise<void> {
    try {
      // Get the bill from trash
      const trashBillRef = doc(db, 'trash', billId);
      const trashBillSnap = await getDoc(trashBillRef);
      
      if (!trashBillSnap.exists()) {
        throw new Error('Bill not found in trash');
      }

      const billData = trashBillSnap.data();
      
      // Remove deletedAt and originalCollection fields
      const { deletedAt, originalCollection, ...originalBill } = billData;

      // Restore to original collection
      const billRef = doc(db, COLLECTIONS.BILLS, billId);
      await setDoc(billRef, originalBill);

      // Remove from trash
      await deleteDoc(trashBillRef);
    } catch (error) {
      console.error('Error restoring bill from trash:', error);
      throw error;
    }
  },

  async getTrashBills(): Promise<Bill[]> {
    try {
      const trashRef = collection(db, 'trash');
      const q = query(trashRef, orderBy('deletedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Bill[];
    } catch (error) {
      console.error('Error getting trash bills:', error);
      throw error;
    }
  },

  async updateBill(bill: Bill): Promise<void> {
    try {
      // Ensure we're working with a proper Date object
      let billDate: Date;
      if (bill.date instanceof Date) {
        billDate = bill.date;
      } else if (bill.date && typeof bill.date === 'object' && 'toDate' in bill.date) {
        billDate = (bill.date as any).toDate();
      } else {
        billDate = new Date(bill.date as string | number);
      }

      const billRef = doc(db, COLLECTIONS.BILLS, bill.id);
      await setDoc(billRef, {
        ...bill,
        date: billDate
      });
    } catch (error) {
      console.error('Error updating bill:', error);
      throw error;
    }
  },

  async deleteBillFromTrash(billId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.BILLS, billId);
    await deleteDoc(docRef);
  },

  async getBillByHash(hash: string): Promise<Bill | null> {
    const q = query(
      collection(db, COLLECTIONS.BILLS),
      where('urlHash', '==', hash),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return querySnapshot.docs[0].data() as Bill;
  },

  async migrateOldBills(): Promise<void> {
    try {
      const billsRef = collection(db, 'bills');
      const q = query(billsRef, where('urlHash', '==', null));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      
      querySnapshot.docs.forEach(document => {
        const billData = document.data();
        const billRef = document.ref;
        
        // Generate hash for old bill
        const hash = generateBillHash();
        
        // Update the document with the new hash
        batch.update(billRef, {
          urlHash: hash
        });
        
        // Also create a reference in old_bills collection
        const oldBillRef = doc(db, 'old_bills', document.id);
        batch.set(oldBillRef, {
          ...billData,
          urlHash: hash
        });
      });
      
      await batch.commit();
      console.log(`Migrated ${querySnapshot.size} old bills`);
    } catch (error) {
      console.error('Error migrating old bills:', error);
      throw error;
    }
  },

  async ensureOldBillRedirect(billId: string): Promise<string | null> {
    // Check if bill exists in old_bills collection
    const oldBillRef = doc(db, 'old_bills', billId);
    const oldBillDoc = await getDoc(oldBillRef);
    
    if (oldBillDoc.exists()) {
      const billData = oldBillDoc.data();
      return billData.urlHash || null;
    }
    
    return null;
  }
};