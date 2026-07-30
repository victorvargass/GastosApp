import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { CategoryChart } from '@/components/CategoryChart';
import { LimitProgressBar } from '@/components/LimitProgressBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatCLP, formatDate } from '@/lib/format';

type Props = {
  visible: boolean;
  period: any | null;
  onClose: () => void;
};

export function HistoricalPeriodModal({
  visible,
  period,
  onClose,
}: Props) {
  if (!period) return null;

  const expenses =
    period.categories?.reduce(
      (sum: number, item: any) => sum + item.total,
      0
    ) ?? 0;

  const incomes = period.incomesTotal ?? 0;
  const balance = incomes - expenses;
  const categories = period.categories ?? [];
  const limits = categories.filter(
    (item: any) => item.periodLimit && item.periodLimit > 0
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
  
            <ThemedText type="title" style={styles.headerTitle}>
              Resumen del período
            </ThemedText>
  
            <ThemedText style={styles.datesSummary}>
              {formatDate(new Date(`${period.startDate}T12:00:00`))} → {formatDate(new Date(`${period.endDate}T12:00:00`))}
            </ThemedText>
  
            <View style={styles.totalsContainer}>
              <ThemedView style={[styles.summaryCard, { flex: 1 }]}>
                <ThemedText style={styles.label}>
                  Ingresos
                </ThemedText>

                <ThemedText style={styles.income}>
                  {formatCLP(incomes)}
                </ThemedText>
              </ThemedView>

              <ThemedView style={[styles.summaryCard, { flex: 1 }]}>
                <ThemedText style={styles.label}>
                  Gastos
                </ThemedText>

                <ThemedText style={styles.expense}>
                  {formatCLP(expenses)}
                </ThemedText>
              </ThemedView>
            </View>


            <ThemedView style={styles.balanceCard}>
              <ThemedText style={styles.label}>
                Saldo
              </ThemedText>

              <ThemedText
                style={balance >= 0 ? styles.positive : styles.negative}
              >
                {formatCLP(balance)}
              </ThemedText>
            </ThemedView>
  
  
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle">
                Gastos por categoría
              </ThemedText>
  
              <CategoryChart
                periodCategoryExpensesTotals={categories}
                periodExpensesTotal={expenses}
              />
            </ThemedView>
  
  
            {limits.length > 0 && (
              <ThemedView style={styles.section}>
                <ThemedText type="subtitle">
                  Límites
                </ThemedText>
  
                <View style={styles.limitList}>
                  {limits.map((item: any) => (
                    <LimitProgressBar
                      key={item.categoryId}
                      name={item.categoryName}
                      color={item.categoryColor}
                      spent={item.total}
                      limit={item.periodLimit}
                    />
                  ))}
                </View>
              </ThemedView>
            )}
  
  
            <Pressable
              style={styles.close}
              onPress={onClose}
            >
              <ThemedText style={styles.closeText}>
                Cerrar
              </ThemedText>
            </Pressable>
  
          </ScrollView>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 16,
  },

  container: {
    maxHeight: '88%',
    borderRadius: 18,
    padding: 16,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },

  datesSummary: {
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    fontSize: 14,
    color: '#888',
  },

  summaryBox: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#fbfcfd',
    marginBottom: 14,
  },

  summaryItem: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 6,
  },

  income: {
    fontSize: 22,
    fontWeight: '700',
    color: '#008000',
  },

  expense: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e44332',
  },

  positive: {
    fontSize: 22,
    fontWeight: '700',
    color: '#006080',
  },

  negative: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e44332',
  },

  section: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#fbfcfd',
    marginBottom: 12,
    gap: 10,
  },

  limitList: {
    gap: 12,
  },

  close: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  closeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#006080',
  },
  totalsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  
  summaryCard: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#fbfcfd',
  },
  
  balanceCard: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fbfcfd',
    marginBottom: 14,
  },
  
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});