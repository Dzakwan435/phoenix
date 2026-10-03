# 🚀 Panduan Lengkap Deployment & Admin Panel Portofolio

Selamat! Website Landing Page Portofolio interaktif ini kini telah dilengkapi dengan **Database (SQLite & MySQL ready)** serta **Halaman Admin Management (CMS)** untuk mengatur seluruh tampilan, warna, teks UI, kategori, dan proyek secara instan tanpa perlu menyentuh kode manual.

---

## 🔑 Kredensial Default Admin Panel

Untuk mengakses halaman pengaturan / admin:
1. Klik tombol floating **"⚙️ Atur Tampilan"** di pojok kanan bawah layar landing page, atau
2. Buka URL: `http://localhost:3001/#admin` (atau port yang Anda gunakan)
3. Masukkan kredensial default:
   - **Username**: `admin`
   - **Password**: `admin123`

> 💡 *Sangat disarankan untuk mengubah kata sandi dan username ini melalui menu **"Database & Akun"** setelah berhasil login.*

---

## 🛠️ Fitur Halaman Pengaturan (Admin CMS)

1. 📊 **Dashboard Ringkasan**:
   - Total proyek aktif vs draft.
   - Status database dan jumlah kategori.
   - Tabel pratinjau karya terbaru & tombol cepat lihat landing page.

2. 🎨 **Tampilan & Tema (Live Visual Customizer)**:
   - **Preset Tema Siap Pakai**: Clean Light, Obsidian Dark, Midnight Cyber, Warm Editorial, Nordic Slate, Forest Mist.
   - **Color Pickers**: Mengubah `--bg` (latar), `--ink` (teks utama), `--gray` (aksen) secara real-time.
   - **Sudut 3D Panggung**: Slider untuk mengatur sudut kemiringan kartu foto (-45° s/d -10°).
   - **Label UI & Header**: Mengatur judul situs browser, aria labels, tombol lightbox (Close, Prev, Next).
   - **Kontak & Media Sosial**: Mengatur nama pembuat, peran, email, link GitHub, LinkedIn, dan website.
   - **Custom CSS**: Injeksi kode styling kustom langsung ke landing page.

3. 📁 **Manajemen Proyek (Works CRUD)**:
   - Tambah, edit, dan hapus proyek portofolio.
   - Upload file foto langsung (JPG, PNG, WEBP, SVG, GIF, AVIF).
   - Fitur pencarian dan filter berdasarkan kategori.
   - Ubah status proyek: **Aktif** atau **Draft (Sembunyikan)**.
   - Atur urutan tampilan panggung dengan tombol **Naik (Up) / Turun (Down)**.
   - Dukungan tautan proyek/demo/repository luar.

4. 🏷️ **Kategori / Series**:
   - Tambah dan ubah nama kategori/grup proyek (misal: Web Apps, Open Source, Mobile Apps, Experiments, UI/UX, dsb.).

5. 🖼️ **Galeri Media (Media Manager)**:
   - Upload banyak gambar sekaligus.
   - Pratinjau semua gambar yang tersimpan dan fitur 1-klik untuk menyalin path gambar.

6. 🛡️ **Keamanan, Backup & Database**:
   - Ganti username dan password admin dengan enkripsi `bcrypt`.
   - **Unduh Cadangan (Export JSON)**: Simpan seluruh isi database portofolio dalam 1 file JSON.
   - **Pulihkan Data (Import JSON)**: Restore data dari file backup.
   - **Reset ke Default**: Kembalikan database ke format bawaan pabrik.

---

## 📦 Pilihan Opsi Deployment

### Opsi 1: Menjalankan di Server VPS / Node.js (Rekomendasi Utama)

Aplikasi telah menggunakan database **SQLite terintegrasi** (`data/portfolio.db`), sehingga tidak memerlukan instalasi server database eksternal terpisah!

1. Clone repositori ke server Anda:
   ```bash
   git clone <repo-url> phoenix
   cd phoenix
   ```

2. Pasang dependensi dan build aset frontend:
   ```bash
   npm install
   npm run build
   ```

3. Jalankan aplikasi menggunakan PM2 (Process Manager):
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name "phoenix-portfolio"
   pm2 save
   pm2 startup
   ```

4. Konfigurasi Reverse Proxy Nginx (Opsional / Rekomendasi):
   ```nginx
   server {
       listen 80;
       server_name domainanda.com;

       location / {
           proxy_pass http://127.0.0.1:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

### Opsi 2: Deploy Menggunakan Docker & Docker Compose

Jalankan seluruh aplikasi dengan 1 perintah:

```bash
docker compose up -d --build
```

Aplikasi akan otomatis berjalan di port `3001`. Data SQLite dan folder upload akan tersimpan secara persisten pada Docker volume.

---

### Opsi 3: Deploy ke Cloud PaaS (Railway / Render / Fly.io / Heroku)

1. Hubungkan repository GitHub Anda ke Railway atau Render.
2. Atur **Build Command**: `npm run build`
3. Atur **Start Command**: `npm start`
4. Tambahkan Environment Variable:
   - `PORT`: `3001` (atau otomatis dari penyedia)
   - `JWT_SECRET`: `kunci-rahasia-acak-anda`
   - `NODE_ENV`: `production`

---

### Opsi 4: Menggunakan Database MySQL / phpMyAdmin (Laragon / XAMPP / Shared Hosting)

Jika Anda ingin menggunakan database MySQL tradisional:
1. Buka phpMyAdmin atau MySQL CLI.
2. Buat database baru bernama `portfolio_db`.
3. Import file `database/schema.sql` untuk membuat tabel.
4. Import file `database/seed.sql` untuk mengisi data bawaan.

---

## 💻 Panduan Menjalankan di Lingkungan Lokal (Development)

Untuk pengembangan lokal:

1. Jalankan Backend Server (Port 3001):
   ```bash
   npm run server
   ```

2. Pada terminal terpisah, jalankan Vite Dev Server (Port 5173):
   ```bash
   npm run dev
   ```

3. Buka browser:
   - **Landing Page**: `http://localhost:5173`
   - **Admin Management**: `http://localhost:5173/#admin`

---

## 📁 Struktur Berkas Penting

```text
phoenix/
├── data/
│   └── portfolio.db        # File Database SQLite (otomatis dibuat)
├── database/
│   ├── schema.sql          # Skema Database SQL untuk MySQL/MariaDB
│   └── seed.sql            # Data Awal Portofolio SQL
├── server/
│   ├── index.js            # Express REST API Server
│   ├── db.js               # Database Connection & Query Helper
│   └── auth.js             # Autentikasi JWT & Enkripsi Bcrypt
├── src/
│   ├── components/Admin/   # Komponen Panel Pengaturan Admin
│   ├── services/api.js     # API Client Service
│   ├── App.jsx             # Root React Component & Routing
│   ├── gallery.js          # Interactive 3D Stage Engine
│   ├── admin.css           # Styling Admin Panel
│   └── styles.css          # Styling Landing Page
├── public/uploads/         # Tempat penyimpanan gambar yang di-upload
├── Dockerfile              # Konfigurasi Docker Container
├── docker-compose.yml      # Konfigurasi Docker Compose
└── DEPLOYMENT.md           # Panduan ini
```
