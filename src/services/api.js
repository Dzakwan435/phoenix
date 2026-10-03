// API Client Service for Frontend & Admin Communication

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('phoenix_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export const api = {
  // Public
  async getPublicData() {
    const res = await fetch(`${API_BASE}/public/data`);
    if (!res.ok) throw new Error('Gagal mengambil data landing page');
    return res.json();
  },

  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login gagal');
    localStorage.setItem('phoenix_admin_token', data.token);
    localStorage.setItem('phoenix_admin_user', JSON.stringify(data.user));
    return data;
  },

  async verifyAuth() {
    const token = localStorage.getItem('phoenix_admin_token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        localStorage.removeItem('phoenix_admin_token');
        localStorage.removeItem('phoenix_admin_user');
        return null;
      }
      return res.json();
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('phoenix_admin_token');
    localStorage.removeItem('phoenix_admin_user');
  },

  async changePassword(currentPassword, newPassword, newUsername) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword, newUsername })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengubah password');
    return data;
  },

  // Admin Data
  async getAdminData() {
    const res = await fetch(`${API_BASE}/admin/data`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Gagal mengambil data admin');
    return res.json();
  },

  // Settings
  async updateSettings(settingsData) {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settingsData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui pengaturan');
    return data;
  },

  // Works CRUD
  async addWork(workData) {
    const res = await fetch(`${API_BASE}/admin/works`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(workData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menambah proyek');
    return data;
  },

  async updateWork(id, workData) {
    const res = await fetch(`${API_BASE}/admin/works/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(workData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui proyek');
    return data;
  },

  async deleteWork(id) {
    const res = await fetch(`${API_BASE}/admin/works/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus proyek');
    return data;
  },

  async toggleWorkStatus(id) {
    const res = await fetch(`${API_BASE}/admin/works/toggle-status/${id}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengubah status proyek');
    return data;
  },

  async reorderWorks(orderArray) {
    const res = await fetch(`${API_BASE}/admin/works/reorder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ order: orderArray })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengubah urutan');
    return data;
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async addCategory(name) {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menambah kategori');
    return data;
  },

  async updateCategory(id, name, sort_order) {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, sort_order })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui kategori');
    return data;
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus kategori');
    return data;
  },

  // File Upload
  async uploadImage(file) {
    const token = localStorage.getItem('phoenix_admin_token');
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengunggah gambar');
    return data;
  },

  // Media Library
  async getMediaList() {
    const res = await fetch(`${API_BASE}/admin/media`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Backup & Reset
  async exportData() {
    const res = await fetch(`${API_BASE}/admin/export`, {
      headers: getAuthHeaders()
    });
    return res.blob();
  },

  async importData(jsonData) {
    const res = await fetch(`${API_BASE}/admin/import`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jsonData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengimpor backup');
    return data;
  },

  async resetData() {
    const res = await fetch(`${API_BASE}/admin/reset`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mereset database');
    return data;
  }
};
