import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Product } from '../../types/database';

interface ProductItemProps {
  product: Product;
  index: number;
  onUpdate: (index: number, product: Product) => void;
  onRemove: (index: number) => void;
}

const PRODUCT_TYPES = ['Saree', 'Dress', 'Suit-Piece'] as const;

export default function ProductItem({ product, index, onUpdate, onRemove }: ProductItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={product.name}
            onValueChange={(value) => 
              onUpdate(index, { ...product, name: value as Product['name'] })
            }
            style={styles.picker}
          >
            {PRODUCT_TYPES.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>
        <IconButton
          icon="delete"
          mode="outlined"
          onPress={() => onRemove(index)}
          style={styles.deleteButton}
        />
      </View>
      
      <TextInput
        label="Description (Optional)"
        value={product.customName || ''}
        onChangeText={(text) => 
          onUpdate(index, { ...product, customName: text })
        }
        placeholder="e.g., Color, Design, etc."
        style={styles.customNameInput}
        mode="outlined"
      />
      
      <View style={styles.row}>
        <TextInput
          label="Price"
          value={product.price.toString()}
          onChangeText={(text) => {
            const price = parseFloat(text) || 0;
            onUpdate(index, { ...product, price });
          }}
          keyboardType="numeric"
          style={styles.priceInput}
          mode="outlined"
        />
        
        <TextInput
          label="Quantity"
          value={product.quantity.toString()}
          onChangeText={(text) => {
            const quantity = parseInt(text) || 0;
            onUpdate(index, { ...product, quantity });
          }}
          keyboardType="numeric"
          style={styles.quantityInput}
          mode="outlined"
        />
        
        <TextInput
          label="Total"
          value={(product.price * product.quantity).toString()}
          editable={false}
          style={styles.totalInput}
          mode="outlined"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 8,
  },
  picker: {
    height: 50,
  },
  deleteButton: {
    margin: 0,
  },
  customNameInput: {
    marginBottom: 8,
  },
  priceInput: {
    flex: 1,
    marginRight: 8,
  },
  quantityInput: {
    flex: 1,
    marginRight: 8,
  },
  totalInput: {
    flex: 1,
  },
}); 