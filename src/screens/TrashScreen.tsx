import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { ActivityIndicator, Text, Searchbar } from 'react-native-paper';
import { useFirebase } from '../context/FirebaseContext';
import ScreenWrapper from '../components/Layout/ScreenWrapper';
import PurchaseHistoryItem from '../components/customer/PurchaseHistoryItem';
import { colors, spacing } from '../constants/theme';
import { Bill } from '../types/database';
import { useNavigation } from '@react-navigation/native';

export default function TrashScreen() {
  const { billService } = useFirebase();
  const [trashedBills, setTrashedBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadTrashedBills();
  }, []);

  useEffect(() => {
    filterBills();
  }, [searchQuery, trashedBills]);

  const filterBills = () => {
    const query = searchQuery.toLowerCase().trim();
    const filtered = trashedBills.filter(bill => 
      bill.id.toLowerCase().includes(query)
    );
    setFilteredBills(filtered);
  };

  const loadTrashedBills = async () => {
    try {
      setLoading(true);
      const bills = await billService.getTrashBills();
      setTrashedBills(bills);
      setFilteredBills(bills);
    } catch (error) {
      console.error('Error loading trashed bills:', error);
      Alert.alert('Error', 'Failed to load trashed bills');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrashedBills();
    setRefreshing(false);
  };

  const handleBillPress = (bill: Bill) => {
    Alert.alert(
      'Restore Bill',
      'Do you want to restore this bill?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore', 
          onPress: () => handleRestore(bill)
        }
      ]
    );
  };

  const handleRestore = async (bill: Bill) => {
    try {
      await billService.restoreBillFromTrash(bill.id);
      setTrashedBills(trashedBills.filter(b => b.id !== bill.id));
      Alert.alert('Success', 'Bill has been restored');
    } catch (error) {
      console.error('Error restoring bill:', error);
      Alert.alert('Error', 'Failed to restore bill');
    }
  };

  const handleEditBill = (bill: Bill) => {
    navigation.navigate('EditBill', { bill });
  };

  const handleDeletePermanently = async (bill: Bill) => {
    try {
      await billService.deleteBillFromTrash(bill.id);
      setTrashedBills(trashedBills.filter(b => b.id !== bill.id));
      Alert.alert('Success', 'Bill has been permanently deleted');
    } catch (error) {
      console.error('Error deleting bill:', error);
      Alert.alert('Error', 'Failed to delete bill');
    }
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
      <Searchbar
        placeholder="Search by bill number"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredBills}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <PurchaseHistoryItem
            bill={item}
            onPress={() => handleBillPress(item)}
            onDelete={handleDeletePermanently}
            isTrash={true}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No bills found matching your search' : 'No bills in trash'}
            </Text>
          </View>
        }
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
  searchBar: {
    margin: spacing.md,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.disabled,
  },
}); 