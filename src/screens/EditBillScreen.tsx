import React, { useState } from 'react';
import { Alert } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useFirebase } from '../context/FirebaseContext';
import BillingForm from '../components/billing/BillingForm';
import ScreenWrapper from '../components/Layout/ScreenWrapper';
import { Bill } from '../types/database';
import { Timestamp } from 'firebase/firestore';

type Props = {
  route: RouteProp<RootStackParamList, 'EditBill'>;
};

export default function EditBillScreen({ route }: Props) {
  const { bill } = route.params;
  const navigation = useNavigation();
  const { billService } = useFirebase();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (updatedBillData: Omit<Bill, 'id' | 'billNumber' | 'date' | 'pdfUrl'> & { selectedDate: Date }) => {
    setIsLoading(true);
    try {
      // Extract the selected date from the form data
      const { selectedDate, ...restBillData } = updatedBillData;

      const updatedBill: Bill = {
        ...bill,
        ...restBillData,
        date: selectedDate // Use the selected date from the form
      };

      await billService.updateBill(updatedBill);
      Alert.alert('Success', 'Bill updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating bill:', error);
      Alert.alert('Error', 'Failed to update bill');
    } finally {
      setIsLoading(false);
    }
  };
  const billDateForForm = bill.date instanceof Date 
    ? bill.date 
    : (bill.date as Timestamp)?.toDate?.() || new Date();

  return (
    <ScreenWrapper>
      <BillingForm
        onSubmit={handleUpdate}
        isLoading={isLoading}
        initialValues={{
          ...bill,
          date: billDateForForm
        }}
        isEditing={true}
      />
    </ScreenWrapper>
  );
}