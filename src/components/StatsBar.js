import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatsBar({ stats, theme, noteCount }) {
  const doneCount = 0; // will be passed from parent if needed — shows total from stats
  const s = makeStyles(theme);

  return (
    <View style={[s.bar, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
      <StatItem emoji="📋" label="Total Dibuat" value={stats.totalCreated} theme={theme} />
      <View style={[s.divider, { backgroundColor: theme.border }]} />
      <StatItem emoji="📂" label="Tersimpan" value={noteCount} theme={theme} />
      <View style={[s.divider, { backgroundColor: theme.border }]} />
      <StatItem emoji="🗑" label="Dihapus" value={stats.totalDeleted} theme={theme} />
    </View>
  );
}

function StatItem({ emoji, label, value, theme }) {
  return (
    <View style={styles.item}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, { color: theme.primary }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flex: 1, alignItems: 'center', paddingVertical: 2 },
  emoji: { fontSize: 16, marginBottom: 2 },
  value: { fontSize: 18, fontWeight: '800' },
  label: { fontSize: 10, textAlign: 'center' },
});

const makeStyles = (theme) => StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 14,
    borderRadius: 14, borderWidth: 1, paddingVertical: 10,
  },
  divider: { width: 1, height: 36 },
});
