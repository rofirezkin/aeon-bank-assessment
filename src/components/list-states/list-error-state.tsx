import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ListErrorStateProps = {
  title?: string;
  description: string;
  onRetry: () => void;
  isRetrying?: boolean;
};

export function ListErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  isRetrying = false,
}: ListErrorStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={40} color={theme.textMuted} />

      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
        {description}
      </ThemedText>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Try again"
        disabled={isRetrying}
        onPress={onRetry}
        style={[styles.button, { backgroundColor: theme.primary }, isRetrying && styles.disabled]}>
        <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
          {isRetrying ? 'Retrying…' : 'Try again'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
  disabled: {
    opacity: 0.6,
  },
});
