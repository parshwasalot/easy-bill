import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { TextStyle } from 'react-native';

export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  error: '#FF3B30',
  success: '#146C2E',
  text: '#000000',
  disabled: '#8E8E93',
  placeholder: '#1C1B1F99',
  border: '#E0E0E0',
  darkGreen: '#2E7D32',
  lightGreen: '#A5D6A7',
  darkRed: '#C62828',
  lightRed: '#EF9A9A',
  cashSelected: '#2E7D32',
  cashUnselected: '#C8E6C9',
  upiSelected: '#C62828',
  upiUnselected: '#FFCDD2',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const baseTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    disabled: colors.disabled,
    placeholder: colors.placeholder,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    onSurface: colors.text,
  },
};

export const theme = {
  ...baseTheme,
  spacing,
};

export const typography: Record<string, TextStyle> = {
  headingSmall: {
    fontSize: 16,
    fontWeight: '600',
  },
  headingMedium: {
    fontSize: 18,
    fontWeight: '700',
  },
  headingLarge: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  bodyMedium: {
    fontSize: 14,
  },
  bodySmall: {
    fontSize: 12,
  },
};