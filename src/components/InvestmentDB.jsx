import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Filter, Search, ArrowUpRight, Shield, Globe, Coins, Building, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const InvestmentDB = ({ lang = 'es' }) => {
  const t = {
    es: { title: 'Base de Datos de Inversiones', subtitle: 'Análisis y gestión de activos globales del grupo HF', filters: 'Filtros Avanzados', all: 'Todos', active: 'Activo / Fondo', category: 'Categoría', capital: 'Capital', yield: 'Rendimiento', actions: 'Acciones', noData: 'No se encontraron inversiones.', catRE: 'Bienes Raíces', catTech: 'Tecnología', catCrypto: 'Cripto', catSust: 'Sostenibilidad' },
    en: { title: 'Investment Database', subtitle: 'Global asset analysis and management for HF Group', filters: 'Advanced Filters', all: 'All', active: 'Asset / Fund', category: 'Category', capital: 'Capital', yield: 'Yield', actions: 'Actions', noData: 'No investments found.', catRE: 'Real Estate', catTech: 'Technology', catCrypto: 'Crypto', catSust: 'Sustainability' },
    fr: { title: 'Base de Données d\'Investissement', subtitle: 'Analyse et gestion des actifs mondiaux du groupe HF', filters: 'Filtres Avancés', all: 'Tous', active: 'Actif / Fonds', category: 'Catégorie', capital: 'Capital', yield: 'Rendement', actions: 'Actions', noData: 'Aucun investissement trouvé.', catRE: 'Immobilier', catTech: 'Technologie', catCrypto: 'Crypto', catSust: 'Durabilité' }
  }[lang];

  const [filter, setFilter] = useState(t.all)
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvestments()
  }, [])

  const fetchInvestments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setInvestments(data || [])
    } catch (err) {
      console.error('Error fetching investments:', err)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (cat) => {
    switch (cat) {
      case 'Real Estate': return <Building size={18} />
      case 'Technology': return <Globe size={18} />
      case 'Crypto': return <Coins size={18} />
      case 'Sustainability': return <Shield size={18} />
      default: return <TrendingUp size={18} />
    }
  }

  const categories = [t.all, 'Real Estate', 'Technology', 'Crypto', 'Sustainability']

  const filteredInvestments = filter === t.all 
    ? investments 
    : investments.filter(inv => inv.category === filter)

  return (
    <div style={{ animation: 'fadeIn 0.6s ease' }}>
      <header className="portal-header" style={{ marginBottom: '60px' }}>
        <div className="portal-title">
          <h1 className="display" style={{ fontSize: '42px', marginBottom: '16px' }}>{t.title}</h1>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{t.subtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
           <div className="nav-item" style={{ background: 'var(--glass-bg)', padding: '10px 20px', border: '1px solid var(--glass-border)' }}>
              <Filter size={16} />
              <span>{t.filters}</span>
           </div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '10px 25px',
              borderRadius: '99px',
              background: filter === cat ? 'var(--primary)' : 'var(--glass-bg)',
              color: filter === cat ? 'var(--bg)' : 'var(--text)',
              border: '1px solid var(--glass-border)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto', border: '1px solid var(--glass-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '20px 30px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontStyle: 'italic' }}>{t.active}</th>
              <th style={{ padding: '20px 30px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>{t.category}</th>
              <th style={{ padding: '20px 30px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>{t.capital}</th>
              <th style={{ padding: '20px 30px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>{t.yield}</th>
              <th style={{ padding: '20px 30px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '100px', textAlign: 'center' }}>
                  <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
                </td>
              </tr>
            ) : filteredInvestments.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {t.noData}
                </td>
              </tr>
            ) : filteredInvestments.map((inv, idx) => (
              <tr key={idx} style={{ borderBottom: idx !== filteredInvestments.length - 1 ? '1px solid var(--glass-border)' : 'none', cursor: 'pointer', transition: '0.2s' }} className="table-row-hover">
                <td style={{ padding: '25px 30px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {getIcon(inv.category)}
                      </div>
                      <span style={{ fontWeight: '700', fontSize: '15px' }}>{inv.name}</span>
                   </div>
                </td>
                <td style={{ padding: '25px 30px', color: 'var(--text-muted)', fontSize: '14px' }}>{inv.category}</td>
                <td style={{ padding: '25px 30px', fontWeight: '800' }}>{inv.amount}</td>
                <td style={{ padding: '25px 30px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: inv.trend === 'up' ? '#4ade80' : '#f87171' }}>
                      {inv.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span style={{ fontWeight: '600' }}>{inv.yield}</span>
                   </div>
                </td>
                <td style={{ padding: '25px 30px' }}>
                   <ArrowUpRight size={20} style={{ opacity: 0.4 }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        ::-webkit-scrollbar {
          height: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: var(--glass-border);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}

export default InvestmentDB
