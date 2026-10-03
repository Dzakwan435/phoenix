import React from 'react';
import { Layout, Palette, FolderGit2, Image, Shield, ExternalLink, Plus, CheckCircle, Clock } from 'lucide-react';

export default function DashboardTab({ stats, settings, categories, works, onNavigateTab, onOpenAddModal, onPreviewLanding }) {
  return (
    <div>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '16px',
          padding: '1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem'
        }}
      >
        <div>
          <span className="badge badge-active" style={{ marginBottom: '0.5rem' }}>
            <CheckCircle size={12} /> Siap untuk Deploy
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.35rem' }}>
            Selamat Datang di Admin Panel Portofolio
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', maxWidth: '650px' }}>
            Kelola semua konten landing page, karya portofolio, palet warna visual, kategori, serta database portofolio Anda secara real-time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={onPreviewLanding} className="btn btn-secondary">
            <ExternalLink size={16} /> Lihat Landing Page
          </button>
          <button onClick={onOpenAddModal} className="btn btn-primary">
            <Plus size={16} /> Tambah Proyek Baru
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-grid">
        <div className="admin-card" style={{ cursor: 'pointer' }} onClick={() => onNavigateTab('works')}>
          <div className="admin-card-header">
            <span style={{ color: '#818cf8', fontWeight: '600', fontSize: '0.85rem' }}>Total Proyek</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <FolderGit2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.25rem' }}>
            {stats?.totalWorks || works.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
            <span style={{ color: '#34d399', fontWeight: '600' }}>{stats?.activeWorks || works.filter(w => w.is_active).length} aktif</span> · {stats?.draftWorks || works.filter(w => !w.is_active).length} draft
          </div>
        </div>

        <div className="admin-card" style={{ cursor: 'pointer' }} onClick={() => onNavigateTab('categories')}>
          <div className="admin-card-header">
            <span style={{ color: '#22d3ee', fontWeight: '600', fontSize: '0.85rem' }}>Kategori / Series</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}>
              <Layout size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.25rem' }}>
            {categories.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
            {categories.map(c => c.name).slice(0, 3).join(', ')}{categories.length > 3 ? '...' : ''}
          </div>
        </div>

        <div className="admin-card" style={{ cursor: 'pointer' }} onClick={() => onNavigateTab('appearance')}>
          <div className="admin-card-header">
            <span style={{ color: '#f59e0b', fontWeight: '600', fontSize: '0.85rem' }}>Tema Tampilan</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <Palette size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.45rem', textTransform: 'capitalize' }}>
            {settings.theme_preset || 'Default Light'}
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: settings.bg_color || '#f7f9fc', border: '1px solid #4b5563' }}></span>
            <span style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: settings.ink_color || '#161616', border: '1px solid #4b5563' }}></span>
            <span style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: settings.gray_color || '#a8a8a2', border: '1px solid #4b5563' }}></span>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '0.25rem' }}>Warna kustom aktif</span>
          </div>
        </div>

        <div className="admin-card" style={{ cursor: 'pointer' }} onClick={() => onNavigateTab('security')}>
          <div className="admin-card-header">
            <span style={{ color: '#34d399', fontWeight: '600', fontSize: '0.85rem' }}>Status Database</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <Shield size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#34d399', marginBottom: '0.25rem' }}>
            SQLite (Aktif)
          </div>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
            Siap deploy / Backup tersedia
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem' }}>
          Menu Pengaturan Cepat
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <button
            onClick={() => onNavigateTab('appearance')}
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'inherit'
            }}
          >
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
              <Palette size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem' }}>
                Atur Tampilan & Warna
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Ubah judul, warna background, teks kontak, dan sudut 3D
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('works')}
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'inherit'
            }}
          >
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>
              <FolderGit2 size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem' }}>
                Kelola Proyek & Foto
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Tambah karya baru, edit deskripsi, upload foto, urutkan
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('media')}
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'inherit'
            }}
          >
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6' }}>
              <Image size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem' }}>
                Galeri Media / Uploads
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Upload gambar baru dan kelola aset foto portofolio
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('security')}
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'inherit'
            }}
          >
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
              <Shield size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem' }}>
                Keamanan & Backup
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Ganti password admin, unduh backup JSON, reset database
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Projects Preview */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <FolderGit2 size={18} /> Proyek Terbaru
          </h3>
          <button onClick={() => onNavigateTab('works')} className="btn btn-secondary btn-sm">
            Lihat Semua Proyek ({works.length})
          </button>
        </div>

        <div className="works-table-container">
          <table className="works-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Foto</th>
                <th>Judul Proyek</th>
                <th>Kategori / Series</th>
                <th>Tech Stack / Subtitle</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {works.slice(0, 6).map((work) => (
                <tr key={work.id}>
                  <td>
                    <img src={work.src} alt={work.title} className="work-thumb" />
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#ffffff' }}>{work.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {work.desc}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-series">{work.series}</span>
                  </td>
                  <td style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
                    {work.en}
                  </td>
                  <td>
                    {work.is_active ? (
                      <span className="badge badge-active">Aktif</span>
                    ) : (
                      <span className="badge badge-draft">Draft</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
