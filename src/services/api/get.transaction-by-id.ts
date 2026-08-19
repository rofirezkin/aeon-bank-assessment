import type { T_Transaction } from '@/types/transaction';
import { mockRequest, type T_ApiResponse } from '@/services/base-api';
import { MOCK_TRANSACTIONS } from '@/services/mock/transactions.mock';

export type Trq_TransactionById = { refId: string };

/** A single transaction looked up by its reference id. */
export async function getTransactionById(
  payload: Trq_TransactionById,
): Promise<T_ApiResponse<T_Transaction>> {
  return mockRequest(
    () => MOCK_TRANSACTIONS.find((transaction) => transaction.refId === payload.refId),
    `Transaction ${payload.refId} was not found`,
  );
}

export type T_ApiGetTransactionByIdResponse = Awaited<ReturnType<typeof getTransactionById>>;
