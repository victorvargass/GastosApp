import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { ExpenseForm } from '@/components/forms';
import { ThemedView } from '@/components/themed-view';
import { useDatabase } from '@/contexts/DatabaseContext';

export default function ExpenseFormModal() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { expenses } = useDatabase();
  const navigation = useNavigation();

  const expense = id ? expenses.find((e) => e.id === Number(id)) : undefined;

  useEffect(() => {
    navigation.setOptions({
      title: expense ? 'Editar gasto' : 'Nuevo gasto',
    });
  }, [navigation, expense]);

  return (
    <ThemedView style={styles.container}>
      <ExpenseForm expense={expense} onSuccess={() => router.back()} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
