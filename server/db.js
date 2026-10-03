import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { UI, WORKS } from '../src/content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data and uploads directories exist
const dataDir = path.resolve(__dirname, '../data');
const uploadsDir = path.resolve(__dirname, '../public/uploads');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'portfolio.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance
db.pragma('journal_mode = WAL');

export function initDatabase() {
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      site_title TEXT NOT NULL DEFAULT 'Alex Carter — Developer Portfolio',
      gallery_label TEXT NOT NULL DEFAULT 'Developer portfolio',
      directory_label TEXT NOT NULL DEFAULT 'Project index',
      contact_text TEXT NOT NULL DEFAULT 'Alex Carter · Full-Stack Developer · hello@alexcarter.dev · github.com/alexcarter',
      close_label TEXT NOT NULL DEFAULT 'Close',
      prev_label TEXT NOT NULL DEFAULT 'Previous project',
      next_label TEXT NOT NULL DEFAULT 'Next project',
      bg_color TEXT NOT NULL DEFAULT '#f7f9fc',
      ink_color TEXT NOT NULL DEFAULT '#161616',
      gray_color TEXT NOT NULL DEFAULT '#a8a8a2',
      theme_preset TEXT NOT NULL DEFAULT 'light',
      author_name TEXT NOT NULL DEFAULT 'Alex Carter',
      author_role TEXT NOT NULL DEFAULT 'Full-Stack Developer',
      author_email TEXT NOT NULL DEFAULT 'hello@alexcarter.dev',
      author_github TEXT NOT NULL DEFAULT 'https://github.com/alexcarter',
      author_linkedin TEXT NOT NULL DEFAULT 'https://linkedin.com/in/alexcarter',
      author_website TEXT NOT NULL DEFAULT 'https://alexcarter.dev',
      author_twitter TEXT NOT NULL DEFAULT '',
      skew_angle REAL NOT NULL DEFAULT -28.0,
      custom_css TEXT NOT NULL DEFAULT '',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS works (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      series TEXT NOT NULL,
      title TEXT NOT NULL,
      en TEXT NOT NULL DEFAULT '',
      desc TEXT NOT NULL DEFAULT '',
      src TEXT NOT NULL,
      link TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Initialize Default Settings if empty
  const settingCount = db.prepare('SELECT COUNT(*) as count FROM settings').get().count;
  if (settingCount === 0) {
    const insertSetting = db.prepare(`
      INSERT INTO settings (
        id, site_title, gallery_label, directory_label, contact_text,
        close_label, prev_label, next_label, bg_color, ink_color, gray_color,
        theme_preset, author_name, author_role, author_email, author_github,
        author_linkedin, author_website, author_twitter, skew_angle, custom_css
      ) VALUES (
        1, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        'light', 'Alex Carter', 'Full-Stack Developer', 'hello@alexcarter.dev', 'https://github.com/alexcarter',
        'https://linkedin.com/in/alexcarter', 'https://alexcarter.dev', '', -28.0, ''
      )
    `);
    insertSetting.run(
      'Alex Carter — Developer Portfolio',
      UI.gallery || 'Developer portfolio',
      UI.directory || 'Project index',
      UI.contact || 'Alex Carter · Full-Stack Developer · hello@alexcarter.dev · github.com/alexcarter',
      UI.close || 'Close',
      UI.previous || 'Previous project',
      UI.next || 'Next project',
      '#f7f9fc',
      '#161616',
      '#a8a8a2'
    );
  }

  // Initialize Default Categories & Works if empty
  const worksCount = db.prepare('SELECT COUNT(*) as count FROM works').get().count;
  if (worksCount === 0) {
    const distinctSeries = [...new Set(WORKS.map(w => w.series))];
    const insertCat = db.prepare('INSERT OR IGNORE INTO categories (name, sort_order) VALUES (?, ?)');
    distinctSeries.forEach((seriesName, idx) => {
      insertCat.run(seriesName, idx);
    });

    const insertWork = db.prepare(`
      INSERT INTO works (series, title, en, desc, src, link, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const insertMany = db.transaction((worksList) => {
      worksList.forEach((w, idx) => {
        insertWork.run(
          w.series || 'General',
          w.title || 'Untitled',
          w.en || '',
          w.desc || '',
          w.src || '',
          w.link || '',
          idx
        );
      });
    });

    insertMany(WORKS);
  }

  // Initialize Default Admin (admin / admin123) if empty
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get().count;
  if (adminCount === 0) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('admin123', salt);
    db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', passwordHash);
  }

  console.log('Database initialized successfully at:', dbPath);
}

// Database helper functions
export function getSettings() {
  return db.prepare('SELECT * FROM settings WHERE id = 1').get() || {};
}

export function updateSettings(data) {
  const fields = [
    'site_title', 'gallery_label', 'directory_label', 'contact_text',
    'close_label', 'prev_label', 'next_label', 'bg_color', 'ink_color',
    'gray_color', 'theme_preset', 'author_name', 'author_role',
    'author_email', 'author_github', 'author_linkedin', 'author_website',
    'author_twitter', 'skew_angle', 'custom_css'
  ];

  const updates = [];
  const values = [];

  for (const field of fields) {
    if (data[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (updates.length === 0) return getSettings();

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(1);

  const query = `UPDATE settings SET ${updates.join(', ')} WHERE id = ?`;
  db.prepare(query).run(...values);
  return getSettings();
}

export function getCategories() {
  return db.prepare('SELECT * FROM categories ORDER BY sort_order ASC, id ASC').all();
}

export function addCategory(name) {
  const maxOrder = db.prepare('SELECT MAX(sort_order) as maxOrder FROM categories').get().maxOrder || 0;
  const result = db.prepare('INSERT INTO categories (name, sort_order) VALUES (?, ?)').run(name.trim(), maxOrder + 1);
  return db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
}

export function updateCategory(id, name, sort_order) {
  if (name !== undefined && sort_order !== undefined) {
    db.prepare('UPDATE categories SET name = ?, sort_order = ? WHERE id = ?').run(name.trim(), sort_order, id);
  } else if (name !== undefined) {
    db.prepare('UPDATE categories SET name = ? WHERE id = ?').run(name.trim(), id);
  } else if (sort_order !== undefined) {
    db.prepare('UPDATE categories SET sort_order = ? WHERE id = ?').run(sort_order, id);
  }
  return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
}

export function deleteCategory(id) {
  const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  if (cat) {
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  }
  return { success: true };
}

export function getAllWorks(activeOnly = false) {
  const query = activeOnly
    ? 'SELECT * FROM works WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
    : 'SELECT * FROM works ORDER BY sort_order ASC, id ASC';
  return db.prepare(query).all();
}

export function getWorkById(id) {
  return db.prepare('SELECT * FROM works WHERE id = ?').get(id);
}

export function addWork(work) {
  const maxOrder = db.prepare('SELECT MAX(sort_order) as maxOrder FROM works').get().maxOrder || 0;
  const insert = db.prepare(`
    INSERT INTO works (series, title, en, desc, src, link, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    work.series || 'General',
    work.title || 'Untitled',
    work.en || '',
    work.desc || '',
    work.src || '',
    work.link || '',
    work.sort_order !== undefined ? work.sort_order : maxOrder + 1,
    work.is_active !== undefined ? (work.is_active ? 1 : 0) : 1
  );

  // Also ensure category exists
  if (work.series) {
    db.prepare('INSERT OR IGNORE INTO categories (name, sort_order) VALUES (?, ?)').run(work.series, 999);
  }

  return getWorkById(result.lastInsertRowid);
}

export function updateWork(id, work) {
  const fields = ['series', 'title', 'en', 'desc', 'src', 'link', 'sort_order', 'is_active'];
  const updates = [];
  const values = [];

  for (const field of fields) {
    if (work[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(field === 'is_active' ? (work[field] ? 1 : 0) : work[field]);
    }
  }

  if (updates.length === 0) return getWorkById(id);

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  db.prepare(`UPDATE works SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  if (work.series) {
    db.prepare('INSERT OR IGNORE INTO categories (name, sort_order) VALUES (?, ?)').run(work.series, 999);
  }

  return getWorkById(id);
}

export function deleteWork(id) {
  db.prepare('DELETE FROM works WHERE id = ?').run(id);
  return { success: true };
}

export function reorderWorks(orderArray) {
  // orderArray is array of IDs in new order: [3, 1, 2, 5, ...]
  const update = db.prepare('UPDATE works SET sort_order = ? WHERE id = ?');
  const updateMany = db.transaction((ids) => {
    ids.forEach((id, index) => {
      update.run(index, id);
    });
  });
  updateMany(orderArray);
  return getAllWorks();
}

export function toggleWorkStatus(id) {
  const work = getWorkById(id);
  if (!work) return null;
  const newStatus = work.is_active ? 0 : 1;
  db.prepare('UPDATE works SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, id);
  return getWorkById(id);
}

export function getAdminByUsername(username) {
  return db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
}

export function updateAdminPassword(username, newPassword, newUsername = null) {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(newPassword, salt);
  if (newUsername && newUsername.trim() !== '') {
    db.prepare('UPDATE admins SET username = ?, password_hash = ? WHERE username = ?').run(newUsername.trim(), passwordHash, username);
  } else {
    db.prepare('UPDATE admins SET password_hash = ? WHERE username = ?').run(passwordHash, username);
  }
  return { success: true };
}

export function exportAllData() {
  const settings = getSettings();
  const categories = getCategories();
  const works = getAllWorks();
  return {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    settings,
    categories,
    works
  };
}

export function importAllData(data) {
  if (!data || typeof data !== 'object') throw new Error('Invalid import data payload');

  if (data.settings) {
    updateSettings(data.settings);
  }

  if (Array.isArray(data.categories)) {
    db.exec('DELETE FROM categories');
    const insertCat = db.prepare('INSERT INTO categories (id, name, sort_order) VALUES (?, ?, ?)');
    const insertManyCat = db.transaction((cats) => {
      cats.forEach(c => {
        insertCat.run(c.id || null, c.name, c.sort_order || 0);
      });
    });
    insertManyCat(data.categories);
  }

  if (Array.isArray(data.works)) {
    db.exec('DELETE FROM works');
    const insertWork = db.prepare(`
      INSERT INTO works (id, series, title, en, desc, src, link, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertManyWorks = db.transaction((worksList) => {
      worksList.forEach(w => {
        insertWork.run(
          w.id || null,
          w.series || 'General',
          w.title || 'Untitled',
          w.en || '',
          w.desc || '',
          w.src || '',
          w.link || '',
          w.sort_order || 0,
          w.is_active !== undefined ? (w.is_active ? 1 : 0) : 1
        );
      });
    });
    insertManyWorks(data.works);
  }

  return { success: true };
}

export function resetToDefaults() {
  // Clear and re-populate
  db.exec('DELETE FROM works');
  db.exec('DELETE FROM categories');
  db.exec('DELETE FROM settings');

  // Insert default settings
  const insertSetting = db.prepare(`
    INSERT INTO settings (
      id, site_title, gallery_label, directory_label, contact_text,
      close_label, prev_label, next_label, bg_color, ink_color, gray_color,
      theme_preset, author_name, author_role, author_email, author_github,
      author_linkedin, author_website, author_twitter, skew_angle, custom_css
    ) VALUES (
      1, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      'light', 'Alex Carter', 'Full-Stack Developer', 'hello@alexcarter.dev', 'https://github.com/alexcarter',
      'https://linkedin.com/in/alexcarter', 'https://alexcarter.dev', '', -28.0, ''
    )
  `);
  insertSetting.run(
    'Alex Carter — Developer Portfolio',
    UI.gallery || 'Developer portfolio',
    UI.directory || 'Project index',
    UI.contact || 'Alex Carter · Full-Stack Developer · hello@alexcarter.dev · github.com/alexcarter',
    UI.close || 'Close',
    UI.previous || 'Previous project',
    UI.next || 'Next project',
    '#f7f9fc',
    '#161616',
    '#a8a8a2'
  );

  const distinctSeries = [...new Set(WORKS.map(w => w.series))];
  const insertCat = db.prepare('INSERT INTO categories (name, sort_order) VALUES (?, ?)');
  distinctSeries.forEach((seriesName, idx) => {
    insertCat.run(seriesName, idx);
  });

  const insertWork = db.prepare(`
    INSERT INTO works (series, title, en, desc, src, link, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);
  const insertMany = db.transaction((worksList) => {
    worksList.forEach((w, idx) => {
      insertWork.run(
        w.series || 'General',
        w.title || 'Untitled',
        w.en || '',
        w.desc || '',
        w.src || '',
        w.link || '',
        idx
      );
    });
  });
  insertMany(WORKS);

  return { success: true };
}

export default db;
