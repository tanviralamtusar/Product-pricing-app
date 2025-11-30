import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Search, Package, FileText, Moon, Sun } from 'lucide-react-native';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types/product';
import AddProductModal from '../components/AddProductModal';
import ProductDetailsModal from '../components/ProductDetailsModal';
import DueBillsModal from '../components/DueBillsModal';
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen() {
  const { filteredProducts, searchQuery, setSearchQuery } = useProducts();
  const { colors, theme, toggleTheme } = useTheme();
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dueBillsModalVisible, setDueBillsModalVisible] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[
        styles.productCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => setSelectedProduct(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.productIcon, { backgroundColor: theme === 'dark' ? '#1E3A8A' : '#EFF6FF' }]}>
        <Package size={24} color={colors.primary} />
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.productPrice, { color: colors.textSecondary }]}>৳{item.pricePerKg}/kg</Text>
      </View>
      <View style={[styles.productBadge, { backgroundColor: colors.badge }]}>
        <Text style={[styles.badgeText, { color: colors.badgeText }]}>৳{item.pricePerKg}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Package size={64} color={colors.icon} />
      <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No Products Yet</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Add your first product to get started
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.headerBackground}
      />
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 16,
            backgroundColor: colors.headerBackground,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Price Tracker</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={[
                styles.iconButton,
                { backgroundColor: colors.secondary, borderColor: colors.secondary },
              ]}
              onPress={() => setDueBillsModalVisible(true)}
            >
               <FileText size={20} color={colors.secondaryText} />
            </TouchableOpacity>

             <TouchableOpacity
              style={[
                styles.iconButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={toggleTheme}
            >
              {theme === 'dark' ? (
                 <Sun size={20} color={colors.text} />
              ) : (
                 <Moon size={20} color={colors.text} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Search size={20} color={colors.icon} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search products..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 32, backgroundColor: colors.primary }]}
        onPress={() => setAddModalVisible(true)}
        activeOpacity={0.8}
      >
        <Plus size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={addModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <AddProductModal onClose={() => setAddModalVisible(false)} />
      </Modal>

      <Modal
        visible={selectedProduct !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedProduct(null)}
      >
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </Modal>

      <Modal
        visible={dueBillsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDueBillsModalVisible(false)}
      >
        <DueBillsModal onClose={() => setDueBillsModalVisible(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
  },
  productBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
