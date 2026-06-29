import React, { useState, useMemo, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
  Animated, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useTheme } from '../../App';
import useNotes from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';
import AddNoteModal from '../components/AddNoteModal';
import StatsBar from '../components/StatsBar';
import SortPicker from '../components/SortPicker';

export default function HomeScreen() {
  const { theme, isDark, toggleDark } = useTheme();
  const { notes, stats, loading, addNote, updateNote, toggleDone, deleteNote, deleteAll } = useNotes();

  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState('newest'); // newest | oldest | alpha | done
  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // note being edited

  const s = makeStyles(theme);

  // ── Filter + Sort ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = notes;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
      );
    }
    switch (sortMode) {
      case 'oldest':  return [...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      case 'alpha':   return [...list].sort((a, b) => a.title.localeCompare(b.title));
      case 'done':    return [...list].sort((a, b) => Number(b.done) - Number(a.done));
      default:        return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  }, [notes, search, sortMode]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSave = async (title, body) => {
    if (editTarget) {
      await updateNote(editTarget.id, { title: title.trim(), body: body.trim() });
      setEditTarget(null);
    } else {
      await addNote(title, body);
    }
    setModalVisible(false);
  };

  const handleEdit = (note) => {
    setEditTarget(note);
    setModalVisible(true);
  };

  const handleDelete = (id, title) => {
    Alert.alert(
      'Hapus Catatan',
      `Yakin mau hapus "${title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => deleteNote(id) },
      ]
    );
  };

  const handleDeleteAll = () => {
    if (notes.length === 0) return;
    Alert.alert(
      'Hapus Semua',
      `Hapus semua ${notes.length} catatan? Tindakan ini tidak bisa dibatalkan.`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus Semua', style: 'destructive', onPress: deleteAll },
      ]
    );
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditTarget(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[s.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[s.loadingText, { color: theme.textSecondary }]}>Memuat catatan…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={[s.appTitle, { color: theme.primary }]}>📒 NoteKeeper</Text>
            <Text style={[s.appSub, { color: theme.textSecondary }]}>
              {notes.length} catatan tersimpan
            </Text>
          </View>
          <TouchableOpacity onPress={toggleDark} style={[s.iconBtn, { backgroundColor: theme.surfaceAlt }]}>
            <Text style={{ fontSize: 20 }}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats ── */}
        <StatsBar stats={stats} theme={theme} noteCount={notes.length} />

        {/* ── Search + Sort Row ── */}
        <View style={s.searchRow}>
          <View style={[s.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={{ color: theme.textMuted, marginRight: 6 }}>🔎</Text>
            <TextInput
              style={[s.searchInput, { color: theme.text }]}
              placeholder="Cari catatan…"
              placeholderTextColor={theme.textMuted}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Text style={{ color: theme.textMuted, fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <SortPicker value={sortMode} onChange={setSortMode} theme={theme} />
        </View>

        {/* ── List ── */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={filtered.length === 0 ? s.emptyContainer : s.listContent}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              theme={theme}
              onToggle={() => toggleDone(item.id)}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item.id, item.title)}
            />
          )}
          ListEmptyComponent={
            <View style={s.emptyWrap}>
              <Text style={s.emptyEmoji}>{search ? '🔍' : '📭'}</Text>
              <Text style={[s.emptyTitle, { color: theme.text }]}>
                {search ? 'Tidak ada hasil' : 'Belum ada catatan'}
              </Text>
              <Text style={[s.emptySub, { color: theme.textSecondary }]}>
                {search
                  ? `Tidak ditemukan catatan untuk "${search}"`
                  : 'Tekan tombol + untuk mulai menulis'}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />

        {/* ── Bottom Actions ── */}
        <View style={[s.bottomBar, { backgroundColor: theme.bg, borderColor: theme.border }]}>
          {notes.length > 0 && (
            <TouchableOpacity
              onPress={handleDeleteAll}
              style={[s.deleteAllBtn, { backgroundColor: theme.dangerLight }]}
            >
              <Text style={[s.deleteAllText, { color: theme.danger }]}>🗑 Hapus Semua</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[s.fab, { backgroundColor: theme.primary }]}
          >
            <Text style={s.fabText}>＋</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

      {/* ── Add/Edit Modal ── */}
      <AddNoteModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSave={handleSave}
        initialNote={editTarget}
        theme={theme}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const makeStyles = (theme) => StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, fontSize: 15 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  appTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  appSub: { fontSize: 13, marginTop: 1 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },

  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  emptyContainer: { flex: 1, paddingHorizontal: 16 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },

  bottomBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    paddingHorizontal: 20, paddingVertical: 12,
    borderTopWidth: 1, gap: 12,
  },
  deleteAllBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  deleteAllText: { fontWeight: '600', fontSize: 14 },
  fab: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#6C5CE7', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 8,
  },
  fabText: { color: '#FFF', fontSize: 26, lineHeight: 30, fontWeight: '300' },
});
