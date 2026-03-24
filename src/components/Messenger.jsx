import React, { useState, useEffect, useRef } from 'react'
import { Send, Search, Phone, Video, MoreVertical, Circle, Paperclip, Smile, Check, CheckCheck, Info, UserPlus, ChevronLeft, Loader2, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Messenger = ({ initialUserId, clearInitialUser, lang = 'es' }) => {
  const t = {
    es: { title: 'Mensajes Directos', searchPh: 'Buscar contactos...', messagePh: 'Escribe un mensaje...', online: 'En línea', clearHistory: 'Borrar Historial', chat: 'Chat', noName: 'Sin Nombre' },
    en: { title: 'Direct Messages', searchPh: 'Search contacts...', messagePh: 'Type a message...', online: 'Online', clearHistory: 'Clear History', chat: 'Chat', noName: 'No Name' },
    fr: { title: 'Messages Directs', searchPh: 'Rechercher contacts...', messagePh: 'Écrivez un message...', online: 'En ligne', clearHistory: 'Supprimer l\'historique', chat: 'Chat', noName: 'Sans Nom' }
  }[lang];

  const [activeChat, setActiveChat] = useState(null)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [profiles, setProfiles] = useState([])
  const [chatHistory, setChatHistory] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMoreActions, setShowMoreActions] = useState(false)
  const scrollRef = useRef(null)

  const emojis = ['😊', '😂', '🔥', '👍', '🙏', '🙌', '💯', '✅', '🚀', '⭐', '❤️', '✨']

  useEffect(() => {
    initMessenger()
    
    if (initialUserId) {
      setActiveChat(initialUserId)
      if (typeof clearInitialUser === 'function') clearInitialUser()
      setShowMobileChat(true)
    }
    
    // Subscribe to NEW MESSAGES
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const newMsg = payload.new
        // Only add if it belongs to the current active chat
        if (
          (newMsg.sender_id === activeChat || newMsg.receiver_id === activeChat) &&
          (newMsg.sender_id === currentUser?.id || newMsg.receiver_id === currentUser?.id)
        ) {
          setChatHistory(prev => [...prev, newMsg])
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeChat, currentUser])

  const initMessenger = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)

    // Fetch other profiles
    const { data: profs } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id)
    
    setProfiles(profs || [])
    if (profs?.length > 0 && !activeChat) {
      setActiveChat(profs[0].id)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (activeChat && currentUser) {
      fetchMessages()
    }
  }, [activeChat, currentUser])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .or(`sender_id.eq.${activeChat},receiver_id.eq.${activeChat}`)
      .order('created_at', { ascending: true })

    if (data) setChatHistory(data)
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    const cleanContent = message.trim().slice(0, 5000)
    if (!cleanContent || !activeChat || !currentUser) return

    setMessage('')

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUser.id,
        receiver_id: activeChat,
        content: cleanContent
      })
    
    if (error) {
      console.error('Error sending message:', error)
      setMessage(cleanContent) // restore message if error
    }
  }

  const handleDeleteChat = async () => {
    if (!window.confirm('¿Estás seguro de que quieres borrar todo el historial de este chat?')) return
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${activeChat}),and(sender_id.eq.${activeChat},receiver_id.eq.${currentUser.id})`)
      
      if (error) throw error
      setChatHistory([])
      setShowMoreActions(false)
    } catch (err) {
      alert('Error al borrar chat: ' + err.message)
    }
  }

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const filteredChats = profiles.filter(c => (c.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()))
  const activeContact = profiles.find(c => c.id === activeChat)

  const handleSelectChat = (id) => {
    setActiveChat(id)
    setShowMobileChat(true)
  }

  const getLocaleForLang = (langCode) => {
    switch (langCode) {
      case 'es': return 'es-ES';
      case 'fr': return 'fr-FR';
      case 'en':
      default: return 'en-US';
    }
  };

  return (
    <div className="messenger-container" style={{ animation: 'fadeIn 0.6s ease', height: 'calc(100vh - 120px)', display: 'flex', background: 'var(--glass-bg)', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--glass-border)', backdropFilter: 'blur(40px)' }}>
      {/* Sidebar */}
      <aside className={`messenger-sidebar ${showMobileChat ? 'mobile-hidden' : ''}`} style={{ width: '350px', background: 'rgba(0,0,0,0.3)', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '30px 25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 className="display" style={{ fontSize: '22px', margin: 0 }}>{t.title}</h2>
            <div style={{ background: 'var(--primary)', color: 'var(--bg)', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <UserPlus size={16} />
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder={t.searchPh} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', transition: '0.3s' }}
            />
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 15px 20px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
            </div>
          ) : filteredChats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => handleSelectChat(chat.id)}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: '0.2s',
                marginBottom: '5px',
                background: activeChat === chat.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: activeChat === chat.id ? '1px solid var(--glass-border)' : '1px solid transparent'
              }}
              className="chat-item"
            >
              <div style={{ position: 'relative' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '15px', position: 'relative', overflow: 'hidden' }}>
                  {chat.full_name ? chat.full_name.substring(0, 2).toUpperCase() : '??'}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }} />
                </div>
                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '14px', height: '14px', borderRadius: '50%', background: '#4ade80', border: '3px solid #131313' }} />
              </div>
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '15px', color: activeChat === chat.id ? 'var(--primary)' : 'var(--text)' }}>{chat.full_name || t.noName}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{chat.role}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{t.online}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className={`chat-area ${!showMobileChat ? 'mobile-hidden' : ''}`} style={{ flex: 1, background: 'rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        {/* Chat Header */}
        <header style={{ padding: '20px 35px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="mobile-back-btn" onClick={() => setShowMobileChat(false)}>
              <ChevronLeft size={24} />
            </button>
             <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '900' }}>
               {activeContact?.full_name ? activeContact.full_name.substring(0, 2).toUpperCase() : '??'}
             </div>
             <div>
               <div style={{ fontWeight: '800', fontSize: '16px' }}>{activeContact?.full_name || t.chat}</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4ade80', fontWeight: '600' }}>
                 <Circle size={8} fill="currentColor" /> {t.online}
               </div>
             </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', position: 'relative' }}>
             <div 
              className="header-action" 
              onClick={() => setShowMoreActions(!showMoreActions)}
              style={{ position: 'relative' }}
             >
                <MoreVertical size={20} />
                {showMoreActions && (
                  <div style={{
                    position: 'absolute',
                    top: '40px',
                    right: '0',
                    background: 'var(--surface)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    padding: '8px',
                    zIndex: 1000,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(20px)'
                  }}>
                    <button 
                      onClick={handleDeleteChat}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'none',
                        border: 'none',
                        color: '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        transition: '0.2s'
                      }}
                      className="menu-item-hover"
                    >
                      <Trash2 size={16} />
                      {t.clearHistory}
                    </button>
                  </div>
                )}
             </div>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '35px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ 
              alignSelf: msg.sender_id === currentUser?.id ? 'flex-end' : 'flex-start',
              maxWidth: '65%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender_id === currentUser?.id ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                padding: '14px 20px',
                borderRadius: msg.sender_id === currentUser?.id ? '22px 22px 4px 22px' : '22px 22px 22px 4px',
                background: msg.sender_id === currentUser?.id ? 'linear-gradient(135deg, var(--primary) 0%, #e5e5e5 100%)' : 'rgba(255,255,255,0.06)',
                color: msg.sender_id === currentUser?.id ? 'black' : 'white',
                fontSize: '14.5px',
                fontWeight: '500',
                border: msg.sender_id === currentUser?.id ? 'none' : '1px solid var(--glass-border)',
                lineHeight: '1.6',
                boxShadow: msg.sender_id === currentUser?.id ? '0 10px 20px rgba(255,255,255,0.05)' : 'none'
              }}>
                {msg.content}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>{new Date(msg.created_at).toLocaleTimeString(getLocaleForLang(lang), { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.sender_id === currentUser?.id && (
                  <CheckCheck size={12} color="#4ade80" />
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.06)', padding: '12px 18px', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: '4px' }}>
               <div className="dot" />
               <div className="dot" style={{ animationDelay: '0.2s' }} />
               <div className="dot" style={{ animationDelay: '0.4s' }} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <footer style={{ padding: '25px 35px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
          <form 
            onSubmit={handleSendMessage}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px'
            }}
          >
            <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', position: 'relative' }}>
               <div style={{ position: 'relative' }}>
                  <Smile 
                    size={22} 
                    style={{ cursor: 'pointer' }} 
                    className="header-action" 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                  />
                  {showEmojiPicker && (
                    <div style={{
                      position: 'absolute',
                      bottom: '50px',
                      left: '0',
                      background: 'var(--surface)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '16px',
                      padding: '15px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '10px',
                      zIndex: 1000,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                      backdropFilter: 'blur(30px)'
                    }}>
                      {emojis.map(e => (
                        <span 
                          key={e} 
                          onClick={() => addEmoji(e)}
                          style={{ fontSize: '24px', cursor: 'pointer', textAlign: 'center', transition: '0.2s' }}
                          className="emoji-hover"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  )}
               </div>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
               <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.messagePh}
                style={{ width: '100%', padding: '15px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '18px', color: 'white', fontSize: '14.5px', outline: 'none', transition: '0.3s' }}
              />
            </div>
            <button 
              type="submit"
              disabled={!message.trim()}
              style={{
                background: 'var(--primary)',
                color: 'black',
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: message.trim() ? 'pointer' : 'not-allowed',
                transition: '0.3s',
                opacity: message.trim() ? 1 : 0.5,
                boxShadow: '0 8px 16px rgba(255,255,255,0.1)'
              }}
            >
              <Send size={20} />
            </button>
          </form>
        </footer>
      </main>

      <style>{`
        .header-action {
          cursor: pointer;
          transition: 0.2s;
        }
        .header-action:hover {
          color: var(--primary);
          transform: translateY(-2px);
        }
        .chat-item:hover {
          background: rgba(255,255,255,0.03) !important;
        }
        .menu-item-hover:hover {
          background: rgba(248, 113, 113, 0.1) !important;
        }
        .emoji-hover:hover {
          transform: scale(1.3);
        }
        .dot {
          width: 6px;
          height: 6px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }
        .mobile-back-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          padding: 0;
          cursor: pointer;
          margin-right: 10px;
        }
        @media (max-width: 1023px) {
          .messenger-container {
            height: 100% !important;
            border: none !important;
            border-radius: 0 !important;
            background: none !important;
            backdrop-filter: none !important;
            position: relative;
          }
          .messenger-sidebar {
            width: 100% !important;
            border-right: none !important;
          }
          .chat-area {
            position: absolute !important;
            inset: 0;
            z-index: 100;
            background: var(--bg) !important;
          }
          .mobile-hidden {
            display: none !important;
          }
          .mobile-back-btn {
            display: block;
          }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default Messenger
