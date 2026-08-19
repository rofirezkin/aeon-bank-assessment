import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  getTransactionById,
  type T_ApiGetTransactionByIdResponse,
} from '@/services/api/get.transaction-by-id';
import type { ApiError } from '@/services/base-api';

export const GET_TRANSACTION_DETAIL = 'getTransactionDetail';

export type T_UseGetTransactionDetailOptions = Partial<
  UseQueryOptions<T_ApiGetTransactionByIdResponse, ApiError>
>;

export function useGetTransactionDetail(
  refId: string,
  options?: T_UseGetTransactionDetailOptions,
) {
  const query = useQuery<T_ApiGetTransactionByIdResponse, ApiError>({
    queryKey: [GET_TRANSACTION_DETAIL, refId],
    queryFn: () => getTransactionById({ refId }),
    enabled: !!refId,
    ...options,
  });

  return {
    ...query,
    data: query.data?.data,
  };
}
