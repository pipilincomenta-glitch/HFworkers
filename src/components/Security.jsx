import React, { useState } from 'react'
import { ShieldCheck, Smartphone, Monitor, Globe, LogOut, Key, ShieldAlert, CheckCircle2, X } from 'lucide-react'

const Security = () => {
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'iPhone 15 Pro', location: 'Santo Domingo, DO', ip: '192.168.1.45', status: 'Actual', icon: <Smartphone size={20} /> },
    { id: 2, device: 'MacBook Pro 14"', location: 'Santiago, DO', ip: '190.16.88.21', status: 'Activa', icon: <Monitor size={20} /> },
    { id: 3, device: 'Chrome on Windows', location: 'Santo Domingo, DO', ip: '192.168.1.10', status: 'Activa', icon: <Monitor size={20} /> },
  ])

  const [logs] = useState([
    { id: 1, action: 'Inicio de sesión exitoso', date: 'hoy, 09:41', location: 'Santo Domingo, DO', ip: '192.168.1.45' },
    { id: 2, action: 'Cambio de contraseña', date: 'ayer, 18:20', location: 'Santiago, DO', ip: '190.16.88.21' },
    { id: 3, action: 'Intento de acceso fallido', date: '20 Mar, 04:15', location: 'Unknown', ip: '45.16.22.188', warning: true },
  ])

  const terminateSession = (id) => {
    setActiveSessions(activeSessions.filter(s => s.id !== id))
  }

  return (
    <div style={{ animation: 'fadeIn 0.6s ease' }}>
      <header className="portal-header" style={{ marginBottom: '60px' }}>
        <div className="portal-title">
          <h1 className="display" style={{ fontSize: '42px', marginBottom: '16px' }}>Seguridad y Accesos</h1>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>Supervisión de integridad de cuenta y gestión de dispositivos HFworkers</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(74, 222, 128, 0.2)', fontSize: '14px', fontWeight: '700' }}>
           <ShieldCheck size={18} />
           Protección Activa
        </div>
      </header>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px' }}>ESTADO DE CUENTA</div>
          <div style={{ fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4ade80' }} />
            Blindada
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '5px' }}>2FA Activado por SMS</p>
        </div>

        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px' }}>SESIONES ACTIVAS</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>{activeSessions.length} Dispositivos</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '5px' }}>Sincronización total</p>
        </div>

        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px' }}>ALERTAS DE RIESGO</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>0 Criticas</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '5px' }}>Último scan: Hace 5m</p>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        {/* Active Sessions */}
        <div className="card" style={{ padding: '0' }}>
           <div style={{ padding: '25px 30px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Sesiones de Dispositivos</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Cerrar todas las sesiones</button>
           </div>
           <div>
             {activeSessions.map((session, idx) => (
               <div key={session.id} style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx !== activeSessions.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
                 <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '45px', height: '45px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      {session.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '15px' }}>{session.device}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{session.location} • {session.ip}</div>
                    </div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontSize: '10px', color: session.status === 'Actual' ? '#4ade80' : 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{session.status}</span>
                    {session.status !== 'Actual' && (
                       <button 
                        onClick={() => terminateSession(session.id)}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '5px' }}
                      >
                         <LogOut size={16} />
                       </button>
                    )}
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Security Log */}
        <div className="card" style={{ padding: '0' }}>
           <div style={{ padding: '25px 30px', borderBottom: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Historial de Seguridad</h3>
           </div>
           <div>
             {logs.map((log, idx) => (
               <div key={log.id} style={{ padding: '20px 30px', borderBottom: idx !== logs.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', fontSize: '14px', color: log.warning ? '#f87171' : 'white' }}>
                       {log.warning ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
                       {log.action}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.date}</span>
                 </div>
                 <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '26px' }}>
                    Desde {log.location} ({log.ip})
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '50px', height: '50px', background: 'var(--primary)', color: 'var(--bg)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Key size={24} />
            </div>
            <div>
               <h3 style={{ fontSize: '17px', fontWeight: '800' }}>Gestión de Credenciales</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Cambia tu contraseña o habilita llaves de seguridad físicas.</p>
            </div>
         </div>
         <button className="nav-item" style={{ background: 'white', color: 'black', padding: '12px 25px', border: 'none', cursor: 'pointer', fontWeight: '700' }}>
            Cambiar Contraseña
         </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1023px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Security
