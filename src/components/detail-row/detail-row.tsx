import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type DetailRowProps = {
  label: string;
  value: string;
  /** Figures (amounts, reference ids) line up better in the mono face. */
  mono?: boolean;
};

/** One printed line of the receipt: label on the left, value on the right. */
export function DetailRow({ label, value, mono = false }: DetailRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <ThemedText style={[styles.label, { color: theme.textMuted }]}>{label}</ThemedText>
      <ThemedText style={[styles.value, mono && styles.valueMono]} selectable>
        {value}
      </ThemedText>
    </View>
  );
}

/** Torn-paper rule used between receipt sections. */
export function DashedRule() {
  const theme = useTheme();

  return <View style={[styles.dashed, { borderTopColor: theme.border }]} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  label: {
    flexShrink: 0,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingTop: 2,
  },
  value: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  valueMono: {
    fontFamily: Fonts.mono,
    letterSpacing: 0.4,
  },
  dashed: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    marginVertical: Spacing.two,
  },
});
