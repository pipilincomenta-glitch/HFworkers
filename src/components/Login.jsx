import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'
import LogoHF from '../logopngHF.png'

const Login = ({ onSession }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (data.session) onSession(data.session)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-glass-card">
        <div className="login-header">
          <div className="login-logo" style={{ marginBottom: '35px', display: 'flex', justifyContent: 'center' }}>
            <img src={LogoHF} alt="HFworkers" style={{ height: '110px', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.08))' }} />
          </div>
          <p className="login-subtitle">Portal Editorial & Ecosistema de Inversión</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="login-error-toast">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="login-input-group">
            <label><Mail size={14} /> Email de Trabajador</label>
            <input 
              type="email" 
              placeholder="jeremy@hfoundation.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="login-input-group">
            <label><Lock size={14} /> Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <span className="loader"></span>
            ) : (
              <>
                <span>Acceder al Portal</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <ShieldCheck size={14} />
          <span>Seguridad Encriptada por High Foundation</span>
        </div>
      </div>

      <style>{`
        .login-container {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #1f1f1f 0%, #131313 100%);
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.03) 0%, transparent 50%);
          animation: move 20s linear infinite;
        }

        @keyframes move {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .login-glass-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          padding: 50px 40px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
          animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-logo {
          font-size: 32px;
          letter-spacing: -0.05em;
          margin-bottom: 8px;
        }

        .login-subtitle {
          color: rgba(255,255,255,0.4);
          font-size: 14px;
          font-weight: 500;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .login-input-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .login-input-group label {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-left: 5px;
        }

        .login-input-group input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px 20px;
          border-radius: 14px;
          color: white;
          font-size: 15px;
          outline: none;
          transition: 0.3s;
        }

        .login-input-group input:focus {
          border-color: white;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 20px rgba(255,255,255,0.05);
        }

        .login-submit-btn {
          margin-top: 15px;
          background: white;
          color: #131313;
          border: none;
          padding: 18px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: 0.3s;
        }

        .login-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255,255,255,0.2);
        }

        .login-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .login-error-toast {
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.2);
          color: #f87171;
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: slideIn 0.3s ease;
        }

        .login-footer {
          margin-top: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: rgba(255,255,255,0.2);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .loader {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(0,0,0,0.1);
          border-top: 3px solid #131313;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Login
