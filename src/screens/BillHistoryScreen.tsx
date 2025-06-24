import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { ActivityIndicator, Text, Button } from 'react-native-paper';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useFirebase } from '../context/FirebaseContext';
import ScreenWrapper from '../components/Layout/ScreenWrapper';
import PurchaseHistoryItem from '../components/customer/PurchaseHistoryItem';
import { colors, spacing } from '../constants/theme';
import { Bill } from '../types/database';
import DateRangeFilter from '../components/analytics/DateRangeFilter';
import { Timestamp } from 'firebase/firestore';

type Props = {
  route: RouteProp<RootStackParamList, 'BillHistory'>;
};

export default function BillHistoryScreen({ route }: Props) {
  const { billService } = useFirebase();
  const navigation = useNavigation();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date>(() => new Date(route.params.startDate));
  const [endDate, setEndDate] = useState<Date>(() => new Date(route.params.endDate));

  const handleQuickSelect = (range: 'today' | 'yesterday' | 'week' | 'month' | 'previousMonth' | 'quarter' | 'year') => {
    let endDate = new Date();
    let start = new Date();

    switch (range) {
      case 'today':
        // start and end are already set correctly
        break;
      case 'yesterday':
        endDate.setDate(endDate.getDate() - 1);
        start.setDate(start.getDate() - 1);
        break;
      case 'week':
        start.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        start.setMonth(endDate.getMonth() - 1);
        break;
      case 'previousMonth':
        start = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        start.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'quarter':
        start.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    setStartDate(start);
    setEndDate(endDate);
  };

  useEffect(() => {
    loadBills(startDate, endDate);
  }, [startDate, endDate]);

  const loadBills = async (start: Date, end: Date) => {
    try {
      setLoading(true);
      const data = await billService.getBills(start, end);
      const sortedBills = data
        .map(bill => ({
          ...bill,
          date: (bill.date as unknown as Timestamp)?.toDate?.() || new Date(bill.date)
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      setBills(sortedBills);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBill = async (bill: Bill) => {
    try {
      await billService.moveBillToTrash(bill);
      setBills(bills.filter(b => b.id !== bill.id));
      Alert.alert(
        'Bill Moved to Trash',
        'The bill has been moved to trash. You can restore it from the trash section.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error moving bill to trash:', error);
      Alert.alert('Error', 'Failed to move bill to trash');
    }
  };

  const handleShareBill = async (bill: Bill) => {
    try {
      await billService.shareBillOnWhatsApp(bill);
    } catch (error) {
      console.error('Error sharing bill:', error);
      Alert.alert('Error', 'Failed to share bill');
    }
  };

  const handleEditBill = (bill: Bill) => {
    navigation.navigate('EditBill', { bill });
  };

  if (loading) {
    return (
      <ScreenWrapper style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.filterContainer}>
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(!showDatePicker)}
          style={styles.dateFilterButton}
        >
          {showDatePicker ? 'Hide Date Filter' : 'Show Date Filter'}
        </Button>
      </View>

      {showDatePicker && (
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onQuickSelect={handleQuickSelect}
        />
      )}

      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PurchaseHistoryItem
            bill={item}
            onPress={() => {}}
            onDelete={handleDeleteBill}
            onShare={handleShareBill}
            onEdit={handleEditBill}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No bills found for the selected date range
            </Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: colors.disabled,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md,
    gap: spacing.sm,
  },
  dateFilterButton: {
    margin: spacing.md,
  },
}); 