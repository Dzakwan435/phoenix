import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Copy, Check, RefreshCw, Eye, HardDrive } from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from './Toast.jsx';

export default function MediaTab() {
  const { addToast } = useToast();
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedSrc, setCopiedSrc] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const list = await api.getMediaList();
      setMediaList(list);
    } catch (err) {
      addToast('Gagal memuat galeri media', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await api.uploadImage(files[i]);
      }
      addToast(`${files.length} gambar berhasil diunggah!`, 'success');
      fetchMedia();
    } catch (err) {
      addToast(err.message || 'Gagal mengunggah file', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyPath = (src) => {
    navigator.clipboard.writeText(src);
    setCopiedSrc(src);
    addToast(`Path "${src}" disalin ke clipboard!`, 'info');
    setTimeout(() => setCopiedSrc(null), 2500);
  };

  return (
    <div>
      <div className="admin-header-section">
        <div>
          <h2 className="admin-page-title">Galeri Media & File Gambar</h2>
          <p className="admin-page-subtitle">
            Kelola dan unggah file foto karya yang siap digunakan pada landing page
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchMedia} className="btn btn-secondary">
            <RefreshCw size={16} /> Segarkan
          </button>
          <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
            <Upload size={16} /> {uploading ? 'Mengunggah...' : 'Upload Gambar Baru'}
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Upload Dropzone Banner */}
      <div
        style={{
          border: '2px dashed var(--admin-border)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'rgba(31, 41, 55, 0.3)',
          marginBottom: '2rem'
        }}
      >
        <ImageIcon size={36} style={{ color: '#818cf8', margin: '0 auto 0.75rem' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.35rem' }}>
          Tarik dan lepas gambar di sini atau klik tombol Upload di atas
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
          Format yang didukung: JPG, PNG, WEBP, SVG, GIF, AVIF (Maks. 20 MB per file)
        </p>
      </div>

      {/* Media Grid */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <HardDrive size={18} /> File Tersimpan ({mediaList.length})
          </h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
            Memuat daftar file...
          </div>
        ) : mediaList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
            Belum ada file media yang diunggah.
          </div>
        ) : (
          <div className="media-grid">
            {mediaList.map((item, idx) => (
              <div key={idx} className="media-item" onClick={() => handleCopyPath(item.src)}>
                <img
                  src={item.src}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => { e.target.src = 'images/web-01.jpg'; }}
                />
                <div className="media-item-info" title={item.src}>
                  {item.name}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '0.4rem',
                    right: '0.4rem',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    color: copiedSrc === item.src ? '#34d399' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  {copiedSrc === item.src ? <Check size={12} /> : <Copy size={12} />}
                  {copiedSrc === item.src ? 'Tersalin' : 'Salin Path'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
