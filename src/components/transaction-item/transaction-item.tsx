import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { T_Transaction } from '@/types/transaction';
import { formatSignedCurrency } from '@/utils/format-currency';
import { formatTime } from '@/utils/format-date';
import { getTransactionDirection } from '@/utils/transaction-direction';

type TransactionItemProps = {
  transaction: T_Transaction;
};

function TransactionItemComponent({ transaction }: TransactionItemProps) {
  const theme = useTheme();

  const { refId, transferName, recipientName, transferDate, amount } = transaction;
  const direction = getTransactionDirection(transaction);
  const isIncoming = direction === 'incoming';

  const openDetail = () => {
    Haptics.selectionAsync().catch(() => {
    });

    router.push({ pathname: '/transaction-detail', params: { refId } });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${transferName}, ${recipientName}, ${formatSignedCurrency(amount)}`}
      accessibilityHint="Opens the transaction details"
      onPress={openDetail}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.icon, { backgroundColor: theme.backgroundSelected }]}>
        <Ionicons
          name={isIncoming ? 'arrow-down' : 'arrow-up'}
          size={18}
          color={isIncoming ? theme.credit : theme.textSecondary}
        />
      </View>

      <View style={styles.details}>
        <ThemedText style={styles.transferName} numberOfLines={1}>
          {transferName}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {recipientName}
        </ThemedText>
      </View>

      <View style={styles.trailing}>
        <ThemedText
          style={[styles.amount, { color: isIncoming ? theme.credit : theme.debit }]}
          numberOfLines={1}>
          {formatSignedCurrency(amount)}
        </ThemedText>
        <ThemedText type="small" themeColor="textMuted" numberOfLines={1}>
          {formatTime(transferDate)}
        </ThemedText>
      </View>
    </Pressable>
  );
}

/** Rows are pure — memoising keeps long lists cheap to re-render while filtering. */
export const TransactionItem = memo(TransactionItemComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.6,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    gap: Spacing.half,
  },
  trailing: {
    flexShrink: 0,
    alignItems: 'flex-end',
    gap: Spacing.half,
  },
  transferName: {
    fontSize: 16,
    fontWeight: '600',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
});
