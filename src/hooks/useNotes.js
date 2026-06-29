import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@notekeeper_notes';
const STATS_KEY = '@notekeeper_stats';

const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const defaultStats = { totalCreated: 0, totalDeleted: 0 };

export default function useNotes() {
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);

  // ── Load from storage on mount ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [rawNotes, rawStats] = await Promise.all([
          AsyncStorage.getItem(NOTES_KEY),
          AsyncStorage.getItem(STATS_KEY),
        ]);
        if (rawNotes) setNotes(JSON.parse(rawNotes));
        if (rawStats) setStats(JSON.parse(rawStats));
      } catch (e) {
        console.warn('Load error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Persist helpers ──────────────────────────────────────────────────────────
  const saveNotes = useCallback(async (next) => {
    setNotes(next);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(next));
  }, []);

  const saveStats = useCallback(async (next) => {
    setStats(next);
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(next));
  }, []);

  // ── CREATE ───────────────────────────────────────────────────────────────────
  const addNote = useCallback(async (title, body = '') => {
    const note = {
      id: makeId(),
      title: title.trim(),
      body: body.trim(),
      done: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const next = [note, ...notes];
    await saveNotes(next);
    const nextStats = { ...stats, totalCreated: stats.totalCreated + 1 };
    await saveStats(nextStats);
    return note;
  }, [notes, stats, saveNotes, saveStats]);

  // ── UPDATE ───────────────────────────────────────────────────────────────────
  const updateNote = useCallback(async (id, changes) => {
    const next = notes.map(n =>
      n.id === id ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n
    );
    await saveNotes(next);
  }, [notes, saveNotes]);

  const toggleDone = useCallback(async (id) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    await updateNote(id, { done: !note.done });
  }, [notes, updateNote]);

  // ── DELETE ───────────────────────────────────────────────────────────────────
  const deleteNote = useCallback(async (id) => {
    const next = notes.filter(n => n.id !== id);
    await saveNotes(next);
    const nextStats = { ...stats, totalDeleted: stats.totalDeleted + 1 };
    await saveStats(nextStats);
  }, [notes, stats, saveNotes, saveStats]);

  const deleteAll = useCallback(async () => {
    const count = notes.length;
    await saveNotes([]);
    const nextStats = { ...stats, totalDeleted: stats.totalDeleted + count };
    await saveStats(nextStats);
  }, [notes, stats, saveNotes, saveStats]);

  return { notes, stats, loading, addNote, updateNote, toggleDone, deleteNote, deleteAll };
}
