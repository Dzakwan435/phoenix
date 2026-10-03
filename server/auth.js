import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getAdminByUsername, updateAdminPassword } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'phoenix-portfolio-super-secret-key-2026';
const JWT_EXPIRES_IN = '7d';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Akses ditolak: Token otentikasi tidak ditemukan.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token kadaluarsa atau tidak valid.' });
    }
    req.user = user;
    next();
  });
}

export function handleLogin(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi.' });
  }

  const admin = getAdminByUsername(username);
  if (!admin) {
    return res.status(401).json({ error: 'Username atau password salah.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, admin.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Username atau password salah.' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return res.json({
    message: 'Login berhasil',
    token,
    user: {
      id: admin.id,
      username: admin.username
    }
  });
}

export function handleVerifyAuth(req, res) {
  return res.json({
    authenticated: true,
    user: req.user
  });
}

export function handleChangePassword(req, res) {
  const { currentPassword, newPassword, newUsername } = req.body;
  const currentUsername = req.user.username;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Password saat ini dan password baru wajib diisi.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password baru minimal 6 karakter.' });
  }

  const admin = getAdminByUsername(currentUsername);
  if (!admin) {
    return res.status(404).json({ error: 'Admin tidak ditemukan.' });
  }

  const isPasswordValid = bcrypt.compareSync(currentPassword, admin.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Password saat ini salah.' });
  }

  updateAdminPassword(currentUsername, newPassword, newUsername);

  return res.json({
    message: 'Kredensial admin berhasil diperbarui.'
  });
}
