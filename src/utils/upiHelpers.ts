import QRCode from 'react-native-qrcode-svg';

export const generateUPILink = (
  payeeVPA: string,  // UPI ID
  payeeName: string, // Business name
  amount: number,    // Transaction amount
  transactionNote: string // Bill number or note
) => {
  try {
    // Sanitize inputs
    const sanitizedPayeeName = encodeURIComponent(payeeName.trim());
    const sanitizedNote = encodeURIComponent(transactionNote.trim());
    const sanitizedAmount = Math.max(0, amount).toFixed(2);

    // Construct UPI URL string directly instead of using URL class
    const upiString = `upi://pay?pa=${payeeVPA}&pn=${sanitizedPayeeName}&am=${sanitizedAmount}&tn=${sanitizedNote}&cu=INR`;
    
    return upiString;
  } catch (error) {
    console.error('Error generating UPI link:', error);
    throw new Error('Failed to generate UPI link');
  }
};