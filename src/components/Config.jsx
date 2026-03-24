import React, { useState, useEffect } from 'react'
import { User, Lock, Phone, Share2, Palette, Bell, Globe, Camera, Save, Check, Type, Sun, Moon, Languages, LogOut, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const inputStyle = {
  width: '100%',
  background: 'var(--glass-bg)',
  border: '1px solid var(--glass-border)',
  padding: '15px',
  borderRadius: '12px',
  color: 'var(--text)',
  fontSize: '15px',
  outline: 'none'
}

const Config = ({ theme, setTheme, lang, setLang, guiSize, setGuiSize, compactMode, setCompactMode, onLogout }) => {
  const [activeTab, setActiveTab] = useState('account')
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMessage, setPwMessage] = useState({ text: '', type: '' })
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    role: 'Senior Worker'
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          role: data.role || 'Senior Worker'
        })
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          phone: profile.phone,
          role: profile.role,
          updated_at: new Date().toISOString()
        })
      
      if (error) throw error
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } catch (err) {
      alert('Error al guardar: ' + err.message)
    }
  }

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      setPwMessage({ text: 'Las contraseñas no coinciden', type: 'error' })
      return
    }
    if (newPassword.length < 6) {
      setPwMessage({ text: 'Mínimo 6 caracteres', type: 'error' })
      return
    }

    try {
      setPwLoading(true)
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setPwMessage({ text: 'Contraseña actualizada con éxito', type: 'success' })
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPwMessage({ text: err.message, type: 'error' })
    } finally {
      setPwLoading(false)
      setTimeout(() => setPwMessage({ text: '', type: '' }), 3000)
    }
  }

  // Simplified translations for Settings
  const t = {
    es: { title: 'Configuración', subtitle: 'Personaliza tu experiencia y gestiona tus datos en HFworkers', save: 'Guardar Cambios', saved: 'Guardado', account: 'Cuenta', interface: 'Interfaz', privacy: 'Privacidad', profile: 'Perfil de Usuario', role: 'Analista de Inversiones Senior', name: 'Nombre Completos', phone: 'WhatsApp / Teléfono', social: 'Redes Sociales', theme: 'Tema de Plataforma', language: 'Idioma del Sistema', guisize: 'Tamaño de la Interfaz (GUI)', compact: 'Modo Compacto', compactDesc: 'Reduce el padding de las tarjetas y listas', small: 'Pequeño', normal: 'Normal', large: 'Grande', newUser: 'Nuevo Usuario', logout: 'Cerrar Sesión de HFworkers' },
    en: { title: 'Settings', subtitle: 'Customize your experience and manage your data in HFworkers', save: 'Save Changes', saved: 'Saved', account: 'Account', interface: 'Interface', privacy: 'Privacy', profile: 'User Profile', role: 'Senior Investment Analyst', name: 'Full Name', phone: 'WhatsApp / Phone', social: 'Social Media', theme: 'Platform Theme', language: 'System Language', guisize: 'Interface Size (GUI)', compact: 'Compact Mode', compactDesc: 'Reduces card and list padding', small: 'Small', normal: 'Normal', large: 'Large', newUser: 'New User', logout: 'Sign Out from HFworkers' },
    fr: { title: 'Configuration', subtitle: 'Personnalisez votre expérience et gérez vos données dans HFworkers', save: 'Enregistrer', saved: 'Enregistré', account: 'Compte', interface: 'Interface', privacy: 'Confidentialité', profile: 'Profil Utilisateur', role: 'Analyste en Investissement Senior', name: 'Nom Complet', phone: 'WhatsApp / Téléphone', social: 'Réseaux Sociaux', theme: 'Thème de la Plateforme', language: 'Langue du Système', guisize: 'Taille de l\'Interface (GUI)', compact: 'Mode Compact', compactDesc: 'Réduit le padding des cartes et des listes', small: 'Petit', normal: 'Normal', large: 'Grand', newUser: 'Nouveau Utilisateur', logout: 'Cerrar Sesión de HFworkers' }
  }[lang]

  const sections = [
    { id: 'account', label: t.account, icon: <User size={18} /> },
    { id: 'interface', label: t.interface, icon: <Palette size={18} /> },
    { id: 'security', label: t.privacy, icon: <Lock size={18} /> },
  ]

  return (
    <div style={{ animation: 'fadeIn 0.6s ease' }}>
      <header className="portal-header" style={{ marginBottom: '60px' }}>
        <div className="portal-title">
          <h1 className="display" style={{ fontSize: '42px', marginBottom: '16px' }}>{t.title}</h1>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{t.subtitle}</p>
        </div>
        <button 
          onClick={handleSave}
          className="nav-item" 
          style={{ 
            background: isSaved ? '#4ade80' : 'var(--primary)', 
            color: 'var(--bg)', 
            padding: '16px 32px', 
            borderRadius: '16px',
            border: 'none', 
            cursor: 'pointer', 
            transition: '0.3s',
            boxShadow: '0 10px 20px rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '10px'
          }}
        >
          {isSaved ? <Check size={20} /> : <Save size={20} />}
          <span style={{ fontWeight: '800', fontSize: '15px' }}>{isSaved ? t.saved : t.save}</span>
        </button>
      </header>

      <div className="config-tabs-mobile">
        {sections.map(s => (
          <button
            key={s.id}
            className={`config-pill ${activeTab === s.id ? 'active' : ''}`}
            onClick={() => setActiveTab(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="config-grid-layout">
        {/* Settings Sidebar */}
        <div className="config-sidebar-desktop card" style={{ padding: '10px' }}>
          {sections.map(s => (
            <div 
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '15px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: '0.2s',
                background: activeTab === s.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: activeTab === s.id ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              {s.icon}
              <span style={{ fontWeight: activeTab === s.id ? '700' : '500' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Settings Content */}
        <div className="card" style={{ padding: compactMode ? '25px' : '40px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
              <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
            </div>
          ) : activeTab === 'account' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '30px' }}>{t.profile}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
                 <div style={{ position: 'relative' }}>
                   <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--glass-bg)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '800' }}>
                     {profile.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??'}
                   </div>
                   <button style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', color: 'var(--bg)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                     <Camera size={16} />
                   </button>
                 </div>
                 <div>
                   <div style={{ fontWeight: '700', fontSize: '18px' }}>{profile.full_name || t.newUser}</div>
                   <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{profile.role}</div>
                 </div>
              </div>

              <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                 <div>
                   <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>{t.name}</label>
                   <input 
                    type="text" 
                    value={profile.full_name} 
                    onChange={e => setProfile({...profile, full_name: e.target.value})}
                    style={inputStyle} 
                   />
                 </div>
                 <div>
                   <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>{t.phone}</label>
                   <input 
                    type="text" 
                    value={profile.phone} 
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                    style={inputStyle} 
                   />
                 </div>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', marginTop: '50px' }}>{t.social}</h3>
              <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                 <div>
                   <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>LinkedIn</label>
                   <input type="text" placeholder="https://linkedin.com/in/username" style={inputStyle} />
                 </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Instagram</label>
                    <input type="text" placeholder="@username" style={inputStyle} />
                  </div>
              </div>

              <div style={{ marginTop: '60px', borderTop: '1px solid var(--glass-border)', paddingTop: '40px' }}>
                <button 
                  onClick={onLogout}
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    background: 'rgba(248, 113, 113, 0.1)', 
                    color: '#f87171', 
                    border: '1px solid rgba(248, 113, 113, 0.2)', 
                    borderRadius: '12px', 
                    fontWeight: '700', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '10px',
                    cursor: 'pointer',
                    transition: '0.2s'
                  }}
                >
                  <LogOut size={18} />
                  <span>{lang === 'es' ? 'Cerrar Sesión de HFworkers' : lang === 'en' ? 'Sign Out from HFworkers' : 'Se déconnecter de HFworkers'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'interface' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '30px' }}>{t.interface}</h3>
              
              {/* Tema de Plataforma */}
              <div style={{ marginBottom: '40px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '15px', textTransform: 'uppercase' }}>{t.theme}</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                   {[
                     { id: 'dark', label: 'Dark', icon: <Moon size={16} /> },
                     { id: 'light', label: 'Light', icon: <Sun size={16} /> },
                     { id: 'glass-emerald', label: 'Emerald' },
                     { id: 'glass-midnight', label: 'Midnight' }
                   ].map(targetTheme => (
                     <div 
                      key={targetTheme.id} 
                      onClick={() => setTheme(targetTheme.id)}
                      style={{
                        padding: '12px 20px',
                        background: theme === targetTheme.id ? 'var(--primary)' : 'var(--glass-bg)',
                        color: theme === targetTheme.id ? 'var(--bg)' : 'var(--text)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '1px solid var(--glass-border)',
                        transition: '0.2s',
                        fontWeight: '700',
                        fontSize: '13px'
                      }}>
                       {targetTheme.icon} {targetTheme.label}
                     </div>
                   ))}
                </div>
              </div>

              {/* Idioma */}
              <div style={{ marginBottom: '40px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '15px', textTransform: 'uppercase' }}>{t.language}</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                   {[
                     { id: 'es', label: 'Español', flag: '🇪🇸' },
                     { id: 'en', label: 'English', flag: '🇺🇸' },
                     { id: 'fr', label: 'Français', flag: '🇫🇷' }
                   ].map(l => (
                     <div 
                      key={l.id} 
                      onClick={() => setLang(l.id)}
                      style={{
                        padding: '12px 20px',
                        background: lang === l.id ? 'rgba(255,255,255,0.1)' : 'var(--glass-bg)',
                        color: 'var(--text)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: lang === l.id ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                        transition: '0.2s',
                        fontWeight: '600'
                      }}>
                       <span style={{ fontSize: '18px' }}>{l.flag}</span> {l.label}
                     </div>
                   ))}
                </div>
              </div>

              {/* Tamaño de GUI */}
              <div style={{ marginBottom: '40px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '15px', textTransform: 'uppercase' }}>{t.guisize}</label>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                   {['small', 'default', 'large'].map(s => (
                     <div 
                       key={s} 
                       onClick={() => setGuiSize(s)}
                       style={{
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         gap: '10px',
                         cursor: 'pointer',
                         opacity: guiSize === s ? 1 : 0.4,
                         transition: '0.2s'
                        }}
                     >
                       <Type size={s === 'small' ? 14 : s === 'default' ? 24 : 34} color="var(--text)" />
                       <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: guiSize === s ? 'var(--primary)' : 'var(--text)' }}>
                         {s === 'small' ? t.small : s === 'default' ? t.normal : t.large}
                       </span>
                     </div>
                   ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                 <div>
                   <div style={{ fontWeight: '700' }}>{t.compact}</div>
                   <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.compactDesc}</div>
                 </div>
                 <div 
                  onClick={() => setCompactMode(!compactMode)}
                  style={{ width: '50px', height: '26px', background: compactMode ? 'var(--primary)' : 'var(--glass-border)', borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
                 >
                   <div style={{ position: 'absolute', right: compactMode ? '4px' : '28px', top: '4px', width: '18px', height: '18px', background: compactMode ? 'var(--bg)' : 'white', borderRadius: '50%', transition: '0.3s' }} />
                 </div>
              </div>

            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '30px' }}>Seguridad de la Cuenta</h3>
              
              <div className="card" style={{ padding: '30px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700' }}>Cambiar Contraseña</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Asegura tu cuenta con una credencial fuerte</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Nueva Contraseña</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••" 
                      style={inputStyle} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Confirmar Contraseña</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                      style={inputStyle} 
                    />
                  </div>
                  
                  {pwMessage.text && (
                    <div style={{ 
                      padding: '12px', 
                      borderRadius: '10px', 
                      background: pwMessage.type === 'error' ? 'rgba(248,113,113,0.1)' : 'rgba(74,222,128,0.1)',
                      color: pwMessage.type === 'error' ? '#f87171' : '#4ade80',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      {pwMessage.type === 'error' ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
                      {pwMessage.text}
                    </div>
                  )}

                  <button 
                    onClick={handleUpdatePassword}
                    disabled={pwLoading}
                    style={{ 
                      padding: '15px', 
                      background: 'var(--primary)', 
                      color: 'var(--bg)', 
                      border: 'none', 
                      borderRadius: '12px', 
                      fontWeight: '800', 
                      cursor: pwLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: '0.3s'
                    }}
                  >
                    {pwLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Actualizar Contraseña
                  </button>
                </div>
              </div>

              <div className="card" style={{ marginTop: '30px', padding: '25px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Sesiones Activas</h4>
                   <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cierra sesión en todos tus dispositivos</p>
                </div>
                <button 
                  onClick={onLogout}
                  style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .config-grid-layout {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 40px;
          align-items: start;
        }
        .config-tabs-mobile {
          display: none;
          gap: 10px;
          overflow-x: auto;
          padding: 0 0 20px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--glass-border);
        }
        .config-pill {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          padding: 8px 16px;
          border-radius: 20px;
          white-space: nowrap;
          font-weight: 700;
          font-size: 13px;
        }
        .config-pill.active {
          background: var(--primary);
          color: var(--bg);
        }
        @media (max-width: 1023px) {
          .config-grid-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .config-sidebar-desktop {
            display: none !important;
          }
          .config-tabs-mobile {
            display: flex;
          }
          .portal-header {
             flex-direction: column;
             align-items: flex-start !important;
             gap: 20px;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default Config
