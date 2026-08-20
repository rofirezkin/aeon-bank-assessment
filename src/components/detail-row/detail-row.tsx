import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type DetailRowProps = {
  label: string;
  value: string;
  /** Optional trailing control, e.g. a copy button. */
  accessory?: ReactNode;
  isLast?: boolean;
};

/** One label/value line inside the transaction detail card. */
export function DetailRow({ label, value, accessory, isLast = false }: DetailRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>

      <View style={styles.valueContainer}>
        <ThemedText style={styles.value} selectable>
          {value}
        </ThemedText>
        {accessory}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  label: {
    flexShrink: 0,
  },
  valueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
  value: {
    flexShrink: 1,
    fontWeight: '600',
    textAlign: 'right',
  },
});
