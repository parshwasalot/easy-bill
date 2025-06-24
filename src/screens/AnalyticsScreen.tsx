import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl, Text } from 'react-native';
import { ActivityIndicator, Button, IconButton } from 'react-native-paper';
import { useFirebase } from '../context/FirebaseContext';
import { Bill } from '../types/database';
import AnalyticsCard from '../components/analytics/AnalyticsCard';
import PaymentDistribution from '../components/analytics/PaymentDistribution';
import ScreenWrapper from '../components/Layout/ScreenWrapper';
import { colors, spacing, typography } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import DateRangeFilter from '../components/analytics/DateRangeFilter';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function AnalyticsScreen() {
  const { billService } = useFirebase();
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  
  // Set default dates to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalBills: 0,
    totalQuantity: 0,
    sareeQuantity: 0,
    dressQuantity: 0,
    suitQuantity: 0,
    cashAmount: 0,
    upiAmount: 0,
  });

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const bills = await billService.getBills(startDate, endDate);
      setAnalytics(processAnalytics(bills));
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalytics = (bills: Bill[]) => {
    const totalSales = Number(bills.reduce((sum, bill) => 
      sum + (Number(bill.totalAmount) || 0), 0).toFixed(2));
    
    const cashAmount = Number(bills
      .filter(bill => bill.paymentMode === 'CASH')
      .reduce((sum, bill) => sum + (Number(bill.totalAmount) || 0), 0).toFixed(2));
    
    const upiAmount = Number(bills
      .filter(bill => bill.paymentMode === 'UPI')
      .reduce((sum, bill) => sum + (Number(bill.totalAmount) || 0), 0).toFixed(2));

    const itemQuantities = bills.reduce((acc, bill) => {
      bill.items.forEach(item => {
        acc.total += item.quantity;
        switch (item.name) {
          case 'Saree':
            acc.saree += item.quantity;
            break;
          case 'Dress':
            acc.dress += item.quantity;
            break;
          case 'Suit-Piece':
            acc.suit += item.quantity;
            break;
        }
      });
      return acc;
    }, { total: 0, saree: 0, dress: 0, suit: 0 });

    return {
      totalSales,
      totalBills: bills.length,
      totalQuantity: itemQuantities.total,
      sareeQuantity: itemQuantities.saree,
      dressQuantity: itemQuantities.dress,
      suitQuantity: itemQuantities.suit,
      cashAmount,
      upiAmount,
    };
  };

  const handleQuickSelect = (range: 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year' | 'previousMonth') => {
    let endDate = new Date();
    let start = new Date();

    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'yesterday':
        start.setDate(start.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start.setDate(endDate.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        start.setMonth(endDate.getMonth() - 1);
        start.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'previousMonth':
        // Get first day of previous month
        start = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        // Get last day of previous month
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        // Set time to include full day
        start.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'quarter':
        start.setMonth(endDate.getMonth() - 3);
        start.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'year':
        start.setFullYear(endDate.getFullYear() - 1);
        start.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
    }

    setStartDate(start);
    setEndDate(endDate);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadAnalytics().finally(() => setRefreshing(false));
  }, [startDate, endDate]);

  useEffect(() => {
    loadAnalytics();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <ScreenWrapper style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.filterContainer}>
          <Button
            mode="outlined"
            onPress={() => setShowCustomDatePicker(!showCustomDatePicker)}
            style={styles.dateFilterButton}
          >
            {showCustomDatePicker ? 'Hide Date Filter' : 'Show Date Filter'}
          </Button>
          <IconButton
            icon="history"
            mode="outlined"
            onPress={() => navigation.navigate('BillHistory', { 
              startDate: startDate.toISOString(), 
              endDate: endDate.toISOString() 
            })}
          />
        </View>

        {showCustomDatePicker && (
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onQuickSelect={handleQuickSelect}
          />
        )}

        <View style={styles.cardRow}>
          <AnalyticsCard
            title="Sales"
            value={`₹${analytics.totalSales}`}
            icon="cash-register"
          />
        </View>

        <View style={styles.cardRow}>
          <AnalyticsCard
            title="Total Bills"
            value={analytics.totalBills.toString()}
            icon="receipt"
          />
          <AnalyticsCard
            title="Total Pieces"
            value={analytics.totalQuantity.toString()}
            icon="package-variant"
          />
        </View>

        <View style={styles.cardRow}>
          <AnalyticsCard
            title=""
            value={analytics.sareeQuantity.toString()}
            icon="hanger"
          />
          <AnalyticsCard
            title=""
            value={analytics.dressQuantity.toString()}
            icon="tshirt-crew"
          />
          <AnalyticsCard
            title=""
            value={analytics.suitQuantity.toString()}
            icon="archive"
          />
        </View>

        <PaymentDistribution
          cashAmount={analytics.cashAmount}
          upiAmount={analytics.upiAmount}
          totalAmount={analytics.totalSales}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  dateFilterButton: {
    flex: 1,
  },
  dateFilterButtonLabel: {
    textAlignVertical: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.sm,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dateField: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  dateLabel: {
    ...typography.bodySmall,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
}); 