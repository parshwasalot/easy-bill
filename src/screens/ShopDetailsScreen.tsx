import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useFirebase } from '../context/FirebaseContext';
import { ShopDetails } from '../types/database';
import ShopDetailsForm from '../components/shop/ShopDetailsForm';
import ScreenWrapper from '../components/Layout/ScreenWrapper';
import { colors, spacing } from '../constants/theme';

export default function ShopDetailsScreen() {
  const { shopService } = useFirebase();
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadShopDetails();
  }, []);

  const loadShopDetails = async () => {
    try {
      const details = await shopService.getShopDetails();
      setShopDetails(details);
    } catch (error) {
      console.error('Error loading shop details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: ShopDetails) => {
    try {
      setSaving(true);
      await shopService.updateShopDetails(values);
      setShopDetails(values);
    } catch (error) {
      console.error('Error saving shop details:', error);
    } finally {
      setSaving(false);
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
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <ShopDetailsForm
          initialValues={shopDetails || undefined}
          onSubmit={handleSubmit}
          isLoading={saving}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 