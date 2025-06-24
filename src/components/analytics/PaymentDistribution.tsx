import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';

interface PaymentDistributionProps {
  cashAmount: number;
  upiAmount: number;
  totalAmount: number;
}

export default function PaymentDistribution({ 
  cashAmount, 
  upiAmount, 
  totalAmount 
}: PaymentDistributionProps) {
  // Safely calculate percentages with fixed precision
  const calculatePercentage = (amount: number): number => {
    if (totalAmount === 0) return 0;
    // Limit to 2 decimal places and ensure it's between 0 and 1
    return Math.min(1, Math.max(0, Number((amount / totalAmount).toFixed(2))));
  };

  const cashPercentage = calculatePercentage(cashAmount);
  const upiPercentage = calculatePercentage(upiAmount);

  // Format currency amounts
  const formatAmount = (amount: number): string => {
    return `₹${Number(amount).toFixed(2)}`;
  };

  // Format percentage for display
  const formatPercentage = (percentage: number): string => {
    return `${(percentage * 100).toFixed(1)}%`;
  };

  return (
    <Surface style={styles.container} elevation={1}>
      <Text style={styles.title}>Payment Distribution</Text>

      <View style={[styles.distributionContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <View style={styles.paymentType}>
          <View style={styles.paymentHeader}>
            <MaterialCommunityIcons name="cash" size={24} color={colors.success} />
            <Text style={styles.paymentLabel}>Cash</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amount}>{formatAmount(cashAmount)}</Text>
            <Text style={styles.percentage}>
              ({formatPercentage(calculatePercentage(cashAmount))})
            </Text>
          </View>
        </View>

        <View style={styles.paymentType}>
          <View style={styles.paymentHeader}>
            <MaterialCommunityIcons name="qrcode" size={24} color={colors.primary} />
            <Text style={styles.paymentLabel}>UPI</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amount}>{formatAmount(upiAmount)}</Text>
            <Text style={styles.percentage}>
              ({formatPercentage(calculatePercentage(upiAmount))})
            </Text>
          </View>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.surface,
    margin: spacing.md,
  },
  title: {
    ...typography.headingSmall,
    marginBottom: spacing.md,
  },
  distributionContainer: {
    // Remove the gap property if you want to control spacing using justifyContent
  },
  paymentType: {
    flex: 1, // Add this to ensure equal width distribution
    gap: spacing.sm,
    paddingHorizontal: spacing.sm, // Optional: Add some horizontal padding
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  paymentLabel: {
    ...typography.bodyMedium,
    color: colors.secondary,
  },
  amount: {
    ...typography.headingSmall,
    color: colors.text,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  percentage: {
    ...typography.bodySmall,
    color: colors.secondary,
    alignSelf: 'flex-end',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}); 