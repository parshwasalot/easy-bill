import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { colors, spacing, typography } from '../../constants/theme';

interface DataPoint {
  date: string;
  amount: number;
}

interface AnalyticsChartProps {
  data: DataPoint[];
  title: string;
}

export default function AnalyticsChart({ data, title }: AnalyticsChartProps) {
  const chartData = {
    labels: data.map(point => point.date),
    datasets: [{
      data: data.map(point => point.amount),
    }],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - (spacing.md * 2)}
        height={220}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => colors.primary,
          labelColor: (opacity = 1) => colors.secondary,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: colors.primary,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    margin: spacing.md,
  },
  title: {
    ...typography.headingSmall,
    marginBottom: spacing.md,
  },
  chart: {
    marginVertical: spacing.md,
    borderRadius: 16,
  },
}); 