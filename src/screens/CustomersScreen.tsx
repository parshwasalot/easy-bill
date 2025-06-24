import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFirebase } from '../context/FirebaseContext';
import { Customer } from '../types/database';
import CustomerCard from '../components/customer/CustomerCard';
import SearchBar from '../components/customer/SearchBar';
import ScreenWrapper from '../components/Layout/ScreenWrapper';
import { colors, spacing, typography } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function CustomersScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { customerService } = useFirebase();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCustomers = async () => {
    try {
      const data = await customerService.getCustomers();
      // Sort alphabetically
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
      setCustomers(sortedData);
      setFilteredCustomers(sortedData);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone.includes(query)
      );
      setFilteredCustomers(filtered);
    }
  }, [customers]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadCustomers();
  };

  const handleCustomerPress = (customer: Customer) => {
    navigation.navigate('CustomerHistory', { customer });
  };

  if (loading) {
    return (
      <ScreenWrapper style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SearchBar
        searchQuery={searchQuery}
        onChangeSearch={handleSearch}
      />

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.phone}
        renderItem={({ item }) => (
          <CustomerCard
            customer={item}
            onPress={handleCustomerPress}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No customers found
            </Text>
          </View>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.bodyLarge,
    color: colors.disabled,
  },
}); 