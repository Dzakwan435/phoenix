import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Palette, FolderGit2, Layers, Image as ImageIcon,
  Shield, ExternalLink, LogOut, RefreshCw, Sparkles, User
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from './Toast.jsx';

import DashboardTab from './DashboardTab.jsx';
import AppearanceTab from './AppearanceTab.jsx';
import WorksTab from './WorksTab.jsx';
import CategoriesTab from './CategoriesTab.jsx';
import MediaTab from './MediaTab.jsx';
import SecuritySettingsTab from './SecuritySettingsTab.jsx';

export default function AdminLayout({ onExitAdmin, onOpenAddModal }) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState({
    settings: {},
    works: [],
    categories: [],
    stats: {}
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminData();
      setAdminData(data);
    } catch (err) {
      addToast(err.message || 'Gagal memuat data dari database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    api.logout();
    addToast('Anda telah keluar dari Admin Panel', 'info');
    onExitAdmin();
  };

  return (
    <div className="admin-wrapper">
      {/* Top Navbar */}
      <header className="admin-navbar">
        <div className="admin-logo-group">
          <div className="admin-logo-icon">P</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="admin-logo-text">Phoenix Portfolio</span>
              <span className="admin-logo-badge">Admin CMS</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="admin-tabs-container">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`admin-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`admin-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
          >
            <Palette size={16} /> Tampilan & Tema
          </button>
          <button
            onClick={() => setActiveTab('works')}
            className={`admin-tab-btn ${activeTab === 'works' ? 'active' : ''}`}
          >
            <FolderGit2 size={16} /> Proyek ({adminData.works?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          >
            <Layers size={16} /> Kategori
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`admin-tab-btn ${activeTab === 'media' ? 'active' : ''}`}
          >
            <ImageIcon size={16} /> Media
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`admin-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          >
            <Shield size={16} /> Database & Akun
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="admin-nav-actions">
          <button onClick={onExitAdmin} className="btn btn-secondary btn-sm" title="Lihat Tampilan Landing Page">
            <ExternalLink size={14} /> Lihat Landing Page
          </button>
          <button onClick={handleLogout} className="btn btn-danger btn-sm" title="Keluar">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-main">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#9ca3af' }}>
            <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <p>Memuat data dari database...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardTab
                stats={adminData.stats}
                settings={adminData.settings}
                categories={adminData.categories}
                works={adminData.works}
                onNavigateTab={setActiveTab}
                onOpenAddModal={() => setActiveTab('works')}
                onPreviewLanding={onExitAdmin}
              />
            )}

            {activeTab === 'appearance' && (
              <AppearanceTab
                settings={adminData.settings}
                onSettingsUpdated={(newSettings) => {
                  setAdminData(prev => ({ ...prev, settings: newSettings }));
                }}
              />
            )}

            {activeTab === 'works' && (
              <WorksTab
                works={adminData.works}
                categories={adminData.categories}
                onWorksUpdated={fetchAdminData}
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesTab
                categories={adminData.categories}
                works={adminData.works}
                onCategoriesUpdated={fetchAdminData}
              />
            )}

            {activeTab === 'media' && <MediaTab />}

            {activeTab === 'security' && (
              <SecuritySettingsTab onDatabaseReset={fetchAdminData} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
