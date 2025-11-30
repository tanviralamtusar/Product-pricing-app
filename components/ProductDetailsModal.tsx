import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { X, Calculator, Trash2, Edit2 } from 'lucide-react-native';
import { Product } from '../types/product';
import { useProducts } from '../contexts/ProductContext';
import { useTheme } from '../contexts/ThemeContext';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
}: ProductDetailsModalProps) {
  const { deleteProduct, updateProduct } = useProducts();
  const { colors, theme } = useTheme();
  const [priceInput, setPriceInput] = useState<string>('');
  const [weightInput, setWeightInput] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(product.name);
  const [editedPrice, setEditedPrice] = useState<string>(product.pricePerKg.toString());

  const weightFromPrice = useMemo(() => {
    const price = parseFloat(priceInput);
    if (isNaN(price) || price <= 0) return 0;
    return (price / product.pricePerKg) * 1000;
  }, [priceInput, product.pricePerKg]);

  const priceFromWeight = useMemo(() => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) return 0;
    return (weight / 1000) * product.pricePerKg;
  }, [weightInput, product.pricePerKg]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProduct(product.id);
            onClose();
          },
        },
      ]
    );
  };

  const handleSaveEdit = () => {
    const newPrice = parseFloat(editedPrice);
    if (!editedName.trim()) {
      Alert.alert('Error', 'Product name cannot be empty');
      return;
    }
    if (isNaN(newPrice) || newPrice <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    updateProduct(product.id, {
      name: editedName.trim(),
      pricePerKg: newPrice,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(product.name);
    setEditedPrice(product.pricePerKg.toString());
    setIsEditing(false);
  };

  const quickCalculations = [
    { weight: 100, label: '100gm' },
    { weight: 250, label: '250gm' },
    { weight: 500, label: '500gm' },
    { weight: 1000, label: '1kg' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBackground, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          {isEditing ? (
            <>
              <TextInput
                style={[
                  styles.editNameInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.primary,
                  },
                ]}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Product name"
                placeholderTextColor={colors.placeholder}
              />
              <View style={styles.editPriceContainer}>
                <Text style={[styles.currencySymbol, { color: colors.primary }]}>৳</Text>
                <TextInput
                  style={[
                    styles.editPriceInput,
                    {
                      color: colors.primary,
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.primary,
                    },
                  ]}
                  value={editedPrice}
                  onChangeText={setEditedPrice}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors.placeholder}
                />
                <Text style={[styles.unitText, { color: colors.primary }]}>/kg</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.headerTitle, { color: colors.text }]}>{product.name}</Text>
              <Text style={[styles.headerSubtitle, { color: colors.primary }]}>৳{product.pricePerKg}/kg</Text>
            </>
          )}
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.calculatorSection}>
          <View style={styles.sectionHeader}>
            <Calculator size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Calculator</Text>
          </View>

          <View
            style={[
              styles.calculatorCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Enter Price (৳)</Text>
                <TextInput
                  style={[
                    styles.calcInput,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="0"
                  placeholderTextColor={colors.placeholder}
                  value={priceInput}
                  onChangeText={setPriceInput}
                  keyboardType="decimal-pad"
                />
              </View>
              <Text style={[styles.arrow, { color: colors.border }]}>→</Text>
              <View style={styles.resultContainer}>
                <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>Weight</Text>
                <Text
                  style={[
                    styles.resultValue,
                    {
                      color: colors.primary,
                      backgroundColor: theme === 'dark' ? '#1E3A8A' : '#EFF6FF',
                    },
                  ]}
                >
                  {weightFromPrice > 0 ? `${weightFromPrice.toFixed(2)}gm` : '-'}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.calculatorCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Enter Weight (gm)</Text>
                <TextInput
                  style={[
                    styles.calcInput,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="0"
                  placeholderTextColor={colors.placeholder}
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="decimal-pad"
                />
              </View>
              <Text style={[styles.arrow, { color: colors.border }]}>→</Text>
              <View style={styles.resultContainer}>
                <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>Price</Text>
                <Text
                  style={[
                    styles.resultValue,
                    {
                      color: colors.primary,
                      backgroundColor: theme === 'dark' ? '#1E3A8A' : '#EFF6FF',
                    },
                  ]}
                >
                  {priceFromWeight > 0 ? `৳${priceFromWeight.toFixed(2)}` : '-'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.quickCalcSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Calculate</Text>
          <View style={styles.quickGrid}>
            {quickCalculations.map((item) => {
              const price = (item.weight / 1000) * product.pricePerKg;
              return (
                <TouchableOpacity
                  key={item.weight}
                  style={[
                    styles.quickCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setWeightInput(item.weight.toString())}
                >
                  <Text style={[styles.quickWeight, { color: colors.textSecondary }]}>{item.label}</Text>
                  <Text style={[styles.quickPrice, { color: colors.primary }]}>৳{price.toFixed(2)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.headerBackground, borderTopColor: colors.border }]}>
        {isEditing ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.border }]}
              onPress={handleCancelEdit}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSaveEdit}
              activeOpacity={0.7}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.editButton,
                {
                  backgroundColor: theme === 'dark' ? '#1E3A8A' : '#EFF6FF',
                },
              ]}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.7}
            >
              <Edit2 size={20} color={colors.primary} />
              <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit Price</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                { backgroundColor: theme === 'dark' ? '#7F1D1D' : '#FEE2E2' },
              ]}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Trash2 size={20} color={colors.danger} />
              <Text style={[styles.deleteButtonText, { color: colors.danger }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  calculatorSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  calculatorCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 8,
    textTransform: 'uppercase' as const,
  },
  calcInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600' as const,
  },
  arrow: {
    fontSize: 24,
    marginTop: 20,
  },
  resultContainer: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 8,
    textTransform: 'uppercase' as const,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    overflow: 'hidden' as const,
  },
  quickCalcSection: {
    marginBottom: 24,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  quickCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickWeight: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  quickPrice: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  editNameInput: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  editPriceInput: {
    fontSize: 16,
    fontWeight: '600' as const,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 80,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
