import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFirebase } from '../context/FirebaseContext';
import { Bill } from '../types/database';
import BillingForm from '../components/billing/BillingForm';
import ScreenWrapper from '../components/Layout/ScreenWrapper';
import { db } from '../utils/firebase';
import { RootStackParamList } from '../types/navigation';
import { sendWhatsAppMessage } from '../utils/whatsappUtils';
import { Customer } from '../types/database';
import { generateBillNumber } from '../utils/billUtils';
import { spacing } from '../constants/theme';
import { generateBillHash } from '../utils/billUtils';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function BillingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { billService, customerService } = useFirebase();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (billData: Omit<Bill, 'id' | 'date' | 'urlHash'> & { selectedDate: Date }) => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!billData.customerPhone || !billData.customerName || !billData.items.length) {
        throw new Error('Please fill in all required fields');
      }

      // Validate products
      if (billData.items.some(item => !item.name || item.price <= 0)) {
        throw new Error('Please ensure all products have names and valid prices');
      }

      const billId = await generateBillNumber(db, billData.selectedDate);
      const urlHash = generateBillHash();
      
      const customer: Customer = {
        name: billData.customerName,
        phone: billData.customerPhone
      };

      // Add customer first
      await customerService.addCustomer(customer);

      // Use the selected date from the form
      const { selectedDate, ...restBillData } = billData;

      const newBill: Bill = {
        ...restBillData,
        id: billId,
        urlHash,
        date: selectedDate, // Use the selected date instead of current date
      };      // Add bill document
      await billService.addBill(newBill);
      
      const billUrl = `https://saree-shop-app.firebaseapp.com/${newBill.urlHash}`;
      
      Alert.alert(
        'Success',
        'Bill has been generated successfully!',
        [
          {
            text: 'Share on WhatsApp',
            onPress: async () => {
              try {
                const message = `Thank you for shopping with *UDAY SAREE SHOW-ROOM* ! Your bill #${billId} has been generated!\nAmount: ₹${billData.totalAmount}\nView Bill: ${billUrl}`;
                await sendWhatsAppMessage(billData.customerPhone, message);
              } catch (error) {
                console.error('WhatsApp sharing error:', error);
                Alert.alert(
                  'WhatsApp Error',
                  'Failed to open WhatsApp. Please ensure WhatsApp is installed.'
                );
              }
            }
          },
          {
            text: 'Done',
            onPress: () => navigation.navigate('Main')
          }
        ]
      );
    } catch (error) {
      console.error('Bill generation error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to generate bill. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <BillingForm onSubmit={handleSubmit} isLoading={isLoading} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md
  },
});