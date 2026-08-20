import { useMemo } from "react";
import { RefreshControl, SectionList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterBar } from "@/components/filter-bar/filter-bar";
import { ListEmptyState } from "@/components/list-states/list-empty-state";
import { ListErrorState } from "@/components/list-states/list-error-state";
import { TransactionListSkeleton } from "@/components/list-states/transaction-list-skeleton";
import { ThemedText } from "@/components/themed-text";
import { TransactionItem } from "@/components/transaction-item/transaction-item";
import { TransactionSummaryCard } from "@/components/transaction-summary/transaction-summary";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useDebounce } from "@/hooks/use-debounce";
import { useTheme } from "@/hooks/use-theme";
import { useGetTransactions } from "@/services/query/use-get-transactions";
import { useTransactionFilterStore } from "@/store/use-transaction-filter-store";
import {
  filterTransactions,
  groupTransactionsByDate,
  summariseTransactions,
  type T_TransactionSummary,
} from "@/utils/transaction-list";

export default function TransactionListScreen() {
  const theme = useTheme();
  const { filter, search } = useTransactionFilterStore();
  const debouncedSearch = useDebounce(search);

  const {
    data: transactions,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
  } = useGetTransactions();

  const visibleTransactions = useMemo(
    () => filterTransactions(transactions, { filter, search: debouncedSearch }),
    [transactions, filter, debouncedSearch],
  );
  const sections = useMemo(
    () => groupTransactionsByDate(visibleTransactions),
    [visibleTransactions],
  );
  const summary = useMemo(
    () => summariseTransactions(visibleTransactions),
    [visibleTransactions],
  );

  if (isError) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={[styles.screen, { backgroundColor: theme.background }]}
      >
        <View style={styles.content}>
          <ScreenHeader />
          <ListErrorState
            description={
              error?.message ?? "We could not load your transactions."
            }
            onRetry={() => refetch()}
            isRetrying={isRefetching}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isPending) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={[styles.screen, { backgroundColor: theme.background }]}
      >
        <View style={styles.content}>
          <ScreenHeader />
          <TransactionListSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.screen, { backgroundColor: theme.background }]}
    >
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.refId}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        renderSectionHeader={({ section }) => (
          <ThemedText
            type="smallBold"
            themeColor="textSecondary"
            style={[
              styles.sectionHeader,
              { backgroundColor: theme.background },
            ]}
          >
            {section.title}
          </ThemedText>
        )}
        ListHeaderComponent={<ListHeader summary={summary} />}
        ListEmptyComponent={
          <ListEmptyState
            title="No transactions found"
            description="Try a different keyword or switch the filter back to All."
          />
        }
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.textSecondary}
          />
        }
      />
    </SafeAreaView>
  );
}

function ListHeader({ summary }: { summary: T_TransactionSummary }) {
  return (
    <View style={styles.header}>
      <ScreenHeader />
      <TransactionSummaryCard summary={summary} />
      <FilterBar />
    </View>
  );
}

function ScreenHeader() {
  return (
    <View style={styles.titleBlock}>
      <ThemedText style={styles.title}>Transactions</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Your latest account activity
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
  },
  header: {
    gap: Spacing.three,
    paddingBottom: Spacing.two,
  },
  titleBlock: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
    gap: Spacing.half,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  sectionHeader: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
