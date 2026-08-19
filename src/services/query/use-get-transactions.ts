import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  getTransactions,
  type T_ApiGetTransactionsResponse,
} from '@/services/api/get.transactions';
import type { ApiError } from '@/services/base-api';

export const GET_TRANSACTIONS = 'getTransactions';

export type T_UseGetTransactionsOptions = Partial<
  UseQueryOptions<T_ApiGetTransactionsResponse, ApiError>
>;

export function useGetTransactions(options?: T_UseGetTransactionsOptions) {
  const query = useQuery<T_ApiGetTransactionsResponse, ApiError>({
    queryKey: [GET_TRANSACTIONS],
    queryFn: getTransactions,
    ...options,
  });

  return {
    ...query,
    // Unwrap the envelope so screens deal with the list, not the transport.
    data: query.data?.data ?? [],
  };
}
