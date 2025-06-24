import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Bill } from '../../types/database';
import { colors, spacing, typography } from '../../constants/theme';
import { Timestamp } from 'firebase/firestore';

interface BillHistoryItemProps {
  bill: Bill;
  onPress: (bill: Bill) => void;
}

export default function BillHistoryItem({ bill, onPress }: BillHistoryItemProps) {
  const formatDate = (date: Date | Timestamp) => {
    const dateObj = date instanceof Date ? date : date.toDate();
    return dateObj.toLocaleDateString();
  };

  return (
    <TouchableOpacity onPress={() => onPress(bill)}>
      <Surface style={styles.container} elevation={1}>
        <View style={styles.header}>
          <View style={styles.billInfo}>
            <Text style={styles.billNumber}>{bill.id}</Text>
            <Text style={styles.date}>{formatDate(bill.date)}</Text>
          </View>
          <MaterialCommunityIcons 
            name={bill.paymentMode === 'CASH' ? 'cash' : 'qrcode'} 
            size={24} 
            color={colors.secondary} 
          />
        </View>

        <View style={styles.customerInfo}>
          <MaterialCommunityIcons 
            name="account" 
            size={16} 
            color={colors.secondary} 
          />
          <Text style={styles.customerName}>{bill.customerName}</Text>
          <Text style={styles.customerPhone}>{bill.customerPhone}</Text>
        </View>

        <View style={styles.itemsList}>
          {bill.items.map((item, index) => (
            <Text key={index} style={styles.itemText}>
              {item.quantity}x {item.name}
              {item.customName ? ` (${item.customName})` : ''} 
              (₹{item.price})
            </Text>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.itemCount}>
            {bill.items.length} items
          </Text>
          <Text style={styles.amount}>₹{bill.totalAmount}</Text>
        </View>
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  billInfo: {
    flex: 1,
  },
  billNumber: {
    ...typography.bodyLarge,
    fontWeight: 'bold',
    color: colors.primary,
  },
  date: {
    ...typography.bodySmall,
    color: colors.secondary,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  customerName: {
    ...typography.bodyMedium,
    flex: 1,
  },
  customerPhone: {
    ...typography.bodySmall,
    color: colors.secondary,
  },
  itemsList: {
    marginBottom: spacing.sm,
  },
  itemText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  itemCount: {
    ...typography.bodySmall,
    color: colors.secondary,
  },
  amount: {
    ...typography.headingSmall,
    color: colors.text,
  },
}); 