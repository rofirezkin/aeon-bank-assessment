import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Share } from 'react-native';

import type { T_Transaction } from '@/types/transaction';
import { formatSignedCurrency } from '@/utils/format-currency';
import { formatDateTime } from '@/utils/format-date';
import { getTransactionDirection } from '@/utils/transaction-direction';

const STATUS_TIMEOUT_MS = 2500;

/** Deep link back into this exact transaction, e.g. `aeonassessmentapp://transaction-detail?refId=123ABC`. */
export function buildTransactionDeepLink(refId: string): string {
  return Linking.createURL('/transaction-detail', { queryParams: { refId } });
}

/** Plain-text receipt — readable in any app the user picks from the share sheet. */
export function buildTransactionShareMessage(transaction: T_Transaction): string {
  // One counterparty field serves both directions, so the label has to follow
  // the direction — the same rule the detail screen uses.
  const counterparty =
    getTransactionDirection(transaction) === 'incoming' ? 'Sender' : 'Recipient';

  return [
    'AEON Bank — Transfer Details',
    '',
    `Reference ID : ${transaction.refId}`,
    `Date         : ${formatDateTime(transaction.transferDate)}`,
    `${counterparty.padEnd(13)}: ${transaction.recipientName}`,
    `Detail       : ${transaction.transferName}`,
    `Amount       : ${formatSignedCurrency(transaction.amount)}`,
    '',
    `View in app  : ${buildTransactionDeepLink(transaction.refId)}`,
  ].join('\n');
}

/**
 * Opens the OS share sheet with the transfer details so the customer can send
 * them through whichever medium they prefer.
 */
export function useShareTransaction() {
  const [isSharing, setIsSharing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const flashStatus = useCallback((message: string) => {
    setStatusMessage(message);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setStatusMessage(null), STATUS_TIMEOUT_MS);
  }, []);

  const shareTransaction = useCallback(
    async (transaction: T_Transaction) => {
      const title = `Transfer to ${transaction.recipientName}`;

      setIsSharing(true);

      try {
        await Share.share(
          {
            title,
            message: buildTransactionShareMessage(transaction),
            // iOS shows `url` as a separate attachment; Android only reads `message`.
            ...(Platform.OS === 'ios'
              ? { url: buildTransactionDeepLink(transaction.refId) }
              : null),
          },
          { dialogTitle: title, subject: title },
        );

        Haptics.selectionAsync().catch(() => {
          // Haptics are a nicety, never a failure path.
        });
      } catch {
        flashStatus('Could not open the share sheet');
      } finally {
        setIsSharing(false);
      }
    },
    [flashStatus],
  );

  return { shareTransaction, isSharing, statusMessage };
}
