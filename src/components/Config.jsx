import React, { useState } from 'react'
import { Palette, Globe, Type, Moon, Sun, Check, Laptop, Sparkles } from 'lucide-react'

/**
 * Simplified Config Component
 * Only manages appearance and language via UI-level props.
 */
const Config = ({ theme, setTheme, lang, setLang, guiSize, setGuiSize, compactMode, setCompactMode }) => {
  const [activeTab, setActiveTab] = useState('interface')

  const t = {
    es: { title: 'Configuración', subtitle: 'Personaliza la apariencia del portal para tu comodidad', interface: 'Interfaz', theme: 'Tema de Plataforma', language: 'Idioma del Sistema', guisize: 'Tamaño de la Interfaz (GUI)', compact: 'Modo Compacto', compactDesc: 'Reduce el espacio de las tarjetas para dispositivos pequeños', small: 'Pequeño', normal: 'Normal', large: 'Grande' },
    en: { title: 'Settings', subtitle: 'Customize the portal appearance for your comfort', interface: 'Interface', theme: 'Platform Theme', language: 'System Language', guisize: 'Interface Size (GUI)', compact: 'Compact Mode', compactDesc: 'Reduces card spacing for small devices', small: 'Small', normal: 'Normal', large: 'Large' },
    fr: { title: 'Configuration', subtitle: 'Personnalisez l\'apparence du portail pour votre confort', interface: 'Interface', theme: 'Thème de la Plateforme', language: 'Langue du Système', guisize: 'Taille de l\'Interface (GUI)', compact: 'Mode Compact', compactDesc: 'Réduit l\'espace des cartes pour les petits appareils', small: 'Petit', normal: 'Normal', large: 'Grand' }
  }[lang] || { title: 'Settings' };

  return (
    <div style={{ animation: 'fadeIn 0.6s ease', padding: '0 20px' }}>
      <header className="portal-header" style={{ marginBottom: '60px' }}>
        <div className="portal-title">
          <h1 className="display" style={{ fontSize: '42px', marginBottom: '16px' }}>{t.title}</h1>
          <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.7 }}>{t.subtitle}</p>
        </div>
      </header>

      <div className="card" style={{ padding: compactMode ? '25px' : '40px', maxWidth: '800px', margin: '0 auto', border: '1px solid var(--glass-border)' }}>
        
        {/* Tema de Plataforma */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Palette size={20} color="var(--primary)" />
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.1em' }}>{t.theme}</label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
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
                  padding: '15px',
                  background: theme === targetTheme.id ? 'var(--primary)' : 'var(--glass-bg)',
                  color: theme === targetTheme.id ? 'var(--bg)' : 'var(--text)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: '0.2s',
                  fontWeight: '700',
                  fontSize: '14px'
                }}>
                 {targetTheme.icon} {targetTheme.label}
               </div>
             ))}
          </div>
        </div>

        {/* Idioma */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Globe size={20} color="var(--primary)" />
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.1em' }}>{t.language}</label>
          </div>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
             {[
               { id: 'es', label: 'Español', flag: '🇪🇸' },
               { id: 'en', label: 'English', flag: '🇺🇸' },
               { id: 'fr', label: 'Français', flag: '🇫🇷' }
             ].map(l => (
               <div 
                key={l.id} 
                onClick={() => setLang(l.id)}
                style={{
                  padding: '15px 30px',
                  background: lang === l.id ? 'rgba(255,255,255,0.1)' : 'var(--glass-bg)',
                  color: 'var(--text)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: lang === l.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                  transition: '0.2s',
                  fontWeight: '700'
                }}>
                 <span style={{ fontSize: '20px' }}>{l.flag}</span> {l.label}
               </div>
             ))}
          </div>
        </div>

        {/* Tamaño de GUI */}
        <div style={{ marginBottom: '50px', borderTop: '1px solid var(--glass-border)', paddingTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <Type size={20} color="var(--primary)" />
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.1em' }}>{t.guisize}</label>
          </div>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'center' }}>
             {['small', 'default', 'large'].map(s => (
               <div 
                 key={s} 
                 onClick={() => setGuiSize(s)}
                 style={{
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                   gap: '12px',
                   cursor: 'pointer',
                   opacity: guiSize === s ? 1 : 0.3,
                   transition: '0.2s'
                  }}
               >
                 <div style={{ padding: '10px', borderRadius: '10px', background: guiSize === s ? 'var(--primary)' : 'transparent', color: guiSize === s ? 'var(--bg)' : 'var(--text)' }}>
                    <Type size={s === 'small' ? 18 : s === 'default' ? 24 : 32} />
                 </div>
                 <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                   {s === 'small' ? t.small : s === 'default' ? t.normal : t.large}
                 </span>
               </div>
             ))}
          </div>
        </div>

        {/* Modo Compacto */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
           <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
             <Sparkles size={24} color="var(--primary)" />
             <div>
               <div style={{ fontWeight: '800', fontSize: '16px' }}>{t.compact}</div>
               <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.compactDesc}</div>
             </div>
           </div>
           <div 
            onClick={() => setCompactMode(!compactMode)}
            style={{ width: '56px', height: '30px', background: compactMode ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
           >
             <div style={{ position: 'absolute', right: compactMode ? '4px' : '30px', top: '4px', width: '22px', height: '22px', background: compactMode ? 'var(--bg)' : 'white', borderRadius: '50%', transition: '0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} />
           </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default Config
