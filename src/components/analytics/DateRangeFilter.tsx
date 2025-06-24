import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography } from '../../constants/theme';

interface DateRangeFilterProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onQuickSelect: (range: 'today' | 'yesterday' | 'week' | 'month' | 'previousMonth' | 'quarter' | 'year') => void;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onQuickSelect,
}: DateRangeFilterProps) {
  const [showStartPicker, setShowStartPicker] = React.useState(false);
  const [showEndPicker, setShowEndPicker] = React.useState(false);
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.quickFilters}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button 
              mode="outlined" 
              onPress={() => setMenuVisible(true)}
              style={styles.dropdownButton}
            >
              Select Date Range
            </Button>
          }
        >
          <Menu.Item onPress={() => {
            onQuickSelect('today');
            setMenuVisible(false);
          }} title="Today" />
          <Menu.Item onPress={() => {
            onQuickSelect('yesterday');
            setMenuVisible(false);
          }} title="Yesterday" />
          <Menu.Item onPress={() => {
            onQuickSelect('week');
            setMenuVisible(false);
          }} title="Last Week" />
          <Menu.Item onPress={() => {
            onQuickSelect('month');
            setMenuVisible(false);
          }} title="Last 30 Days" />
          <Menu.Item onPress={() => {
            onQuickSelect('previousMonth');
            setMenuVisible(false);
          }} title="Previous Month" />
          <Menu.Item onPress={() => {
            onQuickSelect('quarter');
            setMenuVisible(false);
          }} title="Last Quarter" />
          <Menu.Item onPress={() => {
            onQuickSelect('year');
            setMenuVisible(false);
          }} title="Last Year" />
        </Menu>
      </View>

      <View style={styles.dateContainer}>
        <View style={styles.dateField}>
          <Text style={styles.label}>From</Text>
          <Button
            mode="outlined"
            onPress={() => setShowStartPicker(true)}
          >
            {startDate.toLocaleDateString()}
          </Button>
        </View>

        <View style={styles.dateField}>
          <Text style={styles.label}>To</Text>
          <Button
            mode="outlined"
            onPress={() => setShowEndPicker(true)}
          >
            {endDate.toLocaleDateString()}
          </Button>
        </View>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          onChange={(_, date) => {
            setShowStartPicker(false);
            if (date) onStartDateChange(date);
          }}
          maximumDate={endDate}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          onChange={(_, date) => {
            setShowEndPicker(false);
            if (date) onEndDateChange(date);
          }}
          minimumDate={startDate}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  quickFilters: {
    marginBottom: spacing.md,
  },
  dropdownButton: {
    width: '100%',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
}); 