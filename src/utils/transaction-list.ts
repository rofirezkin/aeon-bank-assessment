import type { T_TransactionFilter } from "@/store/use-transaction-filter-store";
import type { T_Transaction } from "@/types/transaction";
import { formatRelativeDay, toDateKey } from "@/utils/format-date";
import { getTransactionDirection } from "@/utils/transaction-direction";

export type T_TransactionSection = {
  key: string;
  title: string;
  data: T_Transaction[];
};

export type T_TransactionSummary = {
  totalIn: number;
  totalOut: number;
  count: number;
};

export function sortTransactionsByNewest(
  transactions: T_Transaction[],
): T_Transaction[] {
  return [...transactions].sort(
    (a, b) =>
      new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime(),
  );
}

export function filterTransactions(
  transactions: T_Transaction[],
  { filter, search }: { filter: T_TransactionFilter; search: string },
): T_Transaction[] {
  const keyword = search.trim().toLowerCase();

  return transactions.filter((transaction) => {
    if (filter !== "all" && getTransactionDirection(transaction) !== filter) {
      return false;
    }

    if (!keyword) return true;

    return (
      transaction.transferName.toLowerCase().includes(keyword) ||
      transaction.recipientName.toLowerCase().includes(keyword) ||
      transaction.refId.toLowerCase().includes(keyword)
    );
  });
}

export function groupTransactionsByDate(
  transactions: T_Transaction[],
): T_TransactionSection[] {
  const sections = new Map<string, T_TransactionSection>();

  for (const transaction of transactions) {
    const key = toDateKey(transaction.transferDate);
    const section = sections.get(key);

    if (section) {
      section.data.push(transaction);
      continue;
    }

    sections.set(key, {
      key,
      title: formatRelativeDay(transaction.transferDate),
      data: [transaction],
    });
  }

  return [...sections.values()];
}

export function summariseTransactions(
  transactions: T_Transaction[],
): T_TransactionSummary {
  let totalIn = 0;
  let totalOut = 0;

  for (const transaction of transactions) {
    if (getTransactionDirection(transaction) === "incoming") {
      totalIn += transaction.amount;
    } else {
      totalOut += Math.abs(transaction.amount);
    }
  }

  return { totalIn, totalOut, count: transactions.length };
}
