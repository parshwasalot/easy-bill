import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { TextInput, Button, Divider, Text, List } from 'react-native-paper';
import { Bill, Product, Customer, ShopDetails } from '../../types/database';
import { useFirebase } from '../../context/FirebaseContext';
import ProductItem from './ProductItem';
import { colors, spacing, typography } from '../../constants/theme';
import { generateUPILink } from '../../utils/upiHelpers';
import QRCode from 'react-native-qrcode-svg';
import DateTimePicker from '@react-native-community/datetimepicker';

interface BillingFormProps {
  onSubmit: (bill: Omit<Bill, 'id' | 'billNumber' | 'date' | 'pdfUrl'> & { selectedDate: Date }) => Promise<void>;
  isLoading: boolean;
  initialValues?: Bill;
  isEditing?: boolean;
}

export default function BillingForm({ onSubmit, isLoading, initialValues, isEditing = false }: BillingFormProps) {
  const { customerService, shopService } = useFirebase();
  const [customerName, setCustomerName] = useState(initialValues?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(initialValues?.customerPhone || '');
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialValues?.date instanceof Date 
      ? initialValues.date 
      : initialValues?.date?.toDate?.() || new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [products, setProducts] = useState<Product[]>(
    initialValues?.items || [{ id: '1', name: 'Saree', price: 0, quantity: 1 }]
  );
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI'>(initialValues?.paymentMode || 'CASH');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [isLoadingShopDetails, setIsLoadingShopDetails] = useState(true);

  useEffect(() => {
    const loadShopDetails = async () => {
      try {
        setIsLoadingShopDetails(true);
        const details = await shopService.getShopDetails();
        console.log('Loaded shop details:', details); // Debug log
        setShopDetails(details);
      } catch (error) {
        console.error('Error loading shop details:', error);
        Alert.alert('Error', 'Failed to load shop details');
      } finally {
        setIsLoadingShopDetails(false);
      }
    };
    loadShopDetails();
  }, []);

  const handlePhoneChange = async (text: string) => {
    setCustomerPhone(text);
    
    if (text.length >= 3) {
      try {
        // Search for customers with matching phone numbers
        const customers = await customerService.getCustomers();
        const filtered = customers.filter(customer => 
          customer.phone.includes(text)
        );
        setSearchResults(filtered);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching customers:', error);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setShowResults(false);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: (products.length + 1).toString(),
        name: 'Saree',
        price: 0,
        quantity: 1,
      },
    ]);
  };

  const handleUpdateProduct = (index: number, updatedProduct: Product) => {
    const newProducts = [...products];
    newProducts[index] = updatedProduct;
    setProducts(newProducts);
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  };

  const handleSubmit = async () => {
    if (!customerName || !customerPhone || products.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const billData = {
      customerName,
      customerPhone,
      items: products,
      totalAmount: calculateTotal(),
      paymentMode,
      urlHash: initialValues?.urlHash || '', 
      selectedDate, // Pass the selected date to the parent component
    };

    await onSubmit(billData);
    
    // Reset form if not editing
    if (!isEditing) {
      setCustomerName('');
      setCustomerPhone('');
      setProducts([{ id: '1', name: 'Saree', price: 0, quantity: 1 }]);
      setPaymentMode('CASH');
      setSelectedDate(new Date());
    }
  };

  const handleUPISelect = () => {
    if (isLoadingShopDetails) {
      Alert.alert('Please wait', 'Loading shop details...');
      return;
    }

    if (!shopDetails?.upiId) {
      console.log('Shop details UPI check:', shopDetails); // Debug log
      Alert.alert('Error', 'Shop UPI ID not configured. Please set it in Shop Details.');
      setPaymentMode('CASH');
      return;
    }

    setPaymentMode('UPI');
    setShowUPIModal(true);
  };

  const handleCashSelect = () => {
    setPaymentMode('CASH');
  };

  const UPIModal = () => {
    const [qrError, setQrError] = useState<string | null>(null);
    const [qrValue, setQrValue] = useState<string>('');

    useEffect(() => {
      if (showUPIModal) {
        try {
          if (!shopDetails?.upiId) {
            throw new Error('Shop UPI ID not found');
          }
          const upiLink = generateUPILink(
            shopDetails.upiId,
            shopDetails.name || 'Shop',
            calculateTotal(),
            `Bill Payment`
          );
          setQrValue(upiLink);
          setQrError(null);
        } catch (error) {
          console.error('QR generation error:', error);
          setQrError(error instanceof Error ? error.message : 'Failed to generate QR code');
          setShowUPIModal(false);
        }
      }
    }, [showUPIModal, shopDetails, calculateTotal]);

    if (!showUPIModal) return null;

    return (
      <Modal
        visible={true}
        onRequestClose={() => {
          setShowUPIModal(false);
          setQrError(null);
        }}
        transparent
        animationType="fade"
      >
        <TouchableOpacity 
          style={styles.modalContainer} 
          activeOpacity={1}
          onPress={() => setShowUPIModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.qrWrapper}>
              {qrError ? (
                <Text style={styles.errorText}>{qrError}</Text>
              ) : qrValue ? (
                <QRCode
                  value={qrValue}
                  size={200}
                  backgroundColor="white"
                  color="black"
                  onError={(error: any) => {
                    console.error('QR render error:', error);
                    setQrError('Failed to render QR code');
                  }}
                />
              ) : (
                <Text>Loading...</Text>
              )}
            </View>
            <Button
              mode="contained"
              onPress={() => {
                setQrError(null);
                setShowUPIModal(false);
              }}
              style={styles.closeButton}
            >
              Close
            </Button>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const BUTTON_COLORS = {
    green: '#146C2E',
    red: '#D32F2F'
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Customer Phone *"
        value={customerPhone}
        onChangeText={handlePhoneChange}
        keyboardType="phone-pad"
        style={styles.input}
        mode="outlined"
      />

      {showResults && searchResults.length > 0 && (
        <View style={styles.searchResults}>
          {searchResults.map((customer) => (
            <List.Item
              key={customer.phone}
              title={customer.name}
              description={customer.phone}
              onPress={() => handleCustomerSelect(customer)}
              style={styles.searchResultItem}
            />
          ))}
        </View>
      )}

      <TextInput
        label="Customer Name *"
        value={customerName}
        onChangeText={setCustomerName}
        style={styles.input}
        mode="outlined"
      />

      <Button 
        mode="outlined" 
        onPress={() => setShowDatePicker(true)}
        style={styles.datePickerButton}
      >
        Bill Date: {selectedDate.toLocaleDateString()}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <Divider style={styles.divider} />

      <Text style={styles.sectionTitle}>Products</Text>
      {products.map((product, index) => (
        <ProductItem
          key={product.id}
          product={product}
          index={index}
          onUpdate={handleUpdateProduct}
          onRemove={handleRemoveProduct}
        />
      ))}

      <Button
        mode="outlined"
        onPress={handleAddProduct}
        style={styles.addButton}
        icon="plus"
      >
        Add Product
      </Button>

      <Divider style={styles.divider} />

      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Payment Mode</Text>
        <View style={styles.paymentButtons}>
          <Button
            mode="contained"
            onPress={handleCashSelect}
            style={[
              styles.paymentButton,
              { 
                backgroundColor: paymentMode === 'CASH' 
                  ? BUTTON_COLORS.green 
                  : BUTTON_COLORS.red
              }
            ]}
            labelStyle={{ color: '#FFFFFF' }}
          >
            Cash
          </Button>
          <Button
            mode="contained"
            onPress={handleUPISelect}
            style={[
              styles.paymentButton,
              { 
                backgroundColor: paymentMode === 'UPI' 
                  ? BUTTON_COLORS.green 
                  : BUTTON_COLORS.red
              }
            ]}
            labelStyle={{ color: '#FFFFFF' }}
          >
            UPI
          </Button>
        </View>
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalAmount}>₹{calculateTotal()}</Text>
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        style={styles.submitButton}
      >
        {isEditing ? 'Update Bill' : 'Generate Bill'}
      </Button>

      <UPIModal />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  divider: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.headingSmall,
    marginBottom: spacing.md,
  },
  addButton: {
    marginTop: spacing.sm,
  },
  paymentSection: {
    marginBottom: spacing.lg,
  },
  paymentButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  paymentButton: {
    flex: 1,
  },
  buttonLabel: {
    fontWeight: 'bold',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  totalLabel: {
    ...typography.headingSmall,
  },
  totalAmount: {
    ...typography.headingMedium,
    color: colors.primary,
  },
  submitButton: {
    marginBottom: spacing.xl,
  },
  searchResults: {
    maxHeight: 200,
    backgroundColor: colors.surface,
    borderRadius: 4,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchResultItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
    elevation: 5, // Added for Android shadow
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  closeButton: {
    marginTop: 10,
    width: '100%',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  datePickerButton: {
    marginBottom: spacing.md,
  },
});

const BUTTON_COLORS = {
  darkGreen: '#146C2E',
  lightGreen: '#A5D6A7',
  lightRed: '#EF9A9A'
};
