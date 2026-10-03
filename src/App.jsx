import { useEffect, useState, useRef, useCallback } from 'react';
import { UI as DEFAULT_UI, WORKS as DEFAULT_WORKS } from './content.js';
import { initializeGallery } from './gallery.js';
import { api } from './services/api.js';
import AdminLayout from './components/Admin/AdminLayout.jsx';
import LoginModal from './components/Admin/LoginModal.jsx';
import { ToastProvider } from './components/Admin/Toast.jsx';
import './admin.css';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(
    window.location.hash === '#admin' ||
    window.location.hash === '#dashboard' ||
    window.location.hash === '#login' ||
    window.location.pathname.includes('/admin')
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [landingData, setLandingData] = useState({
    works: DEFAULT_WORKS,
    ui: DEFAULT_UI,
    settings: {
      site_title: 'Alex Carter — Developer Portfolio',
      contact_text: DEFAULT_UI.contact,
      bg_color: '#f7f9fc',
      ink_color: '#161616',
      gray_color: '#a8a8a2'
    }
  });

  const longPressTimerRef = useRef(null);
  const keySequenceRef = useRef('');
  const keySequenceTimerRef = useRef(null);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const handleOpenAdmin = useCallback(async () => {
    try {
      const verified = await api.verifyAuth();
      if (verified && verified.authenticated) {
        setCurrentUser(verified.user);
        window.location.hash = '#admin';
        setIsAdminView(true);
      } else {
        setIsLoginModalOpen(true);
      }
    } catch {
      setIsLoginModalOpen(true);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    window.location.hash = '#admin';
    setIsAdminView(true);
  };

  const handleExitAdmin = () => {
    window.location.hash = '';
    setIsAdminView(false);
  };

  // Verify auth on start
  useEffect(() => {
    api.verifyAuth().then(res => {
      if (res && res.authenticated) {
        setCurrentUser(res.user);
      }
    }).catch(() => {});

    // Check hash changes
    const onHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#dashboard' || hash === '#login') {
        handleOpenAdmin();
      } else {
        setIsAdminView(false);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [handleOpenAdmin]);

  // Expose stealth console helper methods
  useEffect(() => {
    window.admin = handleOpenAdmin;
    window.openAdmin = handleOpenAdmin;
    window.dashboard = handleOpenAdmin;

    console.info(
      '%c Phoenix Portfolio %c Dashboard Access: Press [Ctrl+Shift+A], type "admin", or triple-click the footer text. ',
      'background: #4f46e5; color: #ffffff; font-weight: bold; border-radius: 4px 0 0 4px; padding: 2px 6px;',
      'background: #1f2937; color: #93c5fd; border-radius: 0 4px 4px 0; padding: 2px 6px;'
    );

    return () => {
      delete window.admin;
      delete window.openAdmin;
      delete window.dashboard;
    };
  }, [handleOpenAdmin]);

  // Global Keyboard Shortcuts & Keystroke Sequence Listener
  useEffect(() => {
    if (isAdminView) return;

    const handleKeyDown = (e) => {
      // Ignore shortcut if user is typing in an input/textarea
      const tag = e.target.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

      const isMac = navigator.platform?.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // 1. Hotkey: Ctrl+Shift+A / Cmd+Shift+A (Admin)
      // 2. Hotkey: Ctrl+Shift+D / Cmd+Shift+D (Dashboard)
      // 3. Hotkey: Ctrl+K / Cmd+K (Command trigger)
      // 4. Hotkey: Alt+A
      if (
        (isCmdOrCtrl && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (isCmdOrCtrl && e.shiftKey && (e.key === 'D' || e.key === 'd')) ||
        (isCmdOrCtrl && (e.key === 'k' || e.key === 'K')) ||
        (e.altKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        handleOpenAdmin();
        return;
      }

      // Secret Typed Word Sequence (e.g. typing "admin" or "login" anywhere)
      if (e.key && e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        keySequenceRef.current += e.key.toLowerCase();
        if (keySequenceRef.current.length > 10) {
          keySequenceRef.current = keySequenceRef.current.slice(-10);
        }

        if (
          keySequenceRef.current.endsWith('admin') ||
          keySequenceRef.current.endsWith('login') ||
          keySequenceRef.current.endsWith('dash')
        ) {
          keySequenceRef.current = '';
          handleOpenAdmin();
        }

        // Reset sequence after 2.5 seconds of inactivity
        if (keySequenceTimerRef.current) clearTimeout(keySequenceTimerRef.current);
        keySequenceTimerRef.current = setTimeout(() => {
          keySequenceRef.current = '';
        }, 2500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (keySequenceTimerRef.current) clearTimeout(keySequenceTimerRef.current);
    };
  }, [isAdminView, handleOpenAdmin]);

  // Fetch Public Data
  useEffect(() => {
    let isMounted = true;
    api.getPublicData()
      .then(data => {
        if (isMounted && data) {
          setLandingData({
            works: data.works && data.works.length > 0 ? data.works : DEFAULT_WORKS,
            ui: data.ui || DEFAULT_UI,
            settings: data.settings || {}
          });
        }
      })
      .catch(err => {
        console.warn('Backend API offline, using fallback defaults:', err);
      });
    return () => { isMounted = false; };
  }, [isAdminView]);

  // Initialize Gallery when Landing view is active
  useEffect(() => {
    if (!isAdminView) {
      const cleanup = initializeGallery(landingData.works, landingData.ui, landingData.settings);
      return cleanup;
    }
  }, [isAdminView, landingData]);

  // Secret gesture: Triple-click handler on Footer
  const handleFooterClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      handleOpenAdmin();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 700);
    }
  };

  // Secret gesture: Long-press on Footer for Mobile/Touch devices
  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      handleOpenAdmin();
    }, 1200); // 1.2s long press
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  if (isAdminView) {
    return (
      <ToastProvider>
        <AdminLayout
          onExitAdmin={handleExitAdmin}
          currentUser={currentUser}
        />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <main className="stage" id="stage" aria-label={landingData.ui.gallery}></main>

      <aside className="work-list" id="work-list" aria-label={landingData.ui.directory}></aside>

      <div className="lightbox" id="lightbox" aria-hidden="true">
        <div className="lightbox-inner" id="lightbox-inner">
          <figure className="lightbox-figure" id="lightbox-figure">
            <img id="lightbox-img" alt="" />
          </figure>
          <div className="lightbox-gap"></div>
          <div className="lightbox-meta">
            <span className="lb-series" id="lb-series"></span>
            <h2 className="lb-title" id="lb-title"></h2>
            <span className="lb-en" id="lb-en"></span>
            <p className="lb-desc" id="lb-desc"></p>
            <div id="lb-link-container"></div>
            <span className="lb-index" id="lb-index"></span>
          </div>
        </div>
        <button className="lightbox-close" id="lightbox-close" aria-label={landingData.ui.close}>&times;</button>
        <button className="lb-side lb-side-prev" id="lb-prev" aria-label={landingData.ui.previous}>&#8249;</button>
        <button className="lb-side lb-side-next" id="lb-next" aria-label={landingData.ui.next}>&#8250;</button>
      </div>

      {/* Clean Footer with stealth Easter Egg gesture (Triple-click & Long-press) */}
      <footer
        className="site-footer"
        onClick={handleFooterClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{ cursor: 'default', userSelect: 'none' }}
        title=""
      >
        <span className="footer-line"></span>
        <span className="footer-text">{landingData.ui.contact}</span>
        <span className="footer-line"></span>
      </footer>

      {/* Invisible Stealth Hotspot at Bottom-Right Corner (Triple-click target) */}
      <div
        onClick={handleFooterClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '44px',
          height: '44px',
          zIndex: 40,
          cursor: 'default',
          opacity: 0,
          pointerEvents: 'auto'
        }}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          if (window.location.hash === '#admin' || window.location.hash === '#dashboard' || window.location.hash === '#login') {
            window.location.hash = '';
          }
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </ToastProvider>
  );
}
