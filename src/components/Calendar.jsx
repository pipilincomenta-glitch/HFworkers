import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, MapPin, Plus, X, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Calendar = ({ lang = 'es' }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [eventsList, setEventsList] = useState([])
  const [newEvent, setNewEvent] = useState({ title: '', type: 'task', day: new Date().getDate(), time: '09:00 AM' })
  
  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', currentDate.getMonth())
        .eq('year', currentDate.getFullYear());

      if (error) throw error;
      setEventsList(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  }

  const translations = {
    es: { title: 'Calendario de Rols', sub: 'Eventos y tareas programadas', today: 'Próximos', add: 'Nuevo Evento', cancel: 'Cancelar', save: 'Guardar', evTitle: 'Título del Evento', evType: 'Categoría', evDay: 'Día del Mes' },
    en: { title: 'Rols Calendar', sub: 'Events and scheduled tasks', today: 'Upcoming', add: 'New Event', cancel: 'Cancel', save: 'Save', evTitle: 'Event Title', evType: 'Category', evDay: 'Day of Month' },
    fr: { title: 'Calendrier des Rols', sub: 'Événements et tâches planifiées', today: 'À venir', add: 'Nouvel Événement', cancel: 'Annuler', save: 'Enregistrer', evTitle: 'Titre de l\'événement', evType: 'Catégorie', evDay: 'Jour du Mois' }
  }
  const t = translations[lang] || translations.en;

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = {
    es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    fr: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
  }[lang];

  const handleSave = async () => {
    if (!newEvent.title) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const eventData = { 
        ...newEvent, 
        user_id: user.id,
        month: currentDate.getMonth(), 
        year: currentDate.getFullYear() 
      };

      const { error } = await supabase
        .from('calendar_events')
        .insert([eventData]);

      if (error) throw error;

      fetchEvents(); // Refresh list
      setIsModalOpen(false);
      setNewEvent({ title: '', type: 'task', day: new Date().getDate(), time: '09:00 AM' });
    } catch (err) {
      console.error('Error saving event:', err);
      alert('Error saving event');
    }
  }

  const renderCells = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const cells = [];

    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    for (let d = 1; d <= totalDays; d++) {
      const dayEvents = eventsList.filter(e => e.day === d && e.month === month && e.year === year);
      const isToday = isCurrentMonth && today.getDate() === d;
      
      cells.push(
        <div key={d} className={`calendar-cell ${isToday ? 'today' : ''}`}>
          <span className="day-number">{d}</span>
          <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
            {dayEvents.map((e, idx) => (
              <div key={idx} className="event-dot" style={{ backgroundColor: e.type === 'meeting' ? '#3b82f6' : e.type === 'deadline' ? '#ec4899' : '#4ade80' }}></div>
            ))}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="calendar-container" style={{ animation: 'fadeIn 0.5s ease', padding: '0 20px' }}>
      <header className="portal-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="portal-title">
          <h1 className="display" style={{ fontSize: '42px', marginBottom: '8px' }}>{t.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>{t.sub}</p>
        </div>
        <button 
          className="calendar-add-btn"
          style={{ 
            display: 'flex', gap: '8px', alignItems: 'center', padding: '12px 28px', borderRadius: '99px',
            background: 'var(--primary)', color: 'var(--bg)', border: 'none', cursor: 'pointer',
            fontWeight: '800', fontSize: '14px', transition: 'var(--transition)', boxShadow: '0 4px 15px rgba(255,255,255,0.1)'
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} strokeWidth={3} />
          <span>{t.add}</span>
        </button>
      </header>

      <div className="calendar-card card" style={{ padding: '30px' }}>
        <div className="calendar-controls">
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <div style={{ display: 'flex', gap: '15px' }}>
             <button onClick={prevMonth} className="nav-btn" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text)', width: '44px', height: '44px', borderRadius: '99px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'var(--transition)' }}>
                <ChevronLeft size={20} />
             </button>
             <button onClick={nextMonth} className="nav-btn" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text)', width: '44px', height: '44px', borderRadius: '99px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'var(--transition)' }}>
                <ChevronRight size={20} />
             </button>
          </div>
        </div>
        <div className="calendar-grid">
           {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
             <div key={d} className="grid-header">{d}</div>
           ))}
           {renderCells()}
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
         <h3 className="display" style={{ fontSize: '24px', marginBottom: '20px' }}>{t.today}</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {eventsList.filter(e => e.month === currentDate.getMonth()).map((e, i) => (
              <div key={i} className="card calendar-event-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', transition: 'var(--transition)', cursor: 'pointer' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CalIcon size={20} color="var(--primary)" />
                 </div>
                 <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--primary)', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{e.day}</span>
                      <h4 style={{ margin: 0, fontWeight: '700' }}>{e.title}</h4>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>{e.time} • Oficina Virtual</p>
                 </div>
                 <div className="tag" style={{ background: e.type === 'meeting' ? 'rgba(59, 130, 246, 0.1)' : e.type === 'deadline' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(74, 222, 128, 0.1)', color: e.type === 'meeting' ? '#3b82f6' : e.type === 'deadline' ? '#ec4899' : '#4ade80', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
                    {e.type.toUpperCase()}
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* NEW EVENT MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '40px', position: 'relative', animation: 'modalIn 0.3s ease' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24}/></button>
            <h2 className="display" style={{ fontSize: '28px', marginBottom: '30px' }}>{t.add}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700' }}>{t.evTitle}</label>
                <input 
                  type="text" 
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Ej: Revisión semanal"
                  style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '15px', borderRadius: '12px', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700' }}>{t.evDay}</label>
                  <input 
                    type="number" 
                    min="1" max="31"
                    value={newEvent.day}
                    onChange={e => setNewEvent({...newEvent, day: parseInt(e.target.value)})}
                    style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '15px', borderRadius: '12px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700' }}>{t.evType}</label>
                  <select 
                    value={newEvent.type}
                    onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                    style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '15px', borderRadius: '12px', color: 'white' }}
                  >
                    <option value="task">Task</option>
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '15px', borderRadius: '99px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white', fontWeight: '700', cursor: 'pointer' }}>{t.cancel}</button>
                <button onClick={handleSave} style={{ flex: 1, padding: '15px', borderRadius: '99px', background: 'var(--primary)', color: 'black', fontWeight: '800', border: 'none', cursor: 'pointer' }}>{t.save}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .calendar-event-card:hover { background: rgba(255, 255, 255, 0.08); transform: translateX(5px); }
        .nav-btn:hover { background: var(--primary) !important; color: var(--bg) !important; }
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--glass-border); border-radius: 16px; overflow: hidden; border: 1px solid var(--glass-border); }
        .grid-header { background: var(--surface); padding: 15px; text-align: center; font-weight: 800; font-size: 12px; color: var(--text-muted); }
        .calendar-cell { background: var(--surface); height: 80px; padding: 10px; display: flex; flex-direction: column; align-items: center; position: relative; }
        .calendar-cell.today { background: var(--glass-bg); }
        .calendar-cell.today .day-number { background: var(--primary); color: black; width: 28px; height: 28px; display: flex; alignItems: center; justifyContent: center; borderRadius: 50%; }
        .day-number { font-weight: 700; font-size: 14px; }
        .event-dot { width: 6px; height: 6px; border-radius: 50%; }
        .calendar-add-btn:hover { transform: scale(1.05); filter: brightness(1.2); }
        .calendar-add-btn:active { transform: scale(0.95); }
      `}</style>
    </div>
  )
}

export default Calendar
