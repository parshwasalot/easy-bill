import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography } from '../../constants/theme';

interface HistoryFilterProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onReset: () => void;
}

export default function HistoryFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: HistoryFilterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <View style={styles.dateField}>
          <Text style={styles.label}>From</Text>
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(_, date) => date && onStartDateChange(date)}
            maximumDate={endDate}
            style={styles.datePicker}
          />
        </View>

        <View style={styles.dateField}>
          <Text style={styles.label}>To</Text>
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(_, date) => date && onEndDateChange(date)}
            minimumDate={startDate}
            maximumDate={new Date()}
            style={styles.datePicker}
          />
        </View>
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
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  dateField: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  label: {
    ...typography.bodySmall,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  datePicker: {
    width: '100%',
  },
  resetButton: {
    marginTop: spacing.sm,
  },
}); 