import React, { ReactNode } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { colors } from '../../constants/theme';
import { useTheme } from 'react-native-paper';
import { CustomTheme } from '../../types/theme';
import { Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: ReactNode;
  style?: object;
}

export default function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  const theme = useTheme<CustomTheme>();
  
  return (
    <Surface style={[styles.surface, style]} elevation={0}>
      <SafeAreaView style={[styles.safe, style]} edges={['top']}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
        {children}
      </SafeAreaView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});