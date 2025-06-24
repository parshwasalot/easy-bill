import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { colors, spacing, typography } from '../../constants/theme';
// Add crash reporting service - uncomment and install the package you prefer
// import * as Sentry from "@sentry/react-native";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to crash reporting service in production
    if (!__DEV__) {
      // Uncomment after setting up Sentry or similar service
      // Sentry.captureException(error);
      
      // Log to console in a production-safe way
      console.log('Production Error:', {
        error: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    } else {
      console.error('Development Error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Optional: Reload app in production
    if (!__DEV__ && Platform.OS === 'android') {
      // CodeBundle.reload();  // Uncomment if you want to reload the JS bundle
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong.</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Button 
            mode="contained" 
            onPress={this.handleReset}
            style={styles.button}
          >
            Try Again
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    ...typography.headingLarge,
    color: colors.error,
    marginBottom: spacing.md,
  },
  message: {
    ...typography.bodyLarge,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    minWidth: 200,
  },
});