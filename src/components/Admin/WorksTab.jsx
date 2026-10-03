import React, { useState, useMemo } from 'react';
import {
  FolderGit2, Plus, Search, Edit3, Trash2, ArrowUp, ArrowDown,
  Eye, EyeOff, Upload, Image as ImageIcon, Check, X, ExternalLink, RefreshCw
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from './Toast.jsx';

export default function WorksTab({ works, categories, onWorksUpdated }) {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    series: '',
    en: '',
    desc: '',
    src: '',
    link: '',
    is_active: 1
  });

  // Filtered works
  const filteredWorks = useMemo(() => {
    return works.filter(item => {
      const matchCategory = selectedCategory === 'ALL' || item.series === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        item.title?.toLowerCase().includes(q) ||
        item.series?.toLowerCase().includes(q) ||
        item.en?.toLowerCase().includes(q) ||
        item.desc?.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [works, selectedCategory, searchQuery]);

  const openAddModal = () => {
    setEditingWork(null);
    setFormData({
      title: '',
      series: categories[0]?.name || 'Web Apps',
      en: '',
      desc: '',
      src: 'images/web-01.jpg',
      link: '',
      is_active: 1
    });
    setModalOpen(true);
  };

  const openEditModal = (work) => {
    setEditingWork(work);
    setFormData({
      title: work.title || '',
      series: work.series || categories[0]?.name || 'Web Apps',
      en: work.en || '',
      desc: work.desc || '',
      src: work.src || '',
      link: work.link || '',
      is_active: work.is_active ? 1 : 0
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      setFormData(prev => ({ ...prev, src: res.url }));
      addToast('Foto proyek berhasil diunggah!', 'success');
    } catch (err) {
      addToast(err.message || 'Gagal mengunggah foto', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveWork = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.src || !formData.series) {
      addToast('Judul, Kategori, dan Foto Proyek wajib diisi', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingWork) {
        await api.updateWork(editingWork.id, formData);
        addToast('Proyek berhasil diperbarui!', 'success');
      } else {
        await api.addWork(formData);
        addToast('Proyek baru berhasil ditambahkan!', 'success');
      }
      setModalOpen(false);
      onWorksUpdated();
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan proyek', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteWork(id);
      addToast('Proyek berhasil dihapus', 'success');
      setDeleteConfirmId(null);
      onWorksUpdated();
    } catch (err) {
      addToast(err.message || 'Gagal menghapus proyek', 'error');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.toggleWorkStatus(id);
      addToast('Status proyek berhasil diperbarui', 'info');
      onWorksUpdated();
    } catch (err) {
      addToast(err.message || 'Gagal memperbarui status', 'error');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= works.length) return;

    const newWorksList = [...works];
    const temp = newWorksList[index];
    newWorksList[index] = newWorksList[targetIndex];
    newWorksList[targetIndex] = temp;

    const orderIds = newWorksList.map(w => w.id);
    try {
      await api.reorderWorks(orderIds);
      addToast('Urutan proyek diperbarui', 'info');
      onWorksUpdated();
    } catch (err) {
      addToast(err.message || 'Gagal memperbarui urutan', 'error');
    }
  };

  return (
    <div>
      {/* Header Bar */}
      <div className="admin-header-section">
        <div>
          <h2 className="admin-page-title">Manajemen Karya & Proyek</h2>
          <p className="admin-page-subtitle">
            Tambah, edit, hapus, upload gambar, dan atur urutan karya yang ditampilkan pada stage portofolio
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={16} /> Tambah Proyek Baru
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          backgroundColor: 'var(--admin-surface)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid var(--admin-border)'
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Cari judul, teknologi, atau deskripsi proyek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Filter Kategori:</label>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '160px' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">Semua Kategori ({works.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} ({works.filter(w => w.series === c.name).length})
              </option>
            ))}
          </select>

          <button onClick={onWorksUpdated} className="btn btn-secondary btn-icon" title="Refresh Data">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Works Table */}
      <div className="works-table-container">
        <table className="works-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>#</th>
              <th style={{ width: '70px' }}>Foto</th>
              <th>Judul Proyek</th>
              <th>Kategori / Series</th>
              <th>Teknologi / Subtitle</th>
              <th>Status</th>
              <th style={{ width: '110px', textAlign: 'center' }}>Urutan</th>
              <th style={{ width: '120px', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorks.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9ca3af' }}>
                  Tidak ada proyek yang sesuai dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              filteredWorks.map((work, idx) => {
                const originalIndex = works.findIndex(w => w.id === work.id);
                return (
                  <tr key={work.id}>
                    <td style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem' }}>
                      {idx + 1}
                    </td>
                    <td>
                      <img
                        src={work.src}
                        alt={work.title}
                        className="work-thumb"
                        onError={(e) => { e.target.src = 'images/web-01.jpg'; }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#ffffff' }}>{work.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {work.desc}
                      </div>
                      {work.link && (
                        <a
                          href={work.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.7rem', color: '#818cf8', display: 'inline-flex', alignItems: 'center', gap: 2, marginTop: 2 }}
                        >
                          <ExternalLink size={10} /> {work.link}
                        </a>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-series">{work.series}</span>
                    </td>
                    <td style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
                      {work.en}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(work.id)}
                        className={`badge ${work.is_active ? 'badge-active' : 'badge-draft'}`}
                        style={{ border: 'none', cursor: 'pointer' }}
                        title="Klik untuk mengubah status"
                      >
                        {work.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                        {work.is_active ? 'Aktif' : 'Draft'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.2rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.4rem' }}
                          disabled={originalIndex === 0}
                          onClick={() => handleMoveOrder(originalIndex, -1)}
                          title="Pindah ke Atas"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.4rem' }}
                          disabled={originalIndex === works.length - 1}
                          onClick={() => handleMoveOrder(originalIndex, 1)}
                          title="Pindah ke Bawah"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => openEditModal(work)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Proyek"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(work.id)}
                          className="btn btn-danger btn-sm"
                          title="Hapus Proyek"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add / Edit Work */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingWork ? 'Edit Proyek Portofolio' : 'Tambah Proyek Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveWork}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Judul Proyek *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Contoh: Pulseboard Dashboard"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Kategori / Series *</label>
                    <select
                      className="form-select"
                      value={formData.series}
                      onChange={(e) => setFormData(prev => ({ ...prev, series: e.target.value }))}
                      required
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Teknologi / Subtitle (Tag)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.en}
                      onChange={(e) => setFormData(prev => ({ ...prev, en: e.target.value }))}
                      placeholder="React · TypeScript · Tailwind"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Deskripsi Proyek</label>
                  <textarea
                    className="form-textarea"
                    value={formData.desc}
                    onChange={(e) => setFormData(prev => ({ ...prev, desc: e.target.value }))}
                    placeholder="Tuliskan gambaran singkat tentang proyek, fitur utama, arsitektur, atau hasil..."
                  />
                </div>

                {/* Image Uploader & Preview */}
                <div className="form-group">
                  <label className="form-label">Foto / Gambar Proyek *</label>
                  
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    {formData.src && (
                      <div style={{ width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--admin-border)', flexShrink: 0 }}>
                        <img
                          src={formData.src}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'images/web-01.jpg'; }}
                        />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <label
                        className="btn btn-secondary"
                        style={{ width: '100%', cursor: 'pointer', marginBottom: '0.5rem' }}
                      >
                        <Upload size={16} /> {uploading ? 'Mengunggah Foto...' : 'Upload File Gambar Baru'}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.src}
                        onChange={(e) => setFormData(prev => ({ ...prev, src: e.target.value }))}
                        placeholder="Path gambar (misal: uploads/nama-foto.jpg atau images/web-01.jpg)"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Link Proyek / Demo / GitHub (Opsional)</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="https://github.com/username/project"
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                  <input
                    type="checkbox"
                    id="is_active_toggle"
                    checked={formData.is_active === 1}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked ? 1 : 0 }))}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <label htmlFor="is_active_toggle" style={{ fontSize: '0.875rem', cursor: 'pointer', color: '#e5e7eb' }}>
                    Tampilkan proyek ini pada panggung 3D landing page (Aktif)
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                  <Check size={16} /> {saving ? 'Menyimpan...' : (editingWork ? 'Simpan Perubahan' : 'Tambahkan Proyek')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Konfirmasi Hapus</h3>
              <button onClick={() => setDeleteConfirmId(null)} className="modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#e5e7eb', fontSize: '0.9rem' }}>
                Apakah Anda yakin ingin menghapus proyek ini dari database? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setDeleteConfirmId(null)} className="btn btn-secondary">
                Batal
              </button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="btn btn-danger">
                Ya, Hapus Proyek
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
