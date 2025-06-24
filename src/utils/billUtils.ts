import { 
  Firestore, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs 
} from 'firebase/firestore';

export const generateBillNumber = async (db: Firestore, billDate: Date): Promise<string> => {
  try {
    const targetDate = new Date(billDate);
    const dateStr = targetDate.toLocaleDateString('en-GB', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    }).split('/').reverse().join(''); // This will give yymmdd format    
    if (!db) {
      throw new Error('Database instance not initialized');
    }
    
    const billsRef = collection(db, 'bills');
    
    // First, get all bills that start with the same date prefix in their ID
    // This is more reliable than filtering by date field alone
    const allBillsQuery = query(billsRef);
    const allBillsSnapshot = await getDocs(allBillsQuery);
    
    // Filter bills that have IDs starting with the same date prefix
    const sameDateBills = allBillsSnapshot.docs
      .filter(doc => doc.id.startsWith(dateStr))
      .map(doc => ({
        id: doc.id,        counter: parseInt(doc.id.slice(-2))
      }))
      .sort((a, b) => b.counter - a.counter); // Sort by counter descending

    let counter = 1;
    if (sameDateBills.length > 0) {
      counter = sameDateBills[0].counter + 1;
    }

    if (counter > 99) {
      throw new Error('Maximum bills for this date reached');
    }

    // Format counter as two digits (01, 02, etc.)
    const counterStr = counter.toString().padStart(2, '0');
    return `${dateStr}${counterStr}`;
  } catch (error) {
    console.error('Bill number generation error:', error);
    throw error;
  }
};

// Generate a short URL-friendly hash without using crypto
const generateHash = (length: number): string => {
  const chars = '123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateBillHash = (): string => {
  return generateHash(8);
};