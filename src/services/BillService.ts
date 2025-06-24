import { Firestore, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Bill } from '../types/database';

export class BillService {
  private db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async updateBill(bill: Bill): Promise<void> {
    try {
      // Ensure we're working with a proper Date object
      let billDate: Date;
      if (bill.date instanceof Date) {
        billDate = bill.date;
      } else if (bill.date instanceof Timestamp) {
        billDate = bill.date.toDate();
      } else {
        billDate = new Date(bill.date as string | number);
      }

      const billRef = doc(this.db, 'bills', bill.id);
      await updateDoc(billRef, {
        ...bill,
        date: Timestamp.fromDate(billDate)
      });
    } catch (error) {
      console.error('Error updating bill:', error);
      throw error;
    }
  }

  async deleteBillFromTrash(billId: string): Promise<void> {
    try {
      const billRef = doc(this.db, 'bills', billId);
      await deleteDoc(billRef);
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw error;
    }
  }
}
