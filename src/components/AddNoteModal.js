import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';

export default function AddNoteModal({ visible, onClose, onSave, initialNote, theme }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [titleError, setTitleError] = useState('');

  const isEdit = !!initialNote;

  useEffect(() => {
    if (visible) {
      setTitle(initialNote?.title ?? '');
      setBody(initialNote?.body ?? '');
      setTitleError('');
    }
  }, [visible, initialNote]);

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError('Judul catatan tidak boleh kosong!');
      return;
    }
    setTitleError('');
    onSave(title, body);
  };

  const s = makeStyles(theme);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.sheetWrap}
        >
          <View style={[s.sheet, { backgroundColor: theme.surface }]}>
            {/* Handle bar */}
            <View style={[s.handle, { backgroundColor: theme.border }]} />

            <Text style={[s.heading, { color: theme.text }]}>
              {isEdit ? '✏️ Edit Catatan' : '📝 Catatan Baru'}
            </Text>

            {/* Title input */}
            <Text style={[s.label, { color: theme.textSecondary }]}>Judul *</Text>
            <TextInput
              style={[
                s.input,
                { color: theme.text, backgroundColor: theme.surfaceAlt, borderColor: titleError ? theme.danger : theme.border },
              ]}
              placeholder="Judul catatan…"
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={(t) => { setTitle(t); if (t.trim()) setTitleError(''); }}
              maxLength={100}
              returnKeyType="next"
              autoFocus
            />
            {!!titleError && (
              <Text style={[s.errorText, { color: theme.danger }]}>⚠ {titleError}</Text>
            )}

            {/* Body input */}
            <Text style={[s.label, { color: theme.textSecondary }]}>Isi catatan</Text>
            <TextInput
              style={[s.input, s.bodyInput, { color: theme.text, backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}
              placeholder="Tulis isi catatan di sini… (opsional)"
              placeholderTextColor={theme.textMuted}
              value={body}
              onChangeText={setBody}
              multiline
              textAlignVertical="top"
              maxLength={1000}
            />
            <Text style={[s.charCount, { color: theme.textMuted }]}>{body.length}/1000</Text>

            {/* Buttons */}
            <View style={s.btnRow}>
              <TouchableOpacity onPress={onClose} style={[s.btn, s.cancelBtn, { backgroundColor: theme.surfaceAlt }]}>
                <Text style={[s.btnText, { color: theme.textSecondary }]}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={[s.btn, s.saveBtn, { backgroundColor: theme.primary }]}>
                <Text style={[s.btnText, { color: '#FFF' }]}>{isEdit ? 'Simpan' : 'Tambah'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const makeStyles = (theme) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#00000060', justifyContent: 'flex-end' },
  sheetWrap: { justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingTop: 12,
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  heading: { fontSize: 20, fontWeight: '800', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, marginBottom: 4,
  },
  bodyInput: { height: 120, marginBottom: 4 },
  errorText: { fontSize: 12, marginBottom: 8, marginTop: 2 },
  charCount: { fontSize: 11, textAlign: 'right', marginBottom: 20 },
  btnRow: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  cancelBtn: {},
  saveBtn: {},
  btnText: { fontWeight: '700', fontSize: 15 },
});
