import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';

const SORT_OPTIONS = [
  { key: 'newest', label: '🕐 Terbaru', },
  { key: 'oldest', label: '📅 Terlama', },
  { key: 'alpha',  label: '🔤 A–Z', },
  { key: 'done',   label: '✅ Selesai', },
];

export default function SortPicker({ value, onChange, theme }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find(o => o.key === value);
  const s = makeStyles(theme);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={[s.trigger, { backgroundColor: theme.surface, borderColor: theme.border }]}
      >
        <Text style={{ color: theme.textSecondary, fontSize: 13 }}>{current?.label ?? '↕️'}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={s.overlay} onPress={() => setOpen(false)}>
          <View style={[s.dropdown, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[s.heading, { color: theme.textSecondary }]}>Urutkan berdasarkan</Text>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => { onChange(opt.key); setOpen(false); }}
                style={[
                  s.option,
                  value === opt.key && { backgroundColor: theme.surfaceAlt },
                ]}
              >
                <Text style={[s.optionText, { color: value === opt.key ? theme.primary : theme.text }]}>
                  {opt.label}
                </Text>
                {value === opt.key && <Text style={{ color: theme.primary }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const makeStyles = (theme) => StyleSheet.create({
  trigger: {
    paddingHorizontal: 10, paddingVertical: 10, borderRadius: 12, borderWidth: 1,
  },
  overlay: { flex: 1, backgroundColor: '#00000040', justifyContent: 'center', alignItems: 'center' },
  dropdown: {
    width: 220, borderRadius: 16, borderWidth: 1, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16,
    elevation: 12,
  },
  heading: { fontSize: 12, fontWeight: '600', paddingHorizontal: 16, paddingVertical: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13 },
  optionText: { fontSize: 15, fontWeight: '500' },
});
