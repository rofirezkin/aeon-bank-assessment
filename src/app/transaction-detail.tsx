import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { DetailRow } from "@/components/detail-row/detail-row";
import { ListErrorState } from "@/components/list-states/list-error-state";
import { ThemedText } from "@/components/themed-text";
import { MaxContentWidth, Radius, Spacing } from "@/constants/theme";
import { useShareTransaction } from "@/hooks/use-share-transaction";
import { useTheme } from "@/hooks/use-theme";
import { useGetTransactionDetail } from "@/services/query/use-get-transaction-by-id";
import { formatCurrency, formatSignedCurrency } from "@/utils/format-currency";
import { formatDateTime } from "@/utils/format-date";
import { getTransactionDirection } from "@/utils/transaction-direction";

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
  } = useGetTransactionDetail(refId ?? "");

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
          description={error?.message ?? "We could not load this transaction."}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
      </View>
    );
  }

  const isIncoming = getTransactionDirection(transaction) === "incoming";

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View
          style={[
            styles.heroIcon,
            { backgroundColor: theme.backgroundSelected },
          ]}
        >
          <Ionicons
            name={isIncoming ? "arrow-down" : "arrow-up"}
            size={26}
            color={isIncoming ? theme.credit : theme.textSecondary}
          />
        </View>

        <ThemedText
          style={[
            styles.heroAmount,
            { color: isIncoming ? theme.credit : theme.text },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatSignedCurrency(transaction.amount)}
        </ThemedText>

        <ThemedText type="small" themeColor="textSecondary">
          {isIncoming ? "Money in" : "Money out"} · {transaction.transferName}
        </ThemedText>

        <View
          style={[
            styles.statusPill,
            { backgroundColor: theme.backgroundSelected },
          ]}
        >
          <Ionicons name="checkmark-circle" size={14} color={theme.credit} />
          <ThemedText type="smallBold" themeColor="textSecondary">
            Successful
          </ThemedText>
        </View>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}
      >
        <DetailRow label="Reference ID" value={transaction.refId} />
        <DetailRow
          label="Date"
          value={formatDateTime(transaction.transferDate)}
        />

        <DetailRow
          label={isIncoming ? "Sender name" : "Recipient name"}
          value={transaction.recipientName}
        />
        <DetailRow label="Transfer detail" value={transaction.transferName} />
        <DetailRow
          label="Transfer amount"
          value={formatCurrency(transaction.amount)}
          isLast
        />
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
        ]}
      >
        <Ionicons name="share-outline" size={18} color={theme.onPrimary} />
        <ThemedText style={[styles.shareLabel, { color: theme.onPrimary }]}>
          {isSharing ? "Opening…" : "Share transfer details"}
        </ThemedText>
      </TouchableOpacity>

      {statusMessage && (
        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={styles.statusMessage}
        >
          {statusMessage}
        </ThemedText>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
  },
  hero: {
    alignItems: "center",
    gap: Spacing.two,
    paddingTop: Spacing.four,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.one,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 42,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    marginTop: Spacing.one,
  },
  card: {
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    height: 50,
    borderRadius: Radius.md,
  },
  disabled: {
    opacity: 0.6,
  },
  shareLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  statusMessage: {
    textAlign: "center",
    marginTop: -Spacing.two,
  },
});
