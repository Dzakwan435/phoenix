import React, { useState } from 'react';
import { Shield, Key, Download, Upload, RotateCcw, AlertTriangle, Check, Lock, Server } from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from './Toast.jsx';

export default function SecuritySettingsTab({ onDatabaseReset }) {
  const { addToast } = useToast();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Backup & Restore
  const [importing, setImporting] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast('Password saat ini dan password baru wajib diisi', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Password baru minimal 6 karakter', 'error');
      return;
    }

    setChangingPass(true);
    try {
      await api.changePassword(currentPassword, newPassword, newUsername);
      addToast('Kredensial admin berhasil diubah!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setNewUsername('');
    } catch (err) {
      addToast(err.message || 'Gagal mengubah password', 'error');
    } finally {
      setChangingPass(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      const blob = await api.exportData();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast('File cadangan database berhasil diunduh!', 'success');
    } catch (err) {
      addToast('Gagal mengunduh cadangan database', 'error');
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setImporting(true);
        const json = JSON.parse(event.target.result);
        await api.importData(json);
        addToast('Data backup berhasil diimpor ke database!', 'success');
        onDatabaseReset();
      } catch (err) {
        addToast(err.message || 'File JSON tidak valid atau rusak', 'error');
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = async () => {
    setResetting(true);
    try {
      await api.resetData();
      addToast('Database berhasil di-reset ke konfigurasi default!', 'success');
      setResetModalOpen(false);
      onDatabaseReset();
    } catch (err) {
      addToast(err.message || 'Gagal mereset database', 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div>
      <div className="admin-header-section">
        <div>
          <h2 className="admin-page-title">Keamanan, Akun & Database</h2>
          <p className="admin-page-subtitle">
            Ubah kata sandi admin, ekspor/impor cadangan data JSON, dan kelola database portofolio
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Change Password Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Key size={18} /> Ganti Kata Sandi & Username Admin
            </h3>
          </div>

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Username Baru (Opsional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Biarkan kosong jika tidak ingin mengubah username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password Saat Ini *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Masukkan password lama"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password Baru *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={changingPass}>
              <Check size={16} /> {changingPass ? 'Memperbarui...' : 'Perbarui Kredensial'}
            </button>
          </form>
        </div>

        {/* Database Backup & Restore Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Server size={18} /> Cadangan & Pemulihan Database
            </h3>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1rem' }}>
              Unduh seluruh konfigurasi landing page, warna, kategori, dan daftar proyek portofolio dalam 1 file JSON yang siap dipulihkan kapan saja.
            </p>

            <button onClick={handleExportBackup} className="btn btn-secondary" style={{ width: '100%', marginBottom: '1rem' }}>
              <Download size={16} /> Unduh Backup Database (JSON)
            </button>

            <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer' }}>
              <Upload size={16} /> {importing ? 'Mengimpor...' : 'Pulihkan Database dari File JSON'}
              <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleImportBackup}
                disabled={importing}
              />
            </label>
          </div>

          <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ef4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={15} /> Zona Bahaya
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.75rem' }}>
              Kembalikan semua proyek, tema, dan label ke format awal sistem.
            </p>
            <button onClick={() => setResetModalOpen(true)} className="btn btn-danger" style={{ width: '100%' }}>
              <RotateCcw size={16} /> Reset ke Pengaturan Awal (Default)
            </button>
          </div>
        </div>
      </div>

      {/* SQL Deployment Info Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <Shield size={18} /> Informasi Deployment & Database SQL
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
          Aplikasi ini dirancang siap deploy di mana saja:
        </p>
        <ul style={{ fontSize: '0.85rem', color: '#9ca3af', paddingLeft: '1.25rem', lineHeight: '1.7' }}>
          <li><strong>Zero-Config Deployment (Node.js/VPS/Railway/Docker)</strong>: Menggunakan SQLite bawaan di <code>data/portfolio.db</code> secara otomatis tanpa perlu setup database luar.</li>
          <li><strong>MySQL / Laragon / XAMPP Deployment</strong>: Skrip database SQL tersedia di folder <code>database/schema.sql</code> dan <code>database/seed.sql</code> untuk di-import langsung ke phpMyAdmin / MySQL.</li>
          <li><strong>Production Server Command</strong>: Jalankan <code>npm run build</code> lalu <code>node server/index.js</code> atau <code>npm start</code> untuk menjalankan aplikasi di port yang ditentukan.</li>
        </ul>
      </div>

      {/* Reset Confirmation Modal */}
      {resetModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} /> Konfirmasi Reset Database
              </h3>
            </div>
            <div className="modal-body">
              <p style={{ color: '#e5e7eb', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                Apakah Anda benar-benar yakin ingin mereset seluruh database portofolio ke konfigurasi default pabrik?
              </p>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                Semua proyek baru dan kustomisasi warna akan dikembalikan ke data awal. Pastikan Anda telah mengunduh file backup terlebih dahulu jika diperlukan.
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setResetModalOpen(false)} className="btn btn-secondary">
                Batal
              </button>
              <button onClick={handleFactoryReset} className="btn btn-danger" disabled={resetting}>
                {resetting ? 'Mereset...' : 'Ya, Reset Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
