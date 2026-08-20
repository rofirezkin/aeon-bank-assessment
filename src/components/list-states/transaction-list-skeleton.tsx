import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PLACEHOLDER_ROWS = 6;

/** Pulsing placeholder rows shown while the first page of data loads. */
export function TransactionListSkeleton() {
  const theme = useTheme();
  // Lazy `useState` initialiser keeps one Animated.Value per mount without
  // reading a ref during render.
  const [pulse] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 650, useNativeDriver: true }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [pulse]);

  return (
    <View accessibilityLabel="Loading transactions" style={styles.container}>
      {Array.from({ length: PLACEHOLDER_ROWS }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.card,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            { opacity: pulse },
          ]}>
          <View style={[styles.avatar, { backgroundColor: theme.skeleton }]} />

          <View style={styles.details}>
            <View style={[styles.line, styles.lineWide, { backgroundColor: theme.skeleton }]} />
            <View style={[styles.line, styles.lineNarrow, { backgroundColor: theme.skeleton }]} />
          </View>

          <View style={[styles.line, styles.amount, { backgroundColor: theme.skeleton }]} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.two,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
  },
  details: {
    flex: 1,
    gap: Spacing.two,
  },
  line: {
    height: 10,
    borderRadius: Radius.sm,
  },
  lineWide: {
    width: '65%',
  },
  lineNarrow: {
    width: '40%',
  },
  amount: {
    width: 72,
  },
});
