import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const PRESET_COLORS = [
  '#0a7ea4',
  '#e74c3c',
  '#2ecc71',
  '#f39c12',
  '#9b59b6',
  '#3498db',
  '#e67e22',
  '#1abc9c',
  '#34495e',
  '#e91e63',
  '#607d8b',
  '#795548',
];

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const normalized = value.toLowerCase();
  const isValidHex = /^#[0-9a-f]{6}$/i.test(value);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {PRESET_COLORS.map((color) => (
          <Pressable
            key={color}
            onPress={() => onChange(color)}
            style={[
              styles.swatch,
              { backgroundColor: color },
              normalized === color.toLowerCase() && styles.selected,
            ]}
          />
        ))}
      </View>
      <View style={styles.customRow}>
        <View style={[styles.preview, { backgroundColor: isValidHex ? value : '#ccc' }]} />
        <TextInput
          style={[styles.hexInput, { color: colors.text, borderColor: colors.icon }]}
          value={value}
          onChangeText={(text) => {
            const hex = text.startsWith('#') ? text : `#${text}`;
            onChange(hex.slice(0, 7));
          }}
          placeholder="#000000"
          placeholderTextColor={colors.icon}
          autoCapitalize="none"
          maxLength={7}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  selected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preview: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  hexInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
});
