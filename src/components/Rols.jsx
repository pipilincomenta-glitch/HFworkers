import React, { useState, useEffect } from 'react'
import { Users, Mail, Phone, MessageCircle, ExternalLink, Award, Circle, MapPin, Clock, Github, Linkedin, Globe, Loader2, Bell } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Rols = ({ lang = 'es' }) => {
  const translations = {
    es: { subtitle: 'Gestiona y colabora con el talento de HFworkers', contact: 'Contactar', performance: 'Performance', location: 'Ubicación', sendMessage: 'WhatsApp Directo', all: 'Todos', dev: 'Desarrollo', creative: 'Creativo', management: 'Gerencia', callAlert: 'Llamar Trabajador' },
    en: { subtitle: 'Manage and collaborate with HFworkers talent', contact: 'Contact', performance: 'Performance', location: 'Location', sendMessage: 'Direct WhatsApp', all: 'All Rols', dev: 'Development', creative: 'Creative', management: 'Management', callAlert: 'Call Worker' },
    fr: { subtitle: 'Gérez et collaborez avec les talents de HFworkers', contact: 'Contacter', performance: 'Performance', location: 'Emplacement', sendMessage: 'WhatsApp Direct', all: 'Tous los rols', dev: 'Développement', creative: 'Créatif', management: 'Direction', callAlert: 'Appeler l\'ouvrier' }
  };
  const t = translations[lang] || translations.en;

   const [activeTab, setActiveTab] = useState('All Rols')
  const [selectedMember, setSelectedMember] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  const fallbackMembers = [
    { id: 'f1', full_name: 'Jeremy', role: 'CEO & Founder', phone: '18491234567', team: 'Management', performance: '99.2%', location: 'Santo Domingo, DO', tz: 'GMT-4', color: '#4ade80' },
    { id: 'f2', full_name: 'Sarah Chen', role: 'Creative Director', phone: '18492223344', team: 'Creative', performance: '95.5%', location: 'New York, US', tz: 'EST', color: '#c084fc' },
    { id: 'f3', full_name: 'Alex Rivera', role: 'Tech Lead', phone: '18495556677', team: 'Development', performance: '98.1%', location: 'Madrid, ES', tz: 'CET', color: '#3b82f6' }
  ];

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
      
      if (error) console.warn('Supabase profiles empty or error, using fallback');
      
      const dbMembers = (data || []).map(member => ({
        ...member,
        location: member.location || 'Santo Domingo, DO',
        tz: member.tz || 'GMT-4',
        performance: member.performance || (85 + Math.random() * 15).toFixed(1) + '%',
        team: member.team || (member.role?.includes('Design') ? 'Creative' : 'Development'),
        color: member.color || (member.role?.includes('Design') ? '#c084fc' : '#4ade80')
      }))

      // Combine DB members with fallbacks, avoiding duplicates by name
      const combined = [...dbMembers];
      fallbackMembers.forEach(fb => {
        if (!combined.some(m => m.full_name === fb.full_name)) {
          combined.push(fb);
        }
      });
      
      setTeamMembers(combined)
    } catch (err) {
      console.error('Error fetching team:', err)
      setTeamMembers(fallbackMembers)
    } finally {
      setLoading(false)
    }
  }

  const triggerCall = async (workerId, workerName) => {
    // Send Realtime signal (Broadcast) for the specific worker
    await supabase.channel('global-alerts').send({
      type: 'broadcast',
      event: 'call_requested',
      payload: { workerId, bossName: 'Admin/Boss', workerName }
    })
    alert('Alerta enviada a ' + workerName);
  }

  const handleWhatsApp = (phone) => {
    const cleanPhone = (phone || '').replace(/\D/g, '') || '18491234567'; // Fallback to a placeholder or ask user
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  }

  const tabs = [
    { id: 'All Rols', label: t.all },
    { id: 'Development', label: t.dev },
    { id: 'Creative', label: t.creative },
    { id: 'Management', label: t.management }
  ]
  const filteredMembers = activeTab === 'All Rols' 
    ? teamMembers 
    : teamMembers.filter(m => m.team === activeTab || m.role?.includes(activeTab))

  return (
    <div className="teams-container" style={{ animation: 'fadeIn 0.5s ease', padding: '0 20px' }}>
      <header className="portal-header" style={{ marginBottom: '50px' }}>
        <div className="portal-title">
          <h1 className="display" style={{ fontSize: '42px', marginBottom: '16px' }}>{tabs.find(x => x.id === activeTab)?.label || activeTab}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>{t.subtitle}</p>
        </div>
      </header>

      {/* Modern Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '10px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={{
              padding: '10px 25px',
              borderRadius: '99px',
              background: activeTab === tab.id ? 'var(--primary)' : 'var(--glass-bg)',
              color: activeTab === tab.id ? 'var(--bg)' : 'var(--text)',
              border: '1px solid var(--glass-border)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap'
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
           <Loader2 className="animate-spin" size={40} color="var(--primary)" />
        </div>
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
        {filteredMembers.map(member => (
          <div 
            key={member.id} 
            className="card team-card" 
            style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}
            onClick={() => setSelectedMember(member)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '22px', 
                background: 'var(--surface)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text)',
                fontSize: '22px',
                fontWeight: '900',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {member.full_name ? member.full_name.split(' ').map(n => n[0]).join('').substring(0, 2) : '??'}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--primary)' }}>{member.full_name || 'Nuevo Miembro'}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px', fontWeight: '500' }}>{member.role || 'Worker'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <MapPin size={14} /> {member.location}
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <Clock size={14} /> {member.tz} Local
               </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', marginBottom: '30px' }}>
               <div style={{ textAlign: 'center', flex: 1, borderRight: '1px solid var(--glass-border)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>{t.performance}</div>
                  <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--primary)' }}>{member.performance}</div>
               </div>
               <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>Rol</div>
                  <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--primary)' }}>{member.team}</div>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="team-btn primary" 
                    style={{ flex: 1, borderRadius: '99px' }}
                    onClick={(e) => { e.stopPropagation(); handleWhatsApp(member.phone); }}
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp</span>
                  </button>
               <button 
                className="team-btn secondary" 
                style={{ width: '50px', justifyContent: 'center', background: '#ef4444', borderRadius: '99px', border: 'none' }}
                onClick={(e) => { e.stopPropagation(); triggerCall(member.id, member.full_name); }}
               >
                  <Bell size={18} color="white" />
               </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Member Profile Modal */}
      {selectedMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedMember(null)}>
           <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '50px', position: 'relative', animation: 'modalIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} onClick={e => e.stopPropagation()}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                 <div style={{ width: '120px', height: '120px', borderRadius: '40px', background: selectedMember.color || 'var(--primary)', margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', fontWeight: '900', color: 'rgba(0,0,0,0.6)', position: 'relative' }}>
                    {selectedMember.full_name ? selectedMember.full_name.split(' ').map(n => n[0]).join('').substring(0, 2) : '??'}
                 </div>
                 <h2 className="display" style={{ fontSize: '32px', marginBottom: '10px' }}>{selectedMember.full_name}</h2>
                 <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: '600' }}>{selectedMember.role}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', marginBottom: '5px' }}>{t.location}</div>
                    <div style={{ fontWeight: '700' }}>{selectedMember.location}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', marginBottom: '5px' }}>{t.performance}</div>
                    <div style={{ fontWeight: '700', color: '#4ade80' }}>{selectedMember.performance}</div>
                  </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                 <button 
                  className="team-btn primary" 
                  style={{ flex: 1, padding: '18px', borderRadius: '99px' }}
                  onClick={() => { handleWhatsApp(selectedMember.phone); setSelectedMember(null); }}
                 >
                    <MessageCircle size={20} />
                    <span>{t.sendMessage}</span>
                 </button>
                 <button 
                  className="team-btn secondary" 
                  style={{ width: '60px', height: '60px', borderRadius: '99px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ef4444', border: 'none' }}
                  onClick={() => { triggerCall(selectedMember.id, selectedMember.full_name); setSelectedMember(null); }}
                 >
                    <Bell size={24} color="white" />
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .team-card {
           cursor: pointer;
           transition: 0.3s;
        }
        .team-card:hover {
           transform: translateY(-5px);
           border-color: var(--primary);
        }
        .team-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
          transition: var(--transition);
          padding: 0 20px;
          height: 48px;
        }
        .team-btn.primary {
          background: var(--primary);
          color: black;
          justify-content: center;
        }
        .team-btn.secondary {
          background: rgba(255,255,255,0.05);
          color: white;
          border: 1px solid var(--glass-border);
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default Rols
