import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  TRANSACTION_FILTERS,
  useTransactionFilterStore,
} from "@/store/use-transaction-filter-store";

export function FilterBar() {
  const theme = useTheme();
  const { filter, search, setFilter, setSearch } = useTransactionFilterStore();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons name="search" size={18} color={theme.textMuted} />

        <TextInput
          accessibilityLabel="Search transactions"
          placeholder="Search name, detail or reference"
          placeholderTextColor={theme.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={[styles.input, { color: theme.text }]}
        />

        {search.length > 0 && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={12}
            onPress={() => setSearch("")}
          >
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.chips}>
        {TRANSACTION_FILTERS.map(({ value, label }) => {
          const isActive = filter === value;

          return (
            <TouchableOpacity
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => setFilter(value)}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive
                    ? theme.primary
                    : theme.backgroundElement,
                  borderColor: isActive ? theme.primary : theme.border,
                },
              ]}
            >
              <ThemedText
                type="smallBold"
                style={{
                  color: isActive ? theme.onPrimary : theme.textSecondary,
                }}
              >
                {label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    fontSize: 15,
    // Android adds vertical padding that misaligns the row.
    paddingVertical: 0,
  },
  chips: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
