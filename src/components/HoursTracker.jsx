import React, { useState, useEffect } from 'react'
import { Calendar, BarChart, Trash2, Edit3, Save, X, Check, Plus, Clock, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const HoursTracker = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sessionName, setSessionName] = useState('')
  const [sessionHours, setSessionHours] = useState('')
  const [sessionMins, setSessionMins] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    fetchLogs()
    
    const subscription = supabase
      .channel('hours-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'work_logs' }, () => {
        fetchLogs()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('work_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLogs(data || [])
    } catch (err) {
      console.error('Error fetching logs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSession = async (e) => {
    if (e) e.preventDefault()
    const h = sessionHours || '0'
    const m = sessionMins || '0'
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('work_logs')
        .insert({
          project: sessionName.trim().slice(0, 100) || 'Sesión General',
          duration: `${h}h ${m}m`,
          status: 'Pending',
          user_id: user.id
        })
        .select()

      if (error) throw error
      setLogs([data[0], ...logs])
      setIsModalOpen(false)
      setSessionName('')
      setSessionHours('')
      setSessionMins('')
    } catch (err) {
      alert('Error al guardar sesión: ' + err.message)
    }
  }

  const deleteLog = async (id) => {
    try {
      const { error } = await supabase
        .from('work_logs')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setLogs(logs.filter(l => l.id !== id))
    } catch (err) {
      console.error('Error deleting log:', err)
    }
  }

  const startEditing = (log) => {
    setEditingId(log.id)
    setEditName(log.project)
  }

  const saveEdit = async (id) => {
    try {
      const { error } = await supabase
        .from('work_logs')
        .update({ project: editName })
        .eq('id', id)

      if (error) throw error
      setLogs(logs.map(l => l.id === id ? { ...l, project: editName } : l))
      setEditingId(null)
    } catch (err) {
      console.error('Error saving edit:', err)
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.6s ease', position: 'relative' }}>
      <header className="portal-header" style={{ marginBottom: '60px' }}>
        <div className="portal-title">
          <h1 className="display" style={{ fontSize: '42px', marginBottom: '16px' }}>Registro de Horas</h1>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>Reporte manual de actividades y control de tiempo HFworkers</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="nav-item" 
          style={{ background: 'var(--primary)', color: 'var(--bg)', padding: '12px 24px', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={18} />
          <span style={{ fontWeight: '700' }}>Registrar Horas</span>
        </button>
      </header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px' }}>
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      ) : (
        <>
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px' }}>MES ACTUAL</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>164h</div>
          <p style={{ color: '#4ade80', fontSize: '13px', marginTop: '5px' }}>+12% vs feb</p>
        </div>

        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px' }}>ESTA SEMANA</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>32h 15m</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '5px' }}>Meta: 40h</p>
        </div>

        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px' }}>OBJETIVO MENSUAL</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>180h</div>
          <div style={{ width: '100%', height: '4px', background: 'var(--surface)', borderRadius: '2px', marginTop: '15px' }}>
             <div style={{ width: '91%', height: '100%', background: 'var(--primary)', borderRadius: '2px' }} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '25px 30px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Historial de Reportes</h3>
           <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)' }}>
              <Calendar size={18} />
              <BarChart size={18} />
           </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {logs.map((item, idx) => (
            <div key={item.id} className="history-row" style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', borderBottom: idx !== logs.length - 1 ? '1px solid var(--glass-border)' : 'none', position: 'relative', transition: '0.2s' }}>
              <div style={{ flex: 1 }}>
                {editingId === item.id ? (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      autoFocus
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.id)}
                      style={{ background: 'var(--glass-bg)', border: '1px solid var(--primary)', color: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                    />
                    <button onClick={() => saveEdit(item.id)} style={{ background: 'var(--primary)', border: 'none', color: 'var(--bg)', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingId(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {item.project}
                      <button 
                        onClick={() => startEditing(item)}
                        className="edit-btn"
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0, transition: '0.2s' }}
                      >
                        <Edit3 size={12} />
                      </button>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{new Date(item.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</div>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '800' }}>{item.duration}</div>
                  <div style={{ 
                    fontSize: '10px', 
                    color: item.status === 'Approved' ? '#4ade80' : 'var(--text-muted)',
                    marginTop: '4px',
                    textTransform: 'uppercase',
                    fontWeight: '700'
                  }}>
                    {item.status}
                  </div>
                </div>
                <button 
                  onClick={() => deleteLog(item.id)}
                  className="delete-btn"
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0, transition: '0.2s' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>
      )}

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="card" style={{ width: '450px', padding: '40px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
               <h2 className="display" style={{ fontSize: '24px' }}>Reportar Horas</h2>
               <X size={24} style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
            </div>
            
            <form onSubmit={handleSaveSession}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Nombre de Tarea / Proyecto</label>
                <input 
                  autoFocus
                  type="text" 
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Ej. Análisis de Mercado..."
                  style={{
                    width: '100%',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    padding: '15px',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Horas</label>
                  <input 
                    type="number" 
                    value={sessionHours}
                    onChange={(e) => setSessionHours(e.target.value)}
                    placeholder="0"
                    style={{
                      width: '100%',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      padding: '15px',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Minutos</label>
                  <input 
                    type="number" 
                    value={sessionMins}
                    onChange={(e) => setSessionMins(e.target.value)}
                    placeholder="0"
                    style={{
                      width: '100%',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      padding: '15px',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', padding: '15px', borderRadius: '12px', border: '1px solid var(--glass-border)', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  style={{ flex: 2, background: 'var(--primary)', color: 'var(--bg)', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '800', cursor: 'pointer' }}
                >
                  Registrar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .history-row:hover {
          background: rgba(255,255,255,0.02);
        }
        .history-row:hover .delete-btn, 
        .history-row:hover .edit-btn {
          opacity: 1 !important;
        }
        .delete-btn:hover {
          color: #f87171 !important;
        }
        .edit-btn:hover {
          color: var(--primary) !important;
        }
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

export default HoursTracker
