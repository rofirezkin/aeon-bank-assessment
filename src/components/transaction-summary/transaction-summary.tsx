import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { usePreferenceStore } from '@/store/use-preference-store';
import { formatCurrency } from '@/utils/format-currency';
import type { T_TransactionSummary } from '@/utils/transaction-list';

const HIDDEN_PLACEHOLDER = 'RM ••••••';

type TransactionSummaryCardProps = {
  summary: T_TransactionSummary;
};

export function TransactionSummaryCard({ summary }: TransactionSummaryCardProps) {
  const theme = useTheme();
  const areAmountsHidden = usePreferenceStore((state) => state.areAmountsHidden);
  const toggleAmountsHidden = usePreferenceStore((state) => state.toggleAmountsHidden);

  const renderAmount = (amount: number) =>
    areAmountsHidden ? HIDDEN_PLACEHOLDER : formatCurrency(amount);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}>
      <View style={styles.header}>
        <ThemedText type="small" themeColor="textSecondary">
          {summary.count} {summary.count === 1 ? 'transaction' : 'transactions'}
        </ThemedText>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={areAmountsHidden ? 'Show amounts' : 'Hide amounts'}
          hitSlop={12}
          onPress={toggleAmountsHidden}>
          <Ionicons
            name={areAmountsHidden ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.totals}>
        <View style={styles.total}>
          <ThemedText type="small" themeColor="textSecondary">
            Money in
          </ThemedText>
          <ThemedText style={[styles.amount, { color: theme.credit }]} numberOfLines={1}>
            {renderAmount(summary.totalIn)}
          </ThemedText>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.total}>
          <ThemedText type="small" themeColor="textSecondary">
            Money out
          </ThemedText>
          <ThemedText style={styles.amount} numberOfLines={1}>
            {renderAmount(summary.totalOut)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totals: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  total: {
    flex: 1,
    gap: Spacing.half,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: Spacing.three,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
});
