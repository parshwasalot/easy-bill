import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Chip, Searchbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography } from '../../constants/theme';

interface BillHistoryFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  selectedPaymentMode: 'ALL' | 'CASH' | 'UPI';
  onPaymentModeChange: (mode: 'ALL' | 'CASH' | 'UPI') => void;
  onReset: () => void;
}

export default function BillHistoryFilter({
  searchQuery,
  onSearchChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectedPaymentMode,
  onPaymentModeChange,
  onReset,
}: BillHistoryFilterProps) {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by bill number or customer..."
        onChangeText={onSearchChange}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.dateContainer}>
        <View style={styles.dateField}>
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(_, date) => date && onStartDateChange(date)}
            maximumDate={endDate}
          />
        </View>

        <View style={styles.dateField}>
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(_, date) => date && onEndDateChange(date)}
            minimumDate={startDate}
            maximumDate={new Date()}
          />
        </View>
      </View>

      <View style={styles.paymentModeFilter}>
        <Chip
          selected={selectedPaymentMode === 'ALL'}
          onPress={() => onPaymentModeChange('ALL')}
          style={styles.chip}
        >
          All
        </Chip>
        <Chip
          selected={selectedPaymentMode === 'CASH'}
          onPress={() => onPaymentModeChange('CASH')}
          style={styles.chip}
        >
          Cash
        </Chip>
        <Chip
          selected={selectedPaymentMode === 'UPI'}
          onPress={() => onPaymentModeChange('UPI')}
          style={styles.chip}
        >
          UPI
        </Chip>
      </View>

      <Button
        mode="outlined"
        onPress={onReset}
        style={styles.resetButton}
      >
        Reset Filters
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    marginBottom: spacing.md,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  dateField: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  paymentModeFilter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  chip: {
    marginHorizontal: spacing.xs,
  },
  resetButton: {
    marginTop: spacing.sm,
  },
}); 