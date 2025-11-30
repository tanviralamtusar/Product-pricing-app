import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { DueBill } from '../types/dueBill';

const STORAGE_KEY = 'dueBills';

const fetchDueBills = async (): Promise<DueBill[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error fetching due bills:', error);
    return [];
  }
};

const saveDueBills = async (dueBills: DueBill[]): Promise<DueBill[]> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dueBills));
    return dueBills;
  } catch (error) {
    console.error('Error saving due bills:', error);
    throw error;
  }
};

export const [DueBillProvider, useDueBills] = createContextHook(() => {
  const queryClient = useQueryClient();

  const dueBillsQuery = useQuery<DueBill[]>({
    queryKey: ['dueBills'],
    queryFn: fetchDueBills,
  });

  const saveMutation = useMutation<DueBill[], Error, DueBill[]>({
    mutationFn: saveDueBills,
    onSuccess: (data) => {
      queryClient.setQueryData(['dueBills'], data);
    },
  });

  const { mutate: mutateDueBills } = saveMutation;

  const addDueBill = useCallback(
    (dueBill: Omit<DueBill, 'id' | 'createdAt' | 'updatedAt'>) => {
      const dueBills = dueBillsQuery.data || [];
      const newDueBill: DueBill = {
        ...dueBill,
        id: Date.now().toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      mutateDueBills([...dueBills, newDueBill]);
    },
    [dueBillsQuery.data, mutateDueBills]
  );

  const updateDueBill = useCallback(
    (id: string, updates: Partial<Omit<DueBill, 'id' | 'createdAt'>>) => {
      const dueBills = dueBillsQuery.data || [];
      const updatedDueBills = dueBills.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: Date.now() } : d
      );
      mutateDueBills(updatedDueBills);
    },
    [dueBillsQuery.data, mutateDueBills]
  );

  const deleteDueBill = useCallback(
    (id: string) => {
      const dueBills = dueBillsQuery.data || [];
      const filteredDueBills = dueBills.filter((d) => d.id !== id);
      mutateDueBills(filteredDueBills);
    },
    [dueBillsQuery.data, mutateDueBills]
  );

  return useMemo(
    () => ({
      dueBills: dueBillsQuery.data || [],
      isLoading: dueBillsQuery.isLoading,
      addDueBill,
      updateDueBill,
      deleteDueBill,
    }),
    [
      dueBillsQuery.data,
      dueBillsQuery.isLoading,
      addDueBill,
      updateDueBill,
      deleteDueBill,
    ]
  );
});
