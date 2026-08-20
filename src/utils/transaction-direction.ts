import type { T_Transaction } from '@/types/transaction';

export type T_TransactionDirection = 'incoming' | 'outgoing';

/** The single place that decides what the sign of an amount means. */
export function getTransactionDirection(transaction: T_Transaction): T_TransactionDirection {
  return transaction.amount >= 0 ? 'incoming' : 'outgoing';
}
