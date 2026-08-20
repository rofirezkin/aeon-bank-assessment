import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { DashedRule, DetailRow } from '@/components/detail-row/detail-row';
import { ListErrorState } from '@/components/list-states/list-error-state';
import { ThemedText } from '@/components/themed-text';
import { Fonts, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useShareTransaction } from '@/hooks/use-share-transaction';
import { useTheme } from '@/hooks/use-theme';
import { useGetTransactionDetail } from '@/services/query/use-get-transaction-by-id';
import { formatCurrency, formatSignedCurrency } from '@/utils/format-currency';
import { formatDate, formatDateTime, formatTime } from '@/utils/format-date';
import { getTransactionDirection } from '@/utils/transaction-direction';

/** Half-circles punched out of the paper edge. */
const SCALLOP_COUNT = 18;

export default function TransactionDetailScreen() {
  const theme = useTheme();
  const { refId } = useLocalSearchParams<{ refId?: string }>();
  const { shareTransaction, isSharing, statusMessage } = useShareTransaction();

  const {
    data: transaction,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
  } = useGetTransactionDetail(refId ?? '');

  if (!refId) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ListErrorState
          title="Missing reference"
          description="This screen needs a transaction reference id to load."
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (isError || !transaction) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ListErrorState
          title="Transaction unavailable"
          description={error?.message ?? 'We could not load this transaction.'}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
      </View>
    );
  }

  const isIncoming = getTransactionDirection(transaction) === 'incoming';

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View
        style={[
          styles.receipt,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        <View style={styles.masthead}>
          <ThemedText style={[styles.mastheadTitle, { color: theme.textMuted }]}>
            AEON BANK · TRANSFER RECEIPT
          </ThemedText>
          <ThemedText style={[styles.docNumber, { color: theme.textSecondary }]}>
            NO. {transaction.refId}
          </ThemedText>
        </View>

        <DashedRule />

        <View style={styles.amountBlock}>
          <ThemedText style={[styles.amountLabel, { color: theme.textMuted }]}>
            {isIncoming ? 'MONEY IN' : 'MONEY OUT'}
          </ThemedText>
          <ThemedText
            style={[styles.amount, { color: isIncoming ? theme.credit : theme.text }]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {formatSignedCurrency(transaction.amount)}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {transaction.transferName}
          </ThemedText>
        </View>

        <DashedRule />

        <DetailRow label="Reference" value={transaction.refId} mono />
        <DetailRow label="Date" value={formatDate(transaction.transferDate)} />
        <DetailRow label="Time" value={formatTime(transaction.transferDate)} mono />
        <DetailRow
          label={isIncoming ? 'Sender' : 'Recipient'}
          value={transaction.recipientName}
        />
        <DetailRow label="Detail" value={transaction.transferName} />

        <DashedRule />

        <View style={styles.totalRow}>
          <ThemedText style={[styles.totalLabel, { color: theme.textMuted }]}>
            TOTAL
          </ThemedText>
          <ThemedText style={styles.totalValue}>
            {formatCurrency(transaction.amount)}
          </ThemedText>
        </View>

        <DashedRule />

        <View style={styles.stampRow}>
          <Ionicons name="checkmark-circle-outline" size={15} color={theme.credit} />
          <ThemedText style={[styles.stamp, { color: theme.credit }]}>
            SUCCESSFUL
          </ThemedText>
          <ThemedText type="small" themeColor="textMuted" style={styles.stampMeta}>
            {formatDateTime(transaction.transferDate)}
          </ThemedText>
        </View>

        {/* Paper tear along the bottom edge. */}
        <View style={styles.scallop} pointerEvents="none">
          {Array.from({ length: SCALLOP_COUNT }).map((_, index) => (
            <View
              key={index}
              style={[styles.scallopDot, { backgroundColor: theme.background }]}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Share transfer details"
        disabled={isSharing}
        onPress={() => shareTransaction(transaction)}
        style={[
          styles.shareButton,
          { backgroundColor: theme.primary },
          isSharing && styles.disabled,
        ]}>
        <Ionicons name="share-outline" size={18} color={theme.onPrimary} />
        <ThemedText style={[styles.shareLabel, { color: theme.onPrimary }]}>
          {isSharing ? 'Opening…' : 'Share receipt'}
        </ThemedText>
      </TouchableOpacity>

      {statusMessage && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.statusMessage}>
          {statusMessage}
        </ThemedText>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  receipt: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.two,
  },
  masthead: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  mastheadTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  docNumber: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
  },
  amountBlock: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  amountLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  amount: {
    fontFamily: Fonts.mono,
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 38,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  totalValue: {
    fontFamily: Fonts.mono,
    fontSize: 16,
    fontWeight: '700',
  },
  stampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingTop: Spacing.one,
  },
  stamp: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  stampMeta: {
    marginLeft: 'auto',
    fontSize: 11,
  },
  scallop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scallopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    height: 50,
    borderRadius: Radius.md,
  },
  disabled: {
    opacity: 0.6,
  },
  shareLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusMessage: {
    textAlign: 'center',
    marginTop: -Spacing.two,
  },
});
