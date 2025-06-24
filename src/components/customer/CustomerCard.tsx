import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Customer } from '../../types/database';
import { colors, spacing, typography } from '../../constants/theme';

interface CustomerCardProps {
  customer: Customer;
  onPress: (customer: Customer) => void;
}

export default function CustomerCard({ customer, onPress }: CustomerCardProps) {
  return (
    <TouchableOpacity onPress={() => onPress(customer)}>
      <Surface style={styles.container} elevation={1}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <MaterialCommunityIcons 
              name="account" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.name}>{customer.name}</Text>
          </View>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={24} 
            color={colors.border} 
          />
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons 
              name="phone" 
              size={16} 
              color={colors.secondary} 
            />
            <Text style={styles.detailText}>{customer.phone}</Text>
          </View>
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.headingSmall,
    color: colors.text,
  },
  details: {
    gap: spacing.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    ...typography.bodyMedium,
    color: colors.secondary,
  },
}); 