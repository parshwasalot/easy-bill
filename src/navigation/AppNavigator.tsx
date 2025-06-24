import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import BillHistoryScreen from '../screens/BillHistoryScreen';
import CustomerHistoryScreen from '../screens/CustomerHistoryScreen';
import EditBillScreen from '../screens/EditBillScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen 
            name="BillHistory" 
            component={BillHistoryScreen}
            options={{
              headerShown: true,
              title: 'Bill History'
            }}
          />
          <Stack.Screen 
            name="CustomerHistory" 
            component={CustomerHistoryScreen}
            options={{
              headerShown: true,
              title: 'Customer History'
            }}
          />
          <Stack.Screen 
            name="EditBill" 
            component={EditBillScreen}
            options={{
              title: 'Edit Bill',
              headerShown: true,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}