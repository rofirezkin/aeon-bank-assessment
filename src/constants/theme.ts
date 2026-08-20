/**
 * Design tokens for the app. Every colour is declared for both light and dark
 * mode so `useTheme()` can hand back a single flat palette to components.
 *
 * Learn more: https://docs.expo.dev/guides/color-schemes/
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#11121A',
    textSecondary: '#5F6472',
    textMuted: '#8A8F9C',
    background: '#F4F5F7',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E5E6EB',
    border: '#E6E7EC',
    primary: '#C2007B',
    onPrimary: '#FFFFFF',
    credit: '#0F7A55',
    debit: '#11121A',
    skeleton: '#E5E6EB',
  },
  dark: {
    text: '#F5F6F8',
    textSecondary: '#A9AEBA',
    textMuted: '#7C818D',
    background: '#0B0B0F',
    backgroundElement: '#17181D',
    backgroundSelected: '#26272E',
    border: '#26272E',
    primary: '#FF57B4',
    onPrimary: '#1A0011',
    credit: '#3ECF9A',
    debit: '#F5F6F8',
    skeleton: '#26272E',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
/** Flat palette handed to components by `useTheme()`. */
export type Theme = Record<ThemeColor, string>;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const MaxContentWidth = 800;
