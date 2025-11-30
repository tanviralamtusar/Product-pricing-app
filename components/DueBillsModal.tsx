import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { X, Plus, Trash2, FileText, Pencil } from 'lucide-react-native';
import { useDueBills } from '../contexts/DueBillContext';
import { DueBill } from '../types/dueBill';
import { useTheme } from '../contexts/ThemeContext';

interface DueBillsModalProps {
  onClose: () => void;
}

export default function DueBillsModal({ onClose }: DueBillsModalProps) {
  const { dueBills, addDueBill, updateDueBill, deleteDueBill } = useDueBills();
  const { colors, theme } = useTheme();
  const [name, setName] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }
    if (!note.trim()) {
      Alert.alert('Error', 'Please enter a note');
      return;
    }

    if (editingId) {
      updateDueBill(editingId, { name: name.trim(), note: note.trim() });
    } else {
      addDueBill({ name: name.trim(), note: note.trim() });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setNote('');
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleEdit = (item: DueBill) => {
    setName(item.name);
    setNote(item.note);
    setEditingId(item.id);
    setIsAddingNew(true);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Note', `Delete note for "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteDueBill(id),
      },
    ]);
  };

  const renderDueBill = ({ item }: { item: DueBill }) => (
    <View style={[styles.dueBillCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.dueBillIcon, { backgroundColor: colors.secondary }]}>
        <FileText size={20} color={colors.secondaryText} />
      </View>
      <View style={styles.dueBillContent}>
        <Text style={[styles.dueBillName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.dueBillNote, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.note}
        </Text>
        <Text style={[styles.dueBillDate, { color: colors.textSecondary }]}>
          {new Date(item.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={styles.actionButton}
        >
          <Pencil size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id, item.name)}
          style={styles.actionButton}
        >
          <Trash2 size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <FileText size={64} color={colors.icon} />
      <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No Due Bills</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Add notes for customers with pending payments
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBackground, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Due Bills</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{dueBills.length} notes</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {isAddingNew ? (
        <View style={[styles.addForm, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Customer Name</Text>
            <TextInput
              style={[
                styles.nameInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter customer name"
              placeholderTextColor={colors.placeholder}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Note</Text>
            <TextInput
              style={[
                styles.noteInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter note about due payment..."
              placeholderTextColor={colors.placeholder}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={[styles.cancelFormButton, { backgroundColor: colors.border }]}
              onPress={resetForm}
            >
              <Text style={[styles.cancelFormButtonText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveFormButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={styles.saveFormButtonText}>{editingId ? 'Update' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor: theme === 'dark' ? '#1E3A8A' : '#EFF6FF',
              borderColor: theme === 'dark' ? '#1D4ED8' : '#BFDBFE',
            },
          ]}
          onPress={() => setIsAddingNew(true)}
        >
          <Plus size={20} color={colors.primary} />
          <Text style={[styles.addButtonText, { color: colors.primary }]}>Add Due Bill Note</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={dueBills}
        renderItem={renderDueBill}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
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
    fontSize: 14,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  addForm: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelFormButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelFormButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  saveFormButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveFormButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  dueBillCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  dueBillIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dueBillContent: {
    flex: 1,
  },
  dueBillName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  dueBillNote: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  dueBillDate: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 4,
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
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
