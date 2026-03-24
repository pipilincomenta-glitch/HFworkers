import React, { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, ArrowRight, ArrowLeft, X, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const TaskBoard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('Medium')

  useEffect(() => {
    fetchTasks()

    // Real-time subscription
    const subscription = supabase
      .channel('tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (err) {
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const columns = ['To Do', 'In Progress', 'Done']

  const handleAddTask = async (e) => {
    e.preventDefault()
    const cleanTitle = newTaskTitle.trim().slice(0, 150)
    if (!cleanTitle) return
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: cleanTitle,
          priority: newTaskPriority,
          status: 'To Do',
          user_id: user.id
        })
        .select()

      if (error) throw error
      setTasks([...tasks, ...data])
      setNewTaskTitle('')
      setIsModalOpen(false)
    } catch (err) {
      alert('Error al añadir tarea: ' + err.message)
    }
  }

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  const moveTask = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t))
    } catch (err) {
      console.error('Error moving task:', err)
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', position: 'relative', minHeight: '80vh' }}>
      <header className="portal-header" style={{ marginBottom: '60px' }}>
        <div className="portal-title">
          <h1 className="display" style={{ fontSize: '42px', marginBottom: '16px' }}>Gestión de Tareas</h1>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>Supervisa y organiza tus compromisos diarios</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="nav-item" 
          style={{ background: 'var(--primary)', color: 'var(--bg)', padding: '12px 24px', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={18} />
          <span style={{ fontWeight: '700' }}>Nueva Tarea</span>
        </button>
      </header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px' }}>
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      ) : (
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {columns.map(col => (
          <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 10px' }}>
              <span>{col}</span>
              <span style={{ opacity: 0.5 }}>{tasks.filter(t => t.status === col).length}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {tasks.filter(t => t.status === col).map(task => (
                <div key={task.id} className="card task-card" style={{ padding: '20px', transition: '0.3s', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ 
                      fontSize: '10px', 
                      background: task.priority === 'High' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', 
                      color: task.priority === 'High' ? 'var(--bg)' : 'var(--text)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontWeight: '700'
                    }}>
                      {task.priority}
                    </span>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0', transition: '0.2s' }}
                      className="trash-btn"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '15px', lineHeight: '1.4' }}>{task.title}</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {task.status === 'Done' ? <CheckCircle2 size={14} style={{ color: 'var(--primary)' }} /> : <Circle size={14} />}
                      <span>{new Date(task.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {col !== 'To Do' && (
                        <button 
                          onClick={() => moveTask(task.id, columns[columns.indexOf(col) - 1])}
                          className="move-btn"
                        >
                          <ArrowLeft size={12} />
                        </button>
                      )}
                      {col !== 'Done' && (
                        <button 
                          onClick={() => moveTask(task.id, columns[columns.indexOf(col) + 1])}
                          className="move-btn"
                        >
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      )}

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="card" style={{ width: '400px', padding: '40px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
               <h2 className="display" style={{ fontSize: '24px' }}>Nueva Tarea</h2>
               <X size={24} style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
            </div>
            
            <form onSubmit={handleAddTask}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Título de la tarea</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Ej. Revisión de activos..."
                  style={{
                    width: '100%',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    padding: '12px',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Prioridad</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['Low', 'Medium', 'High'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)',
                        background: newTaskPriority === p ? 'var(--primary)' : 'var(--glass-bg)',
                        color: newTaskPriority === p ? 'var(--bg)' : 'var(--text)',
                        fontWeight: '700',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                style={{
                  width: '100%',
                  background: 'var(--primary)',
                  color: 'var(--bg)',
                  padding: '15px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Crear Tarea
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .task-card:hover {
          background: rgba(255,255,255,0.05) !important;
          transform: translateY(-2px);
        }
        .trash-btn:hover {
          color: #f87171 !important;
        }
        .move-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          color: var(--text);
          padding: 4px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          alignItems: center;
          justifyContent: center;
          transition: 0.2s;
        }
        .move-btn:hover {
          background: var(--primary);
          color: var(--bg);
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

export default TaskBoard
