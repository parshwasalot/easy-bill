import { Linking } from 'react-native';

export const sendWhatsAppMessage = async (phone: string, message: string) => {
  // Clean the phone number and ensure it has country code
  const cleanPhone = phone.replace(/\D/g, '');
  const phoneWithCountryCode = cleanPhone.startsWith('91') 
    ? cleanPhone 
    : `91${cleanPhone}`;
    
  const whatsappUrl = `whatsapp://send?phone=${phoneWithCountryCode}&text=${encodeURIComponent(message)}`;
  
  try {
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    if (!canOpen) {
      throw new Error('WhatsApp is not installed');
    }
    await Linking.openURL(whatsappUrl);
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    throw error;
  }
}; 