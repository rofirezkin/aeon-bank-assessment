import { mockRequest, type T_ApiResponse } from '@/services/base-api';
import { MOCK_TRANSACTIONS } from '@/services/mock/transactions.mock';
import type { T_Transaction } from '@/types/transaction';
import { sortTransactionsByNewest } from '@/utils/transaction-list';

export async function getTransactions(): Promise<T_ApiResponse<T_Transaction[]>> {
  return mockRequest(() => sortTransactionsByNewest(MOCK_TRANSACTIONS));
}

export type T_ApiGetTransactionsResponse = Awaited<ReturnType<typeof getTransactions>>;
