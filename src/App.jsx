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
  MessageSquare
} from 'lucide-react'
import './index.css'
import TaskBoard from './components/TaskBoard'
import InvestmentDB from './components/InvestmentDB'
import HoursTracker from './components/HoursTracker'
import Rols from './components/Rols'
import Payments from './components/Payments'
import Config from './components/Config'
import Login from './components/Login'
import { supabase } from './lib/supabase'
import LogoDark from './logopngHF.png'
import LogoWhite from './logoblancohf.png'

function App() {
  const [session, setSession] = useState(null)
  const [lang, setLang] = useState('es')
  const [currentView, setCurrentView] = useState(window.innerWidth > 1023 ? 'dashboard' : 'home')
  const [activeCall, setActiveCall] = useState(null)

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session) setSession(data.session)
    }
    initSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Global Alert Listener
    const channel = supabase.channel('global-alerts')
      .on('broadcast', { event: 'call_requested' }, (payload) => {
        if (session && payload.payload.workerId === session.user.id) {
          setActiveCall(payload.payload)
          // Play sound if possible
          try {
             const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
             audio.play();
          } catch(e) {}
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [session])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }
  
  // Settings State
  const [theme, setTheme] = useState('dark')
  const [guiSize, setGuiSize] = useState('default')
  const [compactMode, setCompactMode] = useState(false)
  
  const translations = {
    es: { 
      portal: 'Portal Editorial', welcome: 'Bienvenido de nuevo al ecosistema de gestión HFworkers',
      upcoming: 'Próximas Tareas', pending: 'Pendientes', received: 'Eventos', 
      settings: 'Configuración', logout: 'Cerrar Sesión', adjusts: 'Ajustes',
      nav: { dashboard: 'Dashboard', tasks: 'Tareas', investments: 'Inversiones', payments: 'Pagos', hours: 'Horas', rols: 'Rols', calendar: 'Calendario' }
    },
    en: { 
      portal: 'Editorial Portal', welcome: 'Welcome back to the HFworkers management ecosystem',
      upcoming: 'Upcoming Tasks', pending: 'Pending', received: 'Events', 
      settings: 'Settings', logout: 'Sign Out', adjusts: 'Settings',
      nav: { dashboard: 'Dashboard', tasks: 'Tasks', investments: 'Investments', payments: 'Payments', hours: 'Hours', rols: 'Rols', calendar: 'Calendar' }
    },
    fr: { 
      portal: 'Portail Éditorial', welcome: 'Bienvenue dans l\'écosystème de gestión HFworkers',
      upcoming: 'Tâches à Venir', pending: 'En attente', received: 'Événements', 
      settings: 'Configuration', logout: 'Déconnexion', adjusts: 'Réglages',
      nav: { dashboard: 'Tableau de bord', tasks: 'Tâches', investments: 'Investissements', payments: 'Paiements', hours: 'Heures', rols: 'Rols', calendar: 'Calendrier' }
    }
  };
  const t = translations[lang] || translations.en;

  const [counts, setCounts] = useState({ tasks: 0, events: 0 })

  useEffect(() => {
    if (session) {
      loadSettings()
      fetchCounts()
    }
  }, [session])

  useEffect(() => {
    if (session && currentView === 'dashboard') {
      fetchCounts()
    }
  }, [currentView])

  const loadSettings = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('theme, lang, gui_size, compact_mode')
      .eq('id', session.user.id)
      .single()
    
    if (data) {
      if (data.theme) setTheme(data.theme)
      if (data.lang) setLang(data.lang)
      if (data.gui_size) setGuiSize(data.gui_size)
      if (data.compact_mode !== undefined) setCompactMode(data.compact_mode)
    }
  }

  const fetchCounts = async () => {
    const { count: tCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .neq('status', 'Finalizado')

    setCounts({ tasks: tCount || 0, events: 0 })
  }

  const updateSetting = async (key, val) => {
    if (!session) return
    await supabase
      .from('profiles')
      .update({ [key]: val })
      .eq('id', session.user.id)
  }

  const handleSetTheme = (v) => { setTheme(v); updateSetting('theme', v); }
  const handleSetLang = (v) => { setLang(v); updateSetting('lang', v); }
  const handleSetGuiSize = (v) => { setGuiSize(v); updateSetting('gui_size', v); }
  const handleSetCompactMode = (v) => { setCompactMode(v); updateSetting('compact_mode', v); }

  const goHome = () => {
    setCurrentView(window.innerWidth > 1023 ? 'dashboard' : 'home')
  }

  useEffect(() => {
    const root = document.documentElement;
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
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
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

  }, [theme, guiSize]);
  
  const currentLogo = (theme === 'dark' || theme === 'glass-midnight' || theme === 'glass-emerald') ? LogoWhite : LogoDark;

  const apps = [
    { id: 'dashboard', name: t.nav.dashboard, icon: <LayoutDashboard size={28} /> },
    { id: 'tasks', name: t.nav.tasks, icon: <CheckSquare size={28} /> },
    { id: 'rols', name: t.nav.rols, icon: <Users size={28} /> },
    { id: 'investments', name: t.nav.investments, icon: <Database size={28} /> },
    { id: 'payments', name: t.nav.payments, icon: <Wallet size={28} /> },
    { id: 'hours', name: t.nav.hours, icon: <Clock size={28} /> },
  ]

  const renderContent = () => {
    if (currentView === 'home') return null;

    switch (currentView) {
      case 'tasks': return <TaskBoard lang={lang} />
      case 'investments': return <InvestmentDB lang={lang} />
      case 'hours': return <HoursTracker lang={lang} />
      case 'rols': return <Rols lang={lang} />
      case 'payments': return <Payments lang={lang} />
      case 'settings': return <Config 
          theme={theme} setTheme={handleSetTheme} 
          lang={lang} setLang={handleSetLang} 
          guiSize={guiSize} setGuiSize={handleSetGuiSize}
          compactMode={compactMode} setCompactMode={handleSetCompactMode}
          onLogout={handleLogout}
        />
      case 'dashboard':
      default:
        return (
          <div className="dashboard-view" style={{ animation: 'fadeIn 0.5s ease' }}>
            <header className="portal-header" style={{ marginBottom: '60px' }}>
              <div className="portal-title">
                <h1 className="display" style={{ fontSize: '42px', marginBottom: '16px' }}>{t.portal}</h1>
                <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{t.welcome}</p>
              </div>
            </header>

            <div className="dashboard-grid">
              {[
                { id: 'tasks', icon: <CheckSquare size={20} />, label: t.upcoming, val: counts.tasks.toString(), sub: t.pending }
              ].map(card => (
                <div key={card.id} className="card" onClick={() => setCurrentView(card.id)} style={{ cursor: 'pointer', padding: compactMode ? '20px' : '30px' }}>
                  <div className="card-header" style={{ marginBottom: '15px' }}>
                    {card.icon}
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{card.label}</span>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: card.color }}>{card.val}</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{card.sub}</p>
                </div>
              ))}
              {/* WhatsApp Quick Link */}
              <div className="card" onClick={() => window.open('https://wa.me/18491234567', '_blank')} style={{ cursor: 'pointer', padding: compactMode ? '20px' : '30px', background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: 'white' }}>
                  <div className="card-header" style={{ marginBottom: '15px' }}>
                    <MessageSquare size={20} />
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>WhatsApp</span>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '800' }}>Grupo Oficial</div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Ir a soporte</p>
              </div>
            </div>
          </div>
        )
    }
  }

  if (!session) {
    return <Login onSession={setSession} />
  }

  return (
    <div className="ios-container" style={{ '--primary': (theme || '').startsWith('glass') ? '#4ade80' : '#FFFFFF' }}>

      {/* Call Alert Overlay */}
      {activeCall && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: '#ef4444', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', animation: 'blink 1s infinite alternate' }}>
           <Bell size={100} style={{ marginBottom: '30px', animation: 'tilt 0.2s infinite' }} />
           <h1 className="display" style={{ fontSize: '48px', marginBottom: '20px' }}>¡EL JEFE TE LLAMA!</h1>
           <p style={{ fontSize: '24px', opacity: 0.9 }}>{activeCall.bossName} necesita hablar contigo urgente.</p>
           <button 
            onClick={() => setActiveCall(null)}
            style={{ marginTop: '50px', background: 'white', color: '#ef4444', border: 'none', padding: '20px 60px', borderRadius: '20px', fontSize: '20px', fontWeight: '800', cursor: 'pointer' }}
           >
             ENTENDIDO
           </button>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={goHome} style={{ cursor: 'pointer', padding: '20px 0', marginBottom: '45px', textAlign: 'center' }}>
          <img src={currentLogo} alt="HFworkers" style={{ height: '70px', objectFit: 'contain', filter: theme === 'light' ? 'none' : 'drop-shadow(0 0 15px rgba(255,255,255,0.1))' }} />
        </div>
        <nav style={{ flex: 1 }}>
          {apps.map((app, i) => (
            <div key={i} className={`nav-item ${currentView === app.id ? 'active' : ''}`} onClick={() => setCurrentView(app.id)}>
              {React.cloneElement(app.icon, { size: 20 })}
              <span>{app.name}</span>
            </div>
          ))}
        </nav>
        <div className={`nav-item ${currentView === 'settings' ? 'active' : ''}`} onClick={() => setCurrentView('settings')}>
          <Settings size={20} />
          <span>{t.settings}</span>
        </div>
        <div className="nav-item" onClick={handleLogout} style={{ marginTop: '10px', color: '#f87171' }}>
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
                onClick={goHome} 
              >
                <ChevronLeft size={24} />
                <span>Home</span>
              </button>
              <div className="mobile-view-title display">
                {currentView === 'home' ? '' : currentView === 'settings' ? t.settings : apps.find(a => a.id === currentView)?.name || ''}
              </div>
             <button className="header-action-btn" onClick={goHome}>
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
              <div key={app.id} className="app-icon-wrapper" onClick={() => setCurrentView(app.id)}>
                <div className="app-icon">
                  {React.cloneElement(app.icon, { size: 32 })}
                </div>
                <span className="app-label">{app.name}</span>
              </div>
            ))}
            <div className="app-icon-wrapper" onClick={() => setCurrentView('settings')}>
              <div className="app-icon" style={{ background: 'linear-gradient(135deg, #8e8e93 0%, #3a3a3c 100%)' }}>
                <Settings size={32} />
              </div>
              <span className="app-label">{t.adjusts}</span>
            </div>
          </div>
          
          <div className="dock">
             {[
               { id: 'tasks', icon: <CheckSquare size={28} /> },
               { id: 'rols', icon: <Users size={28} /> },
               { id: 'payments', icon: <Wallet size={28} /> },
               { id: 'settings', icon: <Settings size={28} /> }
             ].map(item => (
               <div key={item.id} className="dock-icon" onClick={() => setCurrentView(item.id)}>
                 {item.icon}
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Mobile Home Indicator */}
      <div className="home-indicator" onClick={goHome} />

      <style>{`
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
        @keyframes blink { from { background: #ef4444; } to { background: #7f1d1d; } }
        @keyframes tilt { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } }
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
          padding: 0;
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
        .mobile-view-title {
          font-size: 16px;
          font-weight: 700;
        }
        .content-scrollable {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 40px;
        }
        .active-view {
          display: flex !important;
          flex-direction: column;
          background: var(--bg);
          z-index: 150 !important;
          padding: 0 !important; /* Managed by mobile-nav-bar and content-scrollable */
        }
        @media (max-width: 1023px) {
          .mobile-nav-bar {
            display: flex;
          }
          .main-portal {
            height: 100vh;
            width: 100vw;
          }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(1.1); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default App
