import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/utils/firebase'; // Firebase with lazy Auth loading
import { FirebaseProvider } from './src/context/FirebaseContext';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/constants/theme';
import ErrorBoundary from './src/components/common/ErrorBoundary';

const combinedTheme = {
  ...MD3LightTheme,
  ...theme
};

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>        <PaperProvider theme={combinedTheme}>
          <FirebaseProvider>
            <AuthProvider>
              <NavigationContainer>
                <StatusBar style="auto" />
                <AppNavigator />
              </NavigationContainer>
            </AuthProvider>
          </FirebaseProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}