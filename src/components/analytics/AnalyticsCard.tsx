import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';

interface AnalyticsCardProps {
  title: string;
  value: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  subtitle?: string;
  trend?: {
    type: 'up' | 'down' | 'neutral';
    value: string;
  };
}

export default function AnalyticsCard({ title, value, icon, subtitle, trend }: AnalyticsCardProps) {
  const getTrendColor = (type: 'up' | 'down' | 'neutral') => {
    switch (type) {
      case 'up':
        return colors.success;
      case 'down':
        return colors.error;
      default:
        return colors.secondary;
    }
  };

  const getTrendIcon = (type: 'up' | 'down' | 'neutral') => {
    switch (type) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'trending-neutral';
    }
  };

  const formatValue = (value: string) => {
    if (value.startsWith('₹')) {
      const numericValue = Number(value.replace('₹', ''));
      return `₹${numericValue.toFixed(2)}`;
    }
    return value;
  };

  return (
    <Surface style={styles.container} elevation={1}>
      <View style={styles.header}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.value}>{formatValue(value)}</Text>
      
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}

      {trend && (
        <View style={styles.trendContainer}>
          <MaterialCommunityIcons 
            name={getTrendIcon(trend.type)} 
            size={16} 
            color={getTrendColor(trend.type)} 
          />
          <Text style={[styles.trendValue, { color: getTrendColor(trend.type) }]}>
            {trend.value}
          </Text>
        </View>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.surface,
    margin: spacing.sm,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.secondary,
  },
  value: {
    ...typography.headingLarge,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.secondary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  trendValue: {
    ...typography.bodySmall,
  },
}); 