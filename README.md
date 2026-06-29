# 📒 NoteKeeper Pro

Aplikasi catatan personal dengan persistensi data lokal menggunakan AsyncStorage. Data tetap tersimpan walaupun aplikasi ditutup total.

---

## ✨ Fitur

### 🟢 Level 1 — Core CRUD
| Fitur | Deskripsi |
|-------|-----------|
| ➕ **CREATE** | Tambah catatan baru via modal dengan validasi input kosong |
| 📋 **READ** | Muat semua catatan saat app dibuka (`useEffect` + `JSON.parse`) |
| ✏️ **UPDATE** | Edit judul & isi catatan yang sudah ada |
| 🗑 **DELETE** | Hapus item dari daftar & sinkron ke storage |
| 💾 **Persistensi** | Data disimpan dengan `JSON.stringify` setiap perubahan |
| 📃 **FlatList** | Daftar item dengan `keyExtractor` yang unik |
| 📭 **Empty State** | Pesan khusus saat daftar kosong (`ListEmptyComponent`) |

### 🟡 Level 2 — Fitur Tambahan (4 dari 6)
| # | Fitur | Detail |
|---|-------|--------|
| 1 | ✏️ **UPDATE / Edit** | Edit teks catatan + toggle status selesai (dicoret) |
| 2 | 🌙 **Dark Mode Tersimpan** | Toggle tema disimpan di key terpisah (`@notekeeper_dark_mode`), dimuat saat buka app |
| 3 | 🔎 **Search / Filter** | TextInput real-time untuk cari catatan berdasarkan judul atau isi |
| 4 | 📊 **Statistik Tersimpan** | Counter total dibuat & dihapus disimpan di `@notekeeper_stats` |
| 5 | 🗑 **Konfirmasi Hapus** | `Alert.alert` konfirmasi sebelum hapus item |
| 6 | 🧹 **Hapus Semua** | Tombol hapus semua catatan dengan konfirmasi |

### 🔴 Level 3 — Bonus
- 🕐 **Timestamp** — Setiap catatan menyimpan `createdAt` & `updatedAt`, ditampilkan di card
- ↕️ **Sorting** — Urutkan: Terbaru / Terlama / A-Z / Selesai dahulu

---

## 📸 Screenshot

1. `https://i.imgur.com/rmrwbqg.jpeg` — tampilan dark mode
2. `https://i.imgur.com/4sfn1qX.jpeg` — daftar item
3. `http://i.imgur.com/GXEVST8.jpeg` — modal edit catatan
4. `https://i.imgur.com/6284lqY.jpeg` — fitur pencarian aktif

---

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js ≥ 18
- Expo CLI: `npm install -g expo-cli`
- Expo Go di HP (Android/iOS)

### Install & Run
```bash
git clone https://github.com/ruiiss/pertemuan12.git
cd notekeeper-pro
npm install
npx expo start
```
Scan QR code dengan Expo Go di HP.

---

## 🧪 Test Cases

| # | Skenario | Langkah | Expected |
|---|----------|---------|----------|
| 1 | Create | Tap +, isi judul, tap Tambah | Catatan muncul di daftar |
| 2 | Validasi | Tap +, biarkan judul kosong, tap Tambah | Muncul pesan error merah |
| 3 | Edit | Tap ✏️ di card, ubah teks, tap Simpan | Catatan terupdate + label "(diedit)" |
| 4 | Toggle Done | Tap checkbox di card | Teks tercoret, strip berubah warna |
| 5 | Delete | Tap 🗑 → konfirmasi → Hapus | Item terhapus, counter statistik naik |
| 6 | Hapus Semua | Tap "🗑 Hapus Semua" → konfirmasi | Semua item hilang |
| 7 | Search | Ketik di kotak pencarian | Daftar difilter real-time |
| 8 | Sort | Tap dropdown sort, pilih opsi | Urutan daftar berubah |
| 9 | Dark Mode | Tap ikon 🌙 | Tema berubah & tersimpan |
| 10 | **Persistensi** | Tutup app total → buka kembali | Semua data + tema tetap ada |

---

## 🛠 Tech Stack

| Teknologi | Versi | Kegunaan |
|-----------|-------|---------|
| React Native | 0.73 | Framework mobile |
| Expo | ~50 | Build & run toolchain |
| AsyncStorage | 1.21 | Persistensi data lokal |
| React Hooks | — | `useState`, `useEffect`, `useCallback`, `useMemo` |

---

## 🗂 Struktur Proyek

```
notekeeper-pro/
├── App.js                    # Entry point + ThemeContext
├── src/
│   ├── screens/
│   │   └── HomeScreen.js     # Main screen (list, search, sort)
│   ├── components/
│   │   ├── NoteCard.js       # Item catatan (toggle, edit, delete)
│   │   ├── AddNoteModal.js   # Modal tambah/edit catatan
│   │   ├── StatsBar.js       # Bar statistik tersimpan
│   │   └── SortPicker.js     # Dropdown sort mode
│   └── hooks/
│       └── useNotes.js       # Custom hook CRUD + AsyncStorage
├── app.json
├── package.json
└── README.md
```

---

## 🔗 Links
- **Expo Snack:** [https://snack.expo.dev/@ariq_lll/pertemuan12](https://snack.expo.dev)
- **GitHub Repo:** [https://github.com/ruiiss/pertemuan12](https://github.com)

---

## 📝 Commit History (Conventional Commits)

```
feat: initial project setup with Expo and AsyncStorage
feat: add CREATE note with validation and AsyncStorage persistence  
feat: add READ - load notes on app start with useEffect
feat: add DELETE with Alert confirmation
feat: add UPDATE - edit note text via modal
feat: add dark mode toggle with AsyncStorage persistence
feat: add search/filter notes by title and body
feat: add statistics counter persisted to AsyncStorage
feat: add delete all notes with confirmation
feat: add timestamp display on note cards
feat: add sorting by newest/oldest/alpha/done
style: improve UI with purple theme and dark mode support
```
