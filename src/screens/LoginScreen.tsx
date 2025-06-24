import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../constants/theme';

export default function LoginScreen() {
  const { signIn, signUp, tryAutoSignIn } = useAuth();
  const [email, setEmail] = useState('owner@udaysaree.com');
  const [password, setPassword] = useState('UdaySaree2024');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  // Try auto sign-in when component loads - DISABLED FOR TESTING
  useEffect(() => {
    // Temporarily disable auto sign-in to test manual login
    setLoading(false);
    console.log('Auto sign-in disabled for testing');
  }, []);
  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
    } catch (err: any) {      // If user doesn't exist, try to create the account
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          // Try to create the user account
          await signUp(email, password);
          setError('Account created and logged in successfully!');
        } catch (signUpError: any) {
          setError(`Failed to create account: ${signUpError.message}`);
          console.error('Account creation failed:', signUpError);
        }
      } else {
        setError('Failed to sign in. Please check your credentials.');
        console.error('Login error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
      />
      
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  input: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.md,
  },
  error: {
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
});