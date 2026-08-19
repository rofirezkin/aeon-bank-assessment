
export type T_ApiResponse<T> = {
  data: T;
  status: 'success';
  code: string;
  message: string;
};

/** Error shape thrown by the transport and surfaced by the query hooks. */
export class ApiError extends Error {
  readonly code: string;

  constructor(message: string, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

const MOCK_LATENCY_MS = 650;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Resolves `payload` after a short delay so loading, refreshing and error
 * states are all reachable in the UI.
 *
 * @throws {ApiError} when `resolve` returns `null`/`undefined`.
 */
export async function mockRequest<T>(
  resolve: () => T | null | undefined,
  notFoundMessage = 'Resource not found',
): Promise<T_ApiResponse<T>> {
  await wait(MOCK_LATENCY_MS);

  const data = resolve();

  if (data === null || data === undefined) {
    throw new ApiError(notFoundMessage, 'NOT_FOUND');
  }

  return {
    data,
    status: 'success',
    code: '200',
    message: 'OK',
  };
}
