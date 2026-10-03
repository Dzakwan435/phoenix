import React, { useState } from 'react';
import { Layout, Plus, Edit3, Trash2, Check, X, Layers } from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from './Toast.jsx';

export default function CategoriesTab({ categories, works, onCategoriesUpdated }) {
  const { addToast } = useToast();
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setLoading(true);
    try {
      await api.addCategory(newCatName.trim());
      addToast(`Kategori "${newCatName}" berhasil ditambahkan!`, 'success');
      setNewCatName('');
      onCategoriesUpdated();
    } catch (err) {
      addToast(err.message || 'Gagal menambah kategori', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await api.updateCategory(id, editName.trim());
      addToast('Kategori berhasil diperbarui', 'success');
      setEditingId(null);
      onCategoriesUpdated();
    } catch (err) {
      addToast(err.message || 'Gagal memperbarui kategori', 'error');
    }
  };

  const handleDeleteCategory = async (cat) => {
    const count = works.filter(w => w.series === cat.name).length;
    if (count > 0) {
      const confirmDelete = window.confirm(
        `Kategori "${cat.name}" sedang digunakan oleh ${count} proyek. Tetap hapus kategori ini?`
      );
      if (!confirmDelete) return;
    }

    try {
      await api.deleteCategory(cat.id);
      addToast(`Kategori "${cat.name}" berhasil dihapus`, 'success');
      onCategoriesUpdated();
    } catch (err) {
      addToast(err.message || 'Gagal menghapus kategori', 'error');
    }
  };

  return (
    <div>
      <div className="admin-header-section">
        <div>
          <h2 className="admin-page-title">Manajemen Kategori / Series</h2>
          <p className="admin-page-subtitle">
            Atur nama grup kategori karya yang muncul di sidebar dan pembagian seri panggung portofolio
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Add Category Form Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Plus size={18} /> Tambah Kategori Baru
            </h3>
          </div>

          <form onSubmit={handleAddCategory}>
            <div className="form-group">
              <label className="form-label">Nama Kategori / Series</label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: AI & Machine Learning"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
              />
              <p className="form-hint">Kategori akan otomatis muncul sebagai opsi saat menambah proyek baru.</p>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              <Plus size={16} /> {loading ? 'Menambahkan...' : 'Tambahkan Kategori'}
            </button>
          </form>
        </div>

        {/* Existing Categories List Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Layers size={18} /> Daftar Kategori Aktif ({categories.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {categories.map((cat) => {
              const projectCount = works.filter(w => w.series === cat.name).length;
              const isEditing = editingId === cat.id;

              return (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--admin-card)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    gap: '0.75rem'
                  }}
                >
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                      <input
                        type="text"
                        className="form-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => handleSaveEdit(cat.id)} className="btn btn-success btn-sm">
                        <Check size={14} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-sm">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '0.95rem' }}>
                          {cat.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          {projectCount} proyek terdaftar
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => startEdit(cat)}
                          className="btn btn-secondary btn-sm"
                          title="Ubah Nama Kategori"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="btn btn-danger btn-sm"
                          title="Hapus Kategori"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
