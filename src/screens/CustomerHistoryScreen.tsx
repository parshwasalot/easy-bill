import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Clipboard, Alert, Platform, ToastAndroid } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useFirebase } from '../context/FirebaseContext';
import { Bill } from '../types/database';
import ScreenWrapper from '../components/Layout/ScreenWrapper';
import PurchaseHistoryItem from '../components/customer/PurchaseHistoryItem';
import { colors, spacing } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';

type Props = {
  route: RouteProp<RootStackParamList, 'CustomerHistory'>;
};

const BILLS_PER_PAGE = 10;

export default function CustomerHistoryScreen({ route }: Props) {
  const { customer } = route.params;
  const { billService } = useFirebase();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    loadInitialBills();
  }, []);

  const loadInitialBills = async () => {
    try {
      setLoading(true);
      const customerBills = await billService.getCustomerBills(customer.phone);
      setBills(customerBills.slice(0, BILLS_PER_PAGE));
      setHasMore(customerBills.length > BILLS_PER_PAGE);
    } catch (error) {
      console.error('Error loading purchase history:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreBills = async () => {
    try {
      setLoadingMore(true);
      const customerBills = await billService.getCustomerBills(customer.phone);
      const nextBills = customerBills.slice(bills.length, bills.length + BILLS_PER_PAGE);
      setBills([...bills, ...nextBills]);
      setHasMore(customerBills.length > bills.length + BILLS_PER_PAGE);
    } catch (error) {
      console.error('Error loading more bills:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const calculateTotals = () => {
    return {
      total: bills.reduce((acc, bill) => acc + bill.totalAmount, 0),
      totalBills: bills.length
    };
  };

  const { total, totalBills } = calculateTotals();

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied to clipboard');
    }
  };

  const handleDeleteBill = async (bill: Bill) => {
    try {
      await billService.moveBillToTrash(bill);
      setBills(bills.filter(b => b.id !== bill.id));
      // Show success message
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
      <ScreenWrapper>
        <ActivityIndicator style={styles.loader} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => copyToClipboard(customer.phone)}
            style={styles.headerItem}
          >
            <Text style={styles.customerName}>{customer.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => copyToClipboard(customer.phone)}
            style={styles.headerItem}
          >
            <Text style={styles.customerPhone}>{customer.phone}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Purchases</Text>
            <Text style={styles.summaryValue}>₹{total}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Bills</Text>
            <Text style={styles.summaryValue}>{totalBills}</Text>
          </View>
        </View>

        <ScrollView style={styles.purchaseList}>
          {bills.map((bill) => (
            <PurchaseHistoryItem
              key={bill.id}
              bill={bill}
              onPress={() => {}}
              onDelete={handleDeleteBill}
              onShare={handleShareBill}
              onEdit={handleEditBill}
            />
          ))}
          
          {bills.length === 0 && (
            <Text style={styles.noPurchases}>No purchase history found</Text>
          )}
          
          {hasMore && (
            <Button
              mode="outlined"
              onPress={loadMoreBills}
              loading={loadingMore}
              style={styles.loadMoreButton}
            >
              Load More
            </Button>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  customerPhone: {
    fontSize: 16,
    color: colors.secondary,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.secondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  purchaseList: {
    flex: 1,
    padding: spacing.md,
  },
  loader: {
    flex: 1,
  },
  noPurchases: {
    textAlign: 'center',
    color: colors.disabled,
    marginTop: spacing.lg,
  },
  loadMoreButton: {
    margin: spacing.md,
  },
  headerItem: {
    padding: spacing.xs,
  },
}); 