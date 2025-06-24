import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';

interface CustomShareSheetProps {
  visible: boolean;
  onClose: () => void;
  onShareWhatsApp: () => void;
  onShareOther: () => void;
}

export default function CustomShareSheet({ 
  visible, 
  onClose, 
  onShareWhatsApp,
  onShareOther 
}: CustomShareSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Surface style={styles.container}>
              <Text style={styles.title}>Share Bill</Text>
              
              <TouchableOpacity 
                style={styles.option} 
                onPress={onShareWhatsApp}
              >
                <MaterialCommunityIcons 
                  name="whatsapp" 
                  size={32} 
                  color="#25D366" 
                />
                <Text style={styles.optionText}>Share on WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.option} 
                onPress={onShareOther}
              >
                <MaterialCommunityIcons 
                  name="share-variant" 
                  size={32} 
                  color={colors.primary} 
                />
                <Text style={styles.optionText}>Other Options</Text>
              </TouchableOpacity>
            </Surface>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.lg,
  },
  title: {
    ...typography.headingMedium,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  optionText: {
    ...typography.bodyLarge,
  },
}); 