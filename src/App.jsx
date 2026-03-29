import React, { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  CheckSquare,
  Database,
  Clock,
  Users,
  Settings,
  Search,
  Wallet,
  Calendar as CalendarIcon,
  Layers,
  Plus,
  CreditCard,
  Lock,
  ChevronLeft,
  Home,
  LogOut,
  Bell,
  X,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles
} from 'lucide-react'
import './index.css'
import Config from './components/Config'
import LogoDark from './logopngHF.png'
import LogoWhite from './logoblancohf.png'

/**
 * HFworkers Hub - Dashboard & Links Portal
 * Simplified version without Supabase/Login dependencies.
 */
function App() {
  // --- Persistent State (LocalStorage) ---
  const [lang, setLang] = useState(() => localStorage.getItem('hf_lang') || 'es')
  const [theme, setTheme] = useState(() => localStorage.getItem('hf_theme') || 'dark')
  const [guiSize, setGuiSize] = useState(() => localStorage.getItem('hf_guiSize') || 'default')
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem('hf_compactMode') === 'true')
  
  // --- UI State ---
  const [currentView, setCurrentView] = useState('dashboard') // Start with Dashboard Summary
  const [isTransitioning, setIsTransitioning] = useState(false)

  // --- Theme Sync ---
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('hf_theme', theme)
    
    if (theme === 'light') {
      root.style.setProperty('--bg', '#F5F5F7');
      root.style.setProperty('--surface', '#FFFFFF');
      root.style.setProperty('--primary', '#000000');
      root.style.setProperty('--text', '#1D1D1F');
      root.style.setProperty('--text-muted', 'rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--glass-bg', 'rgba(0, 0, 0, 0.05)');
      root.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--grad-start', '#FFFFFF');
      root.style.setProperty('--grad-end', '#F5F5F7');
    } else if (theme === 'glass-emerald') {
      root.style.setProperty('--bg', '#064E3B');
      root.style.setProperty('--surface', '#065F46');
      root.style.setProperty('--primary', '#ECFDF5');
      root.style.setProperty('--text', '#ECFDF5');
      root.style.setProperty('--text-muted', 'rgba(236, 253, 245, 0.6)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.15)');
      root.style.setProperty('--grad-start', '#065F46');
      root.style.setProperty('--grad-end', '#064E3B');
    } else if (theme === 'glass-midnight') {
      root.style.setProperty('--bg', '#0F172A');
      root.style.setProperty('--surface', '#1E293B');
      root.style.setProperty('--primary', '#F1F5F9');
      root.style.setProperty('--text', '#F1F5F9');
      root.style.setProperty('--text-muted', 'rgba(241, 245, 249, 0.6)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.05)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.10)');
      root.style.setProperty('--grad-start', '#1E293B');
      root.style.setProperty('--grad-end', '#0F172A');
    } else {
      root.style.setProperty('--bg', '#131313');
      root.style.setProperty('--surface', '#1a1a1a');
      root.style.setProperty('--primary', '#FFFFFF');
      root.style.setProperty('--text', '#FFFFFF');
      root.style.setProperty('--text-muted', 'rgba(255, 255, 255, 0.6)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.05)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--grad-start', '#1f1f1f');
      root.style.setProperty('--grad-end', '#131313');
    }

    const scale = guiSize === 'small' ? '0.9' : guiSize === 'large' ? '1.1' : '1';
    root.style.setProperty('--gui-scale', scale);
    root.style.zoom = scale;
    localStorage.setItem('hf_guiSize', guiSize)
  }, [theme, guiSize]);

  useEffect(() => {
    localStorage.setItem('hf_lang', lang)
  }, [lang])

  useEffect(() => {
    localStorage.setItem('hf_compactMode', compactMode)
  }, [compactMode])

  // --- Translations ---
  const translations = {
    es: { 
      portal: 'Portal Editorial', welcome: 'Acceso Centralizado a los Flujos de Trabajo HFworkers',
      upcoming: 'Estatus Proyecto', pending: 'Online', received: 'Eventos', 
      settings: 'Ajustes', logout: 'Recargar', adjusts: 'Configuración',
      enter: 'Entrar al Ecosistema', overview: 'Dashboard Resumen',      nav: { dashboard: 'Resumen', tasks: 'Sheets', drive: 'Drive', payments: 'Pagos', hours: 'Horas', rols: 'Rols', whatsapp: 'WhatsApp' }
    },
    en: { 
      portal: 'Editorial Portal', welcome: 'Centralized Access to HFworkers Workflows',
      upcoming: 'Project Status', pending: 'Online', received: 'Events', 
      settings: 'Settings', logout: 'Reload', adjusts: 'Configuration',
      enter: 'Enter Ecosystem', overview: 'Dashboard Overview',
      nav: { dashboard: 'Overview', tasks: 'Sheets', drive: 'Drive', payments: 'Payments', hours: 'Hours', rols: 'Rols', whatsapp: 'WhatsApp' }
    },
    fr: { 
      portal: 'Portail Éditorial', welcome: 'Accès Centralisé aux Flux de Travail HFworkers',
      upcoming: 'Statut du Projet', pending: 'En ligne', received: 'Événements', 
      settings: 'Réglages', logout: 'Recharger', adjusts: 'Configuration',
      enter: 'Entrer dans l\'Écosystème', overview: 'Tableau de Bord',
      nav: { dashboard: 'Aperçu', tasks: 'Sheets', drive: 'Drive', payments: 'Paiements', hours: 'Heures', rols: 'Rols', whatsapp: 'WhatsApp' }
    }
  };
  const t = translations[lang] || translations.en;
  const currentLogo = (theme === 'dark' || theme === 'glass-midnight' || theme === 'glass-emerald') ? LogoWhite : LogoDark;

  // --- Static Link Data ---
  const apps = [
    { id: 'tasks', name: t.nav.tasks, icon: <CheckSquare size={28} />, externalUrl: 'https://docs.google.com/spreadsheets/d/1V8Qr-sGKDM8Ate3vviCqD12_tCD2x-z2' },
    { id: 'drive', name: t.nav.drive, icon: <Database size={28} />, externalUrl: 'https://drive.google.com/drive/folders/1V8Qr-sGKDM8Ate3vviCqD12_tCD2x-z2?usp=sharing' },
    { id: 'whatsapp', name: t.nav.whatsapp, icon: <MessageSquare size={28} />, externalUrl: 'https://chat.whatsapp.com/EP1y8LTICMeBan9oCEiDSp?mode=gi_t' },
  ]

  const handleExternalNav = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const navigateTo = (view) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentView(view)
      setIsTransitioning(false)
    }, 200)
  }

  // --- Views ---
  const renderContent = () => {
    if (currentView === 'home') return null; // Home is the Grid view

    switch (currentView) {
      case 'settings':
        return (
          <Config 
            theme={theme} setTheme={setTheme} 
            lang={lang} setLang={setLang} 
            guiSize={guiSize} setGuiSize={setGuiSize}
            compactMode={compactMode} setCompactMode={setCompactMode}
            onLogout={() => window.location.reload()}
          />
        )
      case 'dashboard':
      default:
        return (
          <div className="dashboard-view" style={{ animation: 'fadeIn 0.5s ease', padding: '0 20px' }}>
            <div className="dashboard-content" style={{ animation: 'fadeIn 0.5s ease', padding: '0 20px', maxWidth: '800px', margin: '0 auto' }}>
              <header className="portal-header" style={{ marginBottom: '40px', textAlign: 'center' }}>
                <div className="portal-title">
                  <h1 className="display" style={{ fontSize: '48px', marginBottom: '16px', letterSpacing: '-0.02em' }}>{t.portal}</h1>
                  <p style={{ fontSize: '18px', opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>{t.welcome}</p>
                </div>
              </header>

              <div className="card" style={{ padding: '40px', background: 'linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%)', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                  <div style={{ marginBottom: '30px' }}>
                     <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: 'fit-content', margin: '0 auto 25px' }}>
                        <Sparkles size={42} color="var(--primary)" />
                     </div>
                     <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '15px' }}>{lang === 'es' ? 'Bienvenido al Portal' : 'Welcome to the Portal'}</h2>
                     <p style={{ opacity: 0.8, lineHeight: '1.6', fontSize: '16px', maxWidth: '400px', margin: '0 auto' }}>
                        {lang === 'es' 
                          ? 'Accede a tus recursos y herramientas de trabajo de forma rápida y segura desde este panel central.'
                          : 'Quickly and securely access your work resources and tools from this central dashboard.'}
                     </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                     <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: '11px', fontWeight: '800', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sessions</p>
                        <div style={{ fontSize: '22px', fontWeight: '800' }}>Active</div>
                     </div>
                     <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: '11px', fontWeight: '800', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Privacy</p>
                        <div style={{ fontSize: '22px', fontWeight: '800' }}>L3-AES</div>
                     </div>
                  </div>

                  <button 
                    onClick={() => navigateTo('home')}
                    style={{ 
                      width: '100%', padding: '22px', 
                      borderRadius: '24px', background: 'var(--primary)', 
                      color: 'var(--bg)', fontWeight: '900', fontSize: '18px',
                      border: 'none', cursor: 'pointer', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', gap: '12px',
                      transition: '0.3s'
                    }}
                    className="enter-btn"
                  >
                    <span>{t.enter}</span>
                    <ArrowRight size={20} />
                  </button>
              </div>

              {/* Quick Contact Card */}
              <div className="card" onClick={() => handleExternalNav('https://chat.whatsapp.com/EP1y8LTICMeBan9oCEiDSp?mode=gi_t')} style={{ padding: '30px', cursor: 'pointer', background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: 'white', marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <MessageSquare size={32} />
                  <div>
                    <h3 style={{ fontWeight: '800', fontSize: '20px' }}>{lang === 'es' ? 'Grupo WhatsApp' : 'WhatsApp Group'}</h3>
                    <p style={{ opacity: 0.8, fontSize: '14px' }}>{lang === 'es' ? 'Soporte editorial directo' : 'Direct editorial support'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={`ios-container theme-${theme}`} style={{ 
      '--primary': (theme || '').startsWith('glass') ? '#4ade80' : '#FFFFFF',
      opacity: isTransitioning ? 0 : 1,
      transition: 'opacity 0.2s ease'
    }}>
      
      {/* Premium Mobile Header for iOS / PWA */}
      <header className="mobile-only-header">
        <img src={currentLogo} alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
      </header>

      {/* Sidebar for Desktop */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigateTo('dashboard')} style={{ cursor: 'pointer', padding: '20px 0', marginBottom: '45px', textAlign: 'center' }}>
          <img src={currentLogo} alt="HFworkers" style={{ height: '70px', objectFit: 'contain' }} />
        </div>
        <nav style={{ flex: 1 }}>
          <div className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => navigateTo('dashboard')}>
            <LayoutDashboard size={20} />
            <span>{t.nav.dashboard}</span>
          </div>
          {apps.map((app, i) => (
            <div key={i} className={`nav-item`} onClick={() => handleExternalNav(app.externalUrl)}>
              {React.cloneElement(app.icon, { size: 20 })}
              <span>{app.name}</span>
            </div>
          ))}
        </nav>
        <div className={`nav-item ${currentView === 'settings' ? 'active' : ''}`} onClick={() => navigateTo('settings')}>
          <Settings size={20} />
          <span>{t.settings}</span>
        </div>
        <div className="nav-item" onClick={() => window.location.reload()} style={{ marginTop: '10px', color: '#f87171' }}>
          <LogOut size={20} />
          <span>{t.logout}</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`main-portal ${currentView !== 'home' ? 'active-view' : ''}`}>
        {currentView !== 'home' && (
           <div className="mobile-nav-bar">
              <button 
                className="back-btn"
                onClick={() => navigateTo('home')} 
              >
                <ChevronLeft size={24} />
                <span>Ecosistema</span>
              </button>
              <div className="mobile-view-title display">
                {currentView === 'dashboard' ? t.overview : currentView === 'settings' ? t.settings : ''}
              </div>
             <button className="header-action-btn" onClick={() => navigateTo('dashboard')}>
                <Home size={20} />
              </button>
           </div>
        )}
        <div className="content-scrollable">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Home Screen (Springboard) */}
      {currentView === 'home' && (
        <div className="home-screen" style={{ animation: 'zoomIn 0.4s ease' }}>
          <div className="home-grid">
            {apps.map(app => (
              <div key={app.id} className="app-icon-wrapper" onClick={() => handleExternalNav(app.externalUrl)}>
                <div className="app-icon">
                  {React.cloneElement(app.icon, { size: 32 })}
                </div>
                <span className="app-label">{app.name}</span>
              </div>
            ))}
            <div className="app-icon-wrapper" onClick={() => navigateTo('settings')}>
              <div className="app-icon" style={{ background: 'linear-gradient(135deg, #8e8e93 0%, #3a3a3c 100%)' }}>
                <Settings size={32} />
              </div>
              <span className="app-label">{t.adjusts}</span>
            </div>
          </div>
          
          <div className="dock">
             {[
               { id: 'drive', icon: <Database size={28} />, url: 'https://drive.google.com/drive/folders/1V8Qr-sGKDM8Ate3vviCqD12_tCD2x-z2?usp=sharing' },
               { id: 'whatsapp', icon: <MessageSquare size={28} />, url: 'https://chat.whatsapp.com/EP1y8LTICMeBan9oCEiDSp?mode=gi_t' },
               { id: 'settings', icon: <Settings size={28} />, view: 'settings' }
             ].map(item => (
               <div key={item.id} className="dock-icon" onClick={() => item.url ? handleExternalNav(item.url) : navigateTo(item.view)}>
                 {item.icon}
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Mobile Home Indicator */}
      <div className="home-indicator" onClick={() => navigateTo('home')} />

      <style>{`
        .enter-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 30px rgba(255,255,255,0.1);
        }
        .mobile-nav-bar {
          display: none;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid var(--glass-border);
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 200;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 2px;
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 500;
          font-size: 16px;
          cursor: pointer;
        }
        .header-action-btn {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .content-scrollable {
          flex: 1;
          overflow-y: auto;
          padding: 40px 0;
        }
        .active-view {
          display: flex !important;
          flex-direction: column;
          background: var(--bg);
          z-index: 150 !important;
        }
        @media (max-width: 1023px) {
          .mobile-nav-bar { display: flex; }
          .main-portal { height: 100vh; width: 100vw; }
          .content-scrollable { padding: 20px 0; }
        }
        @keyframes zoomIn { from { opacity: 0; transform: scale(1.1); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  )
}

export default App
