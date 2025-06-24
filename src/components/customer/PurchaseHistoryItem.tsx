import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Bill } from '../../types/database';
import { colors, spacing, typography } from '../../constants/theme';

interface PurchaseHistoryItemProps {
  bill: Bill;
  onPress: (bill: Bill) => void;
  onShare?: (bill: Bill) => void;
  onDelete?: (bill: Bill) => void;
  onEdit?: (bill: Bill) => void;
  isTrash?: boolean;
}

export default function PurchaseHistoryItem({ 
  bill, 
  onPress, 
  onDelete,
  onShare,
  onEdit,
  isTrash = false
}: PurchaseHistoryItemProps) {
  const formatDate = (date: Date | any) => {
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Bill',
      'Are you sure you want to delete this bill? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => onDelete && onDelete(bill),
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <TouchableOpacity onPress={() => onPress(bill)}>
      <Surface style={styles.container} elevation={1}>
        <View style={styles.header}>
          <View style={styles.billInfo}>
            <Text style={styles.billNumber}>{bill.id}</Text>
            {bill.customerName && (
              <Text style={styles.customerName}>{bill.customerName}</Text>
            )}
            <Text style={styles.date}>{formatDate(bill.date)}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>₹{bill.totalAmount}</Text>
            <MaterialCommunityIcons 
              name={bill.paymentMode === 'CASH' ? 'cash' : 'qrcode'} 
              size={20} 
              color={colors.secondary} 
            />
          </View>
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

        <View style={styles.actions}>
          {!isTrash && (
            <>
              {onEdit && (
                <IconButton
                  icon="pencil"
                  onPress={() => onEdit(bill)}
                />
              )}
              {onShare && (
                <IconButton
                  icon="share"
                  onPress={() => onShare(bill)}
                />
              )}
            </>
          )}
          {onDelete && (
            <IconButton
              icon={isTrash ? "delete-forever" : "delete"}
              onPress={handleDelete}
            />
          )}
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
    alignItems: 'flex-start',
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
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  amount: {
    ...typography.headingSmall,
    color: colors.text,
  },
  itemsList: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  itemText: {
    ...typography.bodyMedium,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  customerName: {
    color: colors.secondary,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  }
}); 