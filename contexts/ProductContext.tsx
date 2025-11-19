import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import { Product } from '../types/product';

const STORAGE_KEY = 'products';

const fetchProducts = async (): Promise<Product[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

const saveProducts = async (products: Product[]): Promise<Product[]> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products;
  } catch (error) {
    console.error('Error saving products:', error);
    throw error;
  }
};

export const [ProductProvider, useProducts] = createContextHook(() => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const queryClient = useQueryClient();

  const productsQuery = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const saveMutation = useMutation<Product[], Error, Product[]>({
    mutationFn: saveProducts,
    onSuccess: (data) => {
      queryClient.setQueryData(['products'], data);
    },
  });

  const { mutate: mutateProducts } = saveMutation;

  const addProduct = useCallback(
    (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      const products = productsQuery.data || [];
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      mutateProducts([...products, newProduct]);
    },
    [productsQuery.data, mutateProducts]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
      const products = productsQuery.data || [];
      const updatedProducts = products.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
      );
      mutateProducts(updatedProducts);
    },
    [productsQuery.data, mutateProducts]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      const products = productsQuery.data || [];
      const filteredProducts = products.filter((p) => p.id !== id);
      mutateProducts(filteredProducts);
    },
    [productsQuery.data, mutateProducts]
  );

  const filteredProducts = useMemo(
    () =>
      (productsQuery.data || []).filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [productsQuery.data, searchQuery]
  );

  return useMemo(
    () => ({
      products: productsQuery.data || [],
      filteredProducts,
      isLoading: productsQuery.isLoading,
      addProduct,
      updateProduct,
      deleteProduct,
      searchQuery,
      setSearchQuery,
    }),
    [
      productsQuery.data,
      filteredProducts,
      productsQuery.isLoading,
      addProduct,
      updateProduct,
      deleteProduct,
      searchQuery,
      setSearchQuery,
    ]
  );
});
