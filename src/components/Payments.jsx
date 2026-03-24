import React, { useState, useEffect } from 'react'
import { Wallet, Plus, Trash2, CheckCircle2, AlertCircle, DollarSign, Calendar, FileText, X, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Payments = ({ lang = 'es' }) => {
  const t = {
    es: { title: 'Pagos y Facturación', subtitle: 'Gestión de nómina y reportes de gastos HFworkers', newExpense: 'Reportar Gasto', nextPay: 'PRÓXIMO PAGO', income: 'GANANCIA ACUMULADA (MAR)', refunds: 'REEMBOLSOS PENDIENTES', date: 'Fecha', payrollHistory: 'Historial de Nómina (Payroll)', paidOn: 'Liquidado el', expensesTitle: 'Gasto Realizado por Empresa', noExpenses: 'No hay gastos reportados.', reportedOn: 'Reportado:', approved: 'Aprobado', pending: 'En Revisión', modalTitle: 'Reportar Gasto', modalConcept: 'Concepto del Gasto', modalConceptPh: 'Ej. Gasolina comisión Real Estate...', modalAmount: 'Monto ($)', modalSubmit: 'Enviar a Revisión', expensesCount: 'Gastos', analysisReview: 'En revisión por analista' },
    en: { title: 'Payments & Billing', subtitle: 'Payroll management and expense reports HFworkers', newExpense: 'Report Expense', nextPay: 'NEXT PAYMENT', income: 'ACCUMULATED INCOME (MAR)', refunds: 'PENDING REFUNDS', date: 'Date', payrollHistory: 'Payroll History', paidOn: 'Settled on', expensesTitle: 'Company Expenses', noExpenses: 'No expenses reported.', reportedOn: 'Reported:', approved: 'Approved', pending: 'Under Review', modalTitle: 'Report Expense', modalConcept: 'Expense Concept', modalConceptPh: 'e.g. Real Estate commission gas...', modalAmount: 'Amount ($)', modalSubmit: 'Send for Review', expensesCount: 'Expenses', analysisReview: 'Under analyst review' },
    fr: { title: 'Paiements & Facturation', subtitle: 'Gestion de la paie et rapports de dépenses HFworkers', newExpense: 'Déclarer Dépense', nextPay: 'PROCHAIN PAIEMENT', income: 'REVENU ACCUMULÉ (MARS)', refunds: 'REMBOURSEMENTS EN ATTENTE', date: 'Date', payrollHistory: 'Historique de Paie', paidOn: 'Liquidé le', expensesTitle: 'Dépenses de l\'Entreprise', noExpenses: 'Aucune dépense signalée.', reportedOn: 'Signalé le:', approved: 'Approuvé', pending: 'En Révision', modalTitle: 'Déclarer Dépense', modalConcept: 'Concept de la Dépense', modalConceptPh: 'ex. Essence commission immobilière...', modalAmount: 'Montant ($)', modalSubmit: 'Envoyer pour Révision', expensesCount: 'Dépenses', analysisReview: 'En révision par l\'analyste' }
  }[lang];

  const [payrolls, setPayrolls] = useState([])

  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newExpenseConcept, setNewExpenseConcept] = useState('')
  const [newExpenseAmount, setNewExpenseAmount] = useState('')

  useEffect(() => {
    fetchExpenses()
    fetchPayrolls()
  }, [])

  const fetchPayrolls = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('payrolls')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
    if (data) setPayrolls(data)
  }

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (err) {
      console.error('Error fetching expenses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    const cleanConcept = newExpenseConcept.trim().slice(0, 200)
    const amountVal = parseFloat(newExpenseAmount)
    
    if (!cleanConcept || isNaN(amountVal)) return
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          concept: cleanConcept,
          amount: `$${amountVal.toFixed(2)}`,
          status: 'Pending',
          user_id: user.id
        })
        .select()

      if (error) throw error
      setExpenses([...data, ...expenses])
      setNewExpenseConcept('')
      setNewExpenseAmount('')
      setIsModalOpen(false)
    } catch (err) {
      alert('Error al añadir gasto: ' + err.message)
    }
  }

  const deleteExpense = async (id) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setExpenses(expenses.filter(e => e.id !== id))
    } catch (err) {
      console.error('Error deleting expense:', err)
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.6s ease' }}>
      <header className="portal-header" style={{ marginBottom: '60px' }}>
        <div className="portal-title">
          <h1 className="display" style={{ fontSize: '42px', marginBottom: '16px' }}>{t.title}</h1>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{t.subtitle}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="nav-item" 
          style={{ background: 'var(--primary)', color: 'var(--bg)', padding: '12px 24px', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={18} />
          <span style={{ fontWeight: '700' }}>{t.newExpense}</span>
        </button>
      </header>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px' }}>{t.nextPay}</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>$2,450.00</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '5px' }}>{t.date}: 31 Mar</p>
        </div>

        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px' }}>{t.income}</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>$4,900.00</div>
          <p style={{ color: '#4ade80', fontSize: '13px', marginTop: '5px' }}>+5% vs feb</p>
        </div>

        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px' }}>{t.refunds}</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>{expenses.filter(e => e.status === 'Pending').length} {t.expensesCount}</div>
          <p style={{ color: '#facc15', fontSize: '13px', marginTop: '5px' }}>{t.analysisReview}</p>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        {/* Payroll Section */}
        <div className="card" style={{ padding: '0' }}>
          <div style={{ padding: '25px 30px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
             <Wallet size={20} style={{ color: 'var(--primary)' }} />
             <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{t.payrollHistory}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {payrolls.map((pay, idx) => (
              <div key={pay.id} style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx !== payrolls.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{pay.period}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{t.paidOn} {pay.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '800', color: 'var(--primary)' }}>{pay.amount}</div>
                  <div style={{ 
                    fontSize: '10px', 
                    color: '#4ade80',
                    marginTop: '4px',
                    textTransform: 'uppercase',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    justifyContent: 'flex-end'
                  }}>
                    <CheckCircle2 size={10} /> {pay.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Section */}
        <div className="card" style={{ padding: '0' }}>
          <div style={{ padding: '25px 30px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
             <FileText size={20} style={{ color: 'var(--primary)' }} />
             <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{t.expensesTitle}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
              </div>
            ) : expenses.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                {t.noExpenses}
              </div>
            ) : (
              expenses.map((exp, idx) => (
                <div key={exp.id} className="history-row" style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx !== expenses.length - 1 ? '1px solid var(--glass-border)' : 'none', position: 'relative' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{exp.concept}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{t.reportedOn} {new Date(exp.created_at).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' })}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800' }}>{exp.amount}</div>
                      <div style={{ 
                        fontSize: '9px', 
                        color: exp.status === 'Approved' ? '#4ade80' : '#facc15',
                        marginTop: '4px',
                        textTransform: 'uppercase',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        justifyContent: 'flex-end'
                      }}>
                        {exp.status === 'Approved' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                        {exp.status === 'Approved' ? t.approved : t.pending}
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteExpense(exp.id)}
                      className="delete-btn"
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0, transition: '0.2s' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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
          <div className="card" style={{ width: '400px', padding: '40px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
               <h2 className="display" style={{ fontSize: '24px' }}>{t.modalTitle}</h2>
               <X size={24} style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
            </div>
            
            <form onSubmit={handleAddExpense}>
              <div style={{ marginBottom: '20px' }}>
                 <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>{t.modalConcept}</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newExpenseConcept}
                  onChange={(e) => setNewExpenseConcept(e.target.value)}
                  placeholder={t.modalConceptPh}
                  style={{
                    width: '100%',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    padding: '12px',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                 <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>{t.modalAmount}</label>
                <input 
                  type="number" 
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    padding: '12px',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
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
                {t.modalSubmit}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .history-row:hover .delete-btn {
          opacity: 1 !important;
        }
        .delete-btn:hover {
          color: #f87171 !important;
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

export default Payments
