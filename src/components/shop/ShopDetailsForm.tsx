import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ShopDetails } from '../../types/database';
import { colors, spacing } from '../../constants/theme';

interface ShopDetailsFormProps {
  initialValues?: ShopDetails;
  onSubmit: (values: ShopDetails) => Promise<void>;
  isLoading: boolean;
}

export default function ShopDetailsForm({ initialValues, onSubmit, isLoading }: ShopDetailsFormProps) {
  const [formData, setFormData] = useState<ShopDetails>({
    id: initialValues?.id || 'details',
    name: initialValues?.name || '',
    address: initialValues?.address || '',
    phone: initialValues?.phone || '',
    gst: initialValues?.gst || '',
    logo: initialValues?.logo || '',
    upiId: initialValues?.upiId || '',
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setFormData(prev => ({ ...prev, logo: base64Image }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    await onSubmit(formData);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.logoContainer}>
        {formData.logo ? (
          <Image source={{ uri: formData.logo }} style={styles.logo} />
        ) : (
          <View style={styles.placeholderLogo}>
            <MaterialCommunityIcons name="camera" size={40} color={colors.primary} />
          </View>
        )}
        <Text style={styles.imageLabel}>Shop Logo</Text>
      </TouchableOpacity>

      <TextInput
        label="Shop Name *"
        value={formData.name}
        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Address *"
        value={formData.address}
        onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
      />

      <TextInput
        label="Phone Number *"
        value={formData.phone}
        onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
        style={styles.input}
        mode="outlined"
        keyboardType="phone-pad"
      />

      <TextInput
        label="GST Number"
        value={formData.gst}
        onChangeText={(text) => setFormData(prev => ({ ...prev, gst: text }))}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="UPI ID"
        value={formData.upiId}
        onChangeText={(text) => setFormData(prev => ({ ...prev, upiId: text }))}
        mode="outlined"
        style={styles.input}
        placeholder="yourname@bankname"
      />

      <Button 
        mode="contained" 
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      >
        Save Details
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  input: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.md,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    width: '100%',
  },
  imageLabel: {
    marginTop: spacing.sm,
    textAlign: 'center',
    color: colors.text,
  },
}); 