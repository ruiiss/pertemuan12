import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function NoteCard({ note, theme, onToggle, onEdit, onDelete }) {
  const s = makeStyles(theme);

  return (
    <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {/* Status strip */}
      <View style={[s.strip, { backgroundColor: note.done ? theme.primaryLight : theme.primary }]} />

      <View style={s.body}>
        {/* Title row */}
        <View style={s.titleRow}>
          <TouchableOpacity onPress={onToggle} style={s.checkBtn}>
            <View style={[
              s.checkbox,
              { borderColor: theme.primary },
              note.done && { backgroundColor: theme.primary },
            ]}>
              {note.done && <Text style={s.checkMark}>✓</Text>}
            </View>
          </TouchableOpacity>

          <Text
            style={[s.title, { color: theme.text }, note.done && s.titleDone]}
            numberOfLines={2}
          >
            {note.title}
          </Text>
        </View>

        {/* Body text */}
        {!!note.body && (
          <Text style={[s.noteBody, { color: theme.textSecondary }]} numberOfLines={3}>
            {note.body}
          </Text>
        )}

        {/* Footer */}
        <View style={s.footer}>
          <Text style={[s.timestamp, { color: theme.textMuted }]}>
            🕐 {formatDate(note.createdAt)}
            {note.updatedAt !== note.createdAt && ' (diedit)'}
          </Text>
          <View style={s.actions}>
            <TouchableOpacity onPress={onEdit} style={[s.actionBtn, { backgroundColor: theme.surfaceAlt }]}>
              <Text style={{ color: theme.primary, fontSize: 15 }}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={[s.actionBtn, { backgroundColor: theme.dangerLight }]}>
              <Text style={{ fontSize: 15 }}>🗑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (theme) => StyleSheet.create({
  card: {
    flexDirection: 'row', borderRadius: 16, borderWidth: 1,
    marginBottom: 12, overflow: 'hidden',
    shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  strip: { width: 4 },
  body: { flex: 1, padding: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 6 },
  checkBtn: { paddingTop: 2 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  title: { flex: 1, fontSize: 16, fontWeight: '700', lineHeight: 22 },
  titleDone: { textDecorationLine: 'line-through', opacity: 0.5 },
  noteBody: { fontSize: 13, lineHeight: 19, marginBottom: 10 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timestamp: { fontSize: 11, flex: 1 },
  actions: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
});
