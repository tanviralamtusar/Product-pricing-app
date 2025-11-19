import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,

} from 'react-native';
import { X, Calculator, Trash2 } from 'lucide-react-native';
import { Product } from '../types/product';
import { useProducts } from '../contexts/ProductContext';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
}: ProductDetailsModalProps) {
  const { deleteProduct } = useProducts();
  const [priceInput, setPriceInput] = useState<string>('');
  const [weightInput, setWeightInput] = useState<string>('');

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
    deleteProduct(product.id);
    onClose();
  };

  const quickCalculations = [
    { weight: 100, label: '100gm' },
    { weight: 250, label: '250gm' },
    { weight: 500, label: '500gm' },
    { weight: 1000, label: '1kg' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{product.name}</Text>
          <Text style={styles.headerSubtitle}>৳{product.pricePerKg}/kg</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.calculatorSection}>
          <View style={styles.sectionHeader}>
            <Calculator size={20} color="#4A90E2" />
            <Text style={styles.sectionTitle}>Price Calculator</Text>
          </View>

          <View style={styles.calculatorCard}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter Price (৳)</Text>
                <TextInput
                  style={styles.calcInput}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  value={priceInput}
                  onChangeText={setPriceInput}
                  keyboardType="decimal-pad"
                />
              </View>
              <Text style={styles.arrow}>→</Text>
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Weight</Text>
                <Text style={styles.resultValue}>
                  {weightFromPrice > 0 ? `${weightFromPrice.toFixed(2)}gm` : '-'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.calculatorCard}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter Weight (gm)</Text>
                <TextInput
                  style={styles.calcInput}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="decimal-pad"
                />
              </View>
              <Text style={styles.arrow}>→</Text>
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Price</Text>
                <Text style={styles.resultValue}>
                  {priceFromWeight > 0 ? `৳${priceFromWeight.toFixed(2)}` : '-'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.quickCalcSection}>
          <Text style={styles.sectionTitle}>Quick Calculate</Text>
          <View style={styles.quickGrid}>
            {quickCalculations.map((item) => {
              const price = (item.weight / 1000) * product.pricePerKg;
              return (
                <TouchableOpacity
                  key={item.weight}
                  style={styles.quickCard}
                  activeOpacity={0.7}
                  onPress={() => setWeightInput(item.weight.toString())}
                >
                  <Text style={styles.quickWeight}>{item.label}</Text>
                  <Text style={styles.quickPrice}>৳{price.toFixed(2)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Trash2 size={20} color="#EF4444" />
          <Text style={styles.deleteButtonText}>Delete Product</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#0F172A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#4A90E2',
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
    color: '#0F172A',
  },
  calculatorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase' as const,
  },
  calcInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#0F172A',
  },
  arrow: {
    fontSize: 24,
    color: '#CBD5E1',
    marginTop: 20,
  },
  resultContainer: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase' as const,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#4A90E2',
    backgroundColor: '#EFF6FF',
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
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  quickWeight: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#334155',
    marginBottom: 4,
  },
  quickPrice: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600' as const,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#EF4444',
  },
});
