import React, { useState } from 'react';
import { Palette, Sparkles, Check, Save, RotateCcw, Sliders, Type, Mail, Globe, Code } from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from './Toast.jsx';

const THEME_PRESETS = [
  {
    id: 'light',
    name: 'Clean Light',
    bg: '#f7f9fc',
    ink: '#161616',
    gray: '#a8a8a2'
  },
  {
    id: 'dark',
    name: 'Obsidian Dark',
    bg: '#0f172a',
    ink: '#f8fafc',
    gray: '#64748b'
  },
  {
    id: 'midnight',
    name: 'Midnight Cyber',
    bg: '#090d16',
    ink: '#06b6d4',
    gray: '#475569'
  },
  {
    id: 'sand',
    name: 'Warm Editorial',
    bg: '#fbf8f3',
    ink: '#2d2424',
    gray: '#8c7e74'
  },
  {
    id: 'slate',
    name: 'Nordic Slate',
    bg: '#1e293b',
    ink: '#f1f5f9',
    gray: '#94a3b8'
  },
  {
    id: 'forest',
    name: 'Forest Mist',
    bg: '#0d1f1c',
    ink: '#e2f5ee',
    gray: '#4e7368'
  }
];

export default function AppearanceTab({ settings, onSettingsUpdated }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    site_title: settings.site_title || 'Alex Carter — Developer Portfolio',
    gallery_label: settings.gallery_label || 'Developer portfolio',
    directory_label: settings.directory_label || 'Project index',
    contact_text: settings.contact_text || 'Alex Carter · Full-Stack Developer · hello@alexcarter.dev · github.com/alexcarter',
    close_label: settings.close_label || 'Close',
    prev_label: settings.prev_label || 'Previous project',
    next_label: settings.next_label || 'Next project',
    bg_color: settings.bg_color || '#f7f9fc',
    ink_color: settings.ink_color || '#161616',
    gray_color: settings.gray_color || '#a8a8a2',
    theme_preset: settings.theme_preset || 'light',
    author_name: settings.author_name || 'Alex Carter',
    author_role: settings.author_role || 'Full-Stack Developer',
    author_email: settings.author_email || 'hello@alexcarter.dev',
    author_github: settings.author_github || 'https://github.com/alexcarter',
    author_linkedin: settings.author_linkedin || 'https://linkedin.com/in/alexcarter',
    author_website: settings.author_website || 'https://alexcarter.dev',
    author_twitter: settings.author_twitter || '',
    skew_angle: settings.skew_angle || -28,
    custom_css: settings.custom_css || ''
  });

  const [saving, setSaving] = useState(false);

  const handlePresetSelect = (preset) => {
    setFormData(prev => ({
      ...prev,
      theme_preset: preset.id,
      bg_color: preset.bg,
      ink_color: preset.ink,
      gray_color: preset.gray
    }));
    addToast(`Preset tema "${preset.name}" diterapkan`, 'info');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Sync contact text helper from individual fields
  const handleAutoGenerateContact = () => {
    const parts = [
      formData.author_name,
      formData.author_role,
      formData.author_email,
      formData.author_github ? formData.author_github.replace(/^https?:\/\//, '') : ''
    ].filter(Boolean);
    const combined = parts.join(' · ');
    setFormData(prev => ({ ...prev, contact_text: combined }));
    addToast('Teks kontak footer berhasil dibuat otomatis', 'info');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateSettings(formData);
      onSettingsUpdated(res.settings);
      addToast('Pengaturan tampilan berhasil disimpan ke database!', 'success');
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan pengaturan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div className="admin-header-section">
        <div>
          <h2 className="admin-page-title">Pengaturan Tampilan & Tema</h2>
          <p className="admin-page-subtitle">
            Sesuaikan palet warna visual, teks label UI, kontak footer, dan sudut 3D landing page
          </p>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Color Palette & Themes Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Palette size={18} /> Tema & Palet Warna Visual
            </h3>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} /> Pilihan Preset Tema Cepat
            </label>
            <div className="theme-presets-grid">
              {THEME_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className={`theme-preset-card ${formData.theme_preset === preset.id ? 'selected' : ''}`}
                  onClick={() => handlePresetSelect(preset)}
                >
                  <div className="theme-swatches">
                    <div className="theme-swatch" style={{ backgroundColor: preset.bg }}></div>
                    <div className="theme-swatch" style={{ backgroundColor: preset.ink }}></div>
                    <div className="theme-swatch" style={{ backgroundColor: preset.gray }}></div>
                  </div>
                  <span className="theme-preset-name">{preset.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Warna Background (--bg)</label>
              <div className="color-picker-row">
                <input
                  type="color"
                  className="color-picker-box"
                  value={formData.bg_color}
                  onChange={(e) => handleChange('bg_color', e.target.value)}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{ fontFamily: 'monospace' }}
                  value={formData.bg_color}
                  onChange={(e) => handleChange('bg_color', e.target.value)}
                />
              </div>
              <p className="form-hint">Warna dasar panggung 3D dan latar belakang halaman</p>
            </div>

            <div className="form-group">
              <label className="form-label">Warna Teks Utama (--ink)</label>
              <div className="color-picker-row">
                <input
                  type="color"
                  className="color-picker-box"
                  value={formData.ink_color}
                  onChange={(e) => handleChange('ink_color', e.target.value)}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{ fontFamily: 'monospace' }}
                  value={formData.ink_color}
                  onChange={(e) => handleChange('ink_color', e.target.value)}
                />
              </div>
              <p className="form-hint">Warna judul, daftar teks portofolio, dan elemen utama</p>
            </div>

            <div className="form-group">
              <label className="form-label">Warna Aksen / Muted (--gray)</label>
              <div className="color-picker-row">
                <input
                  type="color"
                  className="color-picker-box"
                  value={formData.gray_color}
                  onChange={(e) => handleChange('gray_color', e.target.value)}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{ fontFamily: 'monospace' }}
                  value={formData.gray_color}
                  onChange={(e) => handleChange('gray_color', e.target.value)}
                />
              </div>
              <p className="form-hint">Warna subjudul kategori, garis footer, dan label sekunder</p>
            </div>
          </div>

          {/* Live Color Preview Swatch */}
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: formData.bg_color,
              color: formData.ink_color,
              border: `1px solid ${formData.gray_color}`
            }}
          >
            <div style={{ fontSize: '0.8rem', color: formData.gray_color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Preview Palet Warna
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '0.2rem' }}>
              {formData.site_title}
            </div>
            <div style={{ fontSize: '0.8rem', color: formData.gray_color, marginTop: '0.2rem' }}>
              {formData.contact_text}
            </div>
          </div>
        </div>

        {/* Site Header & UI Labels */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Type size={18} /> Judul & Label Teks UI
            </h3>
          </div>

          <div className="form-group">
            <label className="form-label">Judul Situs / Header Browser</label>
            <input
              type="text"
              className="form-input"
              value={formData.site_title}
              onChange={(e) => handleChange('site_title', e.target.value)}
              placeholder="Contoh: Alex Carter — Developer Portfolio"
              required
            />
            <p className="form-hint">Akan tampil pada judul tab browser (title tag)</p>
          </div>

          <div className="form-group">
            <label className="form-label">Label Galeri (Aria Label)</label>
            <input
              type="text"
              className="form-input"
              value={formData.gallery_label}
              onChange={(e) => handleChange('gallery_label', e.target.value)}
              placeholder="Developer portfolio"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Label Index Proyek Sidebar</label>
            <input
              type="text"
              className="form-input"
              value={formData.directory_label}
              onChange={(e) => handleChange('directory_label', e.target.value)}
              placeholder="Project index"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Tombol Close</label>
              <input
                type="text"
                className="form-input"
                value={formData.close_label}
                onChange={(e) => handleChange('close_label', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tombol Prev</label>
              <input
                type="text"
                className="form-input"
                value={formData.prev_label}
                onChange={(e) => handleChange('prev_label', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tombol Next</label>
              <input
                type="text"
                className="form-input"
                value={formData.next_label}
                onChange={(e) => handleChange('next_label', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Sliders size={14} style={{ display: 'inline', marginRight: 4 }} /> Sudut Kemiringan 3D Stage (Skew Angle)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="range"
                min="-45"
                max="-10"
                step="1"
                value={formData.skew_angle}
                onChange={(e) => handleChange('skew_angle', parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontFamily: 'monospace', fontWeight: '600', width: '50px' }}>
                {formData.skew_angle}°
              </span>
            </div>
            <p className="form-hint">Sudut kemiringan diagonal kartu foto (default: -28°)</p>
          </div>
        </div>
      </div>

      {/* Contact & Social Links */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <Mail size={18} /> Profil & Informasi Kontak Footer
          </h3>
          <button type="button" onClick={handleAutoGenerateContact} className="btn btn-secondary btn-sm">
            Generate Format Footer Otomatis
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap / Studio</label>
            <input
              type="text"
              className="form-input"
              value={formData.author_name}
              onChange={(e) => handleChange('author_name', e.target.value)}
              placeholder="Alex Carter"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Profesi / Keahlian</label>
            <input
              type="text"
              className="form-input"
              value={formData.author_role}
              onChange={(e) => handleChange('author_role', e.target.value)}
              placeholder="Full-Stack Developer"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Kontak</label>
            <input
              type="email"
              className="form-input"
              value={formData.author_email}
              onChange={(e) => handleChange('author_email', e.target.value)}
              placeholder="hello@alexcarter.dev"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">GitHub URL</label>
            <input
              type="url"
              className="form-input"
              value={formData.author_github}
              onChange={(e) => handleChange('author_github', e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">LinkedIn URL</label>
            <input
              type="url"
              className="form-input"
              value={formData.author_linkedin}
              onChange={(e) => handleChange('author_linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Website Portofolio URL</label>
            <input
              type="url"
              className="form-input"
              value={formData.author_website}
              onChange={(e) => handleChange('author_website', e.target.value)}
              placeholder="https://yourdomain.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Teks Kontak Lengkap pada Footer Halaman</label>
          <input
            type="text"
            className="form-input"
            value={formData.contact_text}
            onChange={(e) => handleChange('contact_text', e.target.value)}
            placeholder="Alex Carter · Full-Stack Developer · hello@alexcarter.dev · github.com/alexcarter"
            required
          />
          <p className="form-hint">Teks yang akan muncul di baris bawah layar landing page</p>
        </div>
      </div>

      {/* Custom CSS (Advanced) */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <Code size={18} /> Custom CSS Kustom (Opsional)
          </h3>
        </div>
        <div className="form-group">
          <textarea
            className="form-textarea"
            style={{ fontFamily: 'monospace', minHeight: '120px' }}
            value={formData.custom_css}
            onChange={(e) => handleChange('custom_css', e.target.value)}
            placeholder="/* Masukkan CSS tambahan Anda di sini jika diperlukan */"
          />
          <p className="form-hint">CSS ini akan otomatis diinjeksi langsung pada landing page.</p>
        </div>
      </div>

      {/* Save Button Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          <Save size={16} /> {saving ? 'Menyimpan ke Database...' : 'Simpan Semua Perubahan'}
        </button>
      </div>
    </form>
  );
}
