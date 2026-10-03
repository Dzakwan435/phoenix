import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import {
  initDatabase,
  getSettings,
  updateSettings,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getAllWorks,
  getWorkById,
  addWork,
  updateWork,
  deleteWork,
  reorderWorks,
  toggleWorkStatus,
  exportAllData,
  importAllData,
  resetToDefaults
} from './db.js';

import {
  authenticateToken,
  handleLogin,
  handleVerifyAuth,
  handleChangePassword
} from './auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Initialize database
initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static directories
const uploadsDir = path.join(rootDir, 'public/uploads');
const imagesDir = path.join(rootDir, 'images');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve public uploads and local images
app.use('/uploads', express.static(uploadsDir));
app.use('/images', express.static(imagesDir));
app.use('/public', express.static(path.join(rootDir, 'public')));

// Multer storage for uploaded media
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg|avif/;
    const ext = path.extname(file.originalname).toLowerCase().substring(1);
    const mime = file.mimetype.toLowerCase();
    if (allowedTypes.test(ext) || mime.startsWith('image/')) {
      return cb(null, true);
    }
    cb(new Error('Hanya file gambar (JPG, PNG, GIF, WebP, SVG, AVIF) yang diperbolehkan!'));
  }
});

// ==========================================
// PUBLIC API ENDPOINTS (For Landing Page)
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public landing page payload
app.get('/api/public/data', (req, res) => {
  try {
    const settings = getSettings();
    const works = getAllWorks(true); // only active items
    const categories = getCategories();

    // Map into frontend UI format
    const ui = {
      gallery: settings.gallery_label,
      directory: settings.directory_label,
      close: settings.close_label,
      previous: settings.prev_label,
      next: settings.next_label,
      contact: settings.contact_text
    };

    res.json({
      settings,
      ui,
      works,
      categories
    });
  } catch (error) {
    console.error('Error fetching public data:', error);
    res.status(500).json({ error: 'Gagal memuat data landing page' });
  }
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
app.post('/api/auth/login', handleLogin);
app.get('/api/auth/me', authenticateToken, handleVerifyAuth);
app.post('/api/auth/change-password', authenticateToken, handleChangePassword);

// ==========================================
// ADMIN PROTECTED ROUTES
// ==========================================

// Get full admin dashboard data (including drafts, settings, categories)
app.get('/api/admin/data', authenticateToken, (req, res) => {
  try {
    const settings = getSettings();
    const works = getAllWorks(false);
    const categories = getCategories();
    res.json({
      settings,
      works,
      categories,
      stats: {
        totalWorks: works.length,
        activeWorks: works.filter(w => w.is_active === 1).length,
        draftWorks: works.filter(w => w.is_active === 0).length,
        totalCategories: categories.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Settings
app.put('/api/admin/settings', authenticateToken, (req, res) => {
  try {
    const updated = updateSettings(req.body);
    res.json({ message: 'Pengaturan berhasil disimpan', settings: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Works CRUD
app.get('/api/admin/works', authenticateToken, (req, res) => {
  try {
    const works = getAllWorks(false);
    res.json(works);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/works', authenticateToken, (req, res) => {
  try {
    const newWork = addWork(req.body);
    res.status(201).json({ message: 'Proyek berhasil ditambahkan', work: newWork });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/works/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = updateWork(id, req.body);
    res.json({ message: 'Proyek berhasil diperbarui', work: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/works/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    deleteWork(id);
    res.json({ message: 'Proyek berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/works/reorder', authenticateToken, (req, res) => {
  try {
    const { order } = req.body; // array of IDs in new order
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'Data order harus berupa array id' });
    }
    const works = reorderWorks(order);
    res.json({ message: 'Urutan proyek berhasil diperbarui', works });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/works/toggle-status/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = toggleWorkStatus(id);
    res.json({ message: 'Status proyek diperbarui', work: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Categories CRUD
app.get('/api/admin/categories', authenticateToken, (req, res) => {
  try {
    const categories = getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/categories', authenticateToken, (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nama kategori wajib diisi' });
    }
    const cat = addCategory(name);
    res.status(201).json({ message: 'Kategori berhasil ditambahkan', category: cat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/categories/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, sort_order } = req.body;
    const cat = updateCategory(id, name, sort_order);
    res.json({ message: 'Kategori berhasil diperbarui', category: cat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/categories/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    deleteCategory(id);
    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Image Upload
app.post('/api/admin/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada file gambar yang diunggah.' });
    }
    const fileUrl = `uploads/${req.file.filename}`;
    res.json({
      message: 'Gambar berhasil diunggah',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Media Library list
app.get('/api/admin/media', authenticateToken, (req, res) => {
  try {
    const mediaFiles = [];

    // Read uploads directory
    if (fs.existsSync(uploadsDir)) {
      const uploadFiles = fs.readdirSync(uploadsDir);
      uploadFiles.forEach(f => {
        const fullPath = path.join(uploadsDir, f);
        const stats = fs.statSync(fullPath);
        if (stats.isFile()) {
          mediaFiles.push({
            name: f,
            src: `uploads/${f}`,
            type: 'uploaded',
            size: stats.size,
            updatedAt: stats.mtime
          });
        }
      });
    }

    // Read default images directory
    if (fs.existsSync(imagesDir)) {
      const imgFiles = fs.readdirSync(imagesDir);
      imgFiles.forEach(f => {
        const fullPath = path.join(imagesDir, f);
        const stats = fs.statSync(fullPath);
        if (stats.isFile()) {
          mediaFiles.push({
            name: f,
            src: `images/${f}`,
            type: 'system',
            size: stats.size,
            updatedAt: stats.mtime
          });
        }
      });
    }

    res.json(mediaFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export database
app.get('/api/admin/export', authenticateToken, (req, res) => {
  try {
    const data = exportAllData();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=portfolio_backup_${Date.now()}.json`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import database
app.post('/api/admin/import', authenticateToken, (req, res) => {
  try {
    importAllData(req.body);
    res.json({ message: 'Data backup berhasil diimpor ke database' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Factory reset
app.post('/api/admin/reset', authenticateToken, (req, res) => {
  try {
    resetToDefaults();
    res.json({ message: 'Database berhasil di-reset ke pengaturan default' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// PRODUCTION FRONTEND SERVING
// ==========================================
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/') && !req.path.startsWith('/uploads/') && !req.path.startsWith('/images/')) {
      return res.sendFile(path.join(distDir, 'index.html'));
    }
    next();
  });
}

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`========================================`);
  console.log(`🚀 Portfolio Server running at: http://localhost:${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📁 Database: SQLite in data/portfolio.db`);
  console.log(`========================================`);
});
