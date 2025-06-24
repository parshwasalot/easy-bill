import { MD3Theme } from 'react-native-paper';

export interface CustomTheme extends MD3Theme {
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  }
}

declare module 'react-native-paper' {
  export interface MD3Theme extends CustomTheme {}
} 