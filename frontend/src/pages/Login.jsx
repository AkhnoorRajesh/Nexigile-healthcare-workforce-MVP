import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Building2, Stethoscope, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleRoleRedirect = (role) => {
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'FACILITY') navigate('/facility/dashboard');
    else navigate('/professional/dashboard');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');
      handleRoleRedirect(user.role);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Authentication failed. Please check your credentials.';
      setErrorMessage(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setErrorMessage('');

    try {
      const user = await login(demoEmail, demoPass);
      addToast(`Logged in as demo ${user.role.toLowerCase()}: ${user.name}`, 'success');
      handleRoleRedirect(user.role);
    } catch (err) {
      setErrorMessage('Quick login failed. Verify backend is running.');
      addToast('Quick login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-layout">
      {/* Left Branding Side */}
      <div className="auth-hero-side">
        <div className="auth-hero-pattern"></div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '3.5rem' }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-cta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 18px rgba(167, 93, 58, 0.35)',
              }}
            >
              <Activity size={26} color="#FAF5EF" />
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em', color: '#FAF5EF' }}>
              Nexgile <span style={{ color: 'var(--accent-cta)', fontStyle: 'italic' }}>MediOracle</span>
            </div>
          </div>

          <span
            style={{
              display: 'inline-block',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(244, 236, 225, 0.12)',
              color: '#F4ECE1',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              border: '1px solid rgba(167, 93, 58, 0.3)',
            }}
          >
            Boutique Workforce Orchestration
          </span>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.85rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.5rem', maxWidth: 520, color: '#FAF5EF' }}>
            Precision Clinical Staffing, Elevated by Deterministic AI
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#D6D3CD', maxWidth: 460, lineHeight: 1.7, fontWeight: 400 }}>
            Connect clinical facilities with vetted healthcare talent through harmonious, transparent competency matching.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '2.5rem', borderTop: '1px solid rgba(244, 236, 225, 0.15)', paddingTop: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: '#FAF5EF' }}>92%</div>
            <div style={{ fontSize: '0.8rem', color: '#D6D3CD', marginTop: '0.2rem' }}>AI Match Accuracy</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-cta)' }}>&lt; 4 hrs</div>
            <div style={{ fontSize: '0.8rem', color: '#D6D3CD', marginTop: '0.2rem' }}>Average Fill Time</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: '#FAF5EF' }}>100%</div>
            <div style={{ fontSize: '0.8rem', color: '#D6D3CD', marginTop: '0.2rem' }}>Clinical Vetted</div>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-card">
          <div style={{ marginBottom: '2.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              Sign in to manage shifts, applications, or platform operations
            </p>
          </div>

          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--rose-light)',
                color: 'var(--rose)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="name@medioracle.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <span style={{ color: 'var(--accent-cta)', fontWeight: 600, cursor: 'pointer' }}>
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Login Switcher */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Boutique Demo Portals (1-Click Access)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div
                className="demo-account-pill"
                onClick={() => handleQuickDemoLogin('facility@medioracle.com', 'Facility@123')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={15} color="var(--accent-cta)" /> Facility (St. Mary's Hospital)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cta)', fontWeight: 600 }}>Click to Login →</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: '0.15rem' }}>
                  facility@medioracle.com · Facility@123
                </div>
              </div>

              <div
                className="demo-account-pill"
                onClick={() => handleQuickDemoLogin('professional@medioracle.com', 'Professional@123')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Stethoscope size={15} color="var(--text-primary)" /> Caregiver / RN (Sarah Jenkins)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>Click to Login →</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: '0.15rem' }}>
                  professional@medioracle.com · Professional@123
                </div>
              </div>

              <div
                className="demo-account-pill"
                onClick={() => handleQuickDemoLogin('admin@medioracle.com', 'Admin@123')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={15} color="var(--accent-cta)" /> Platform Governance (Elena)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cta)', fontWeight: 600 }}>Click to Login →</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: '0.15rem' }}>
                  admin@medioracle.com · Admin@123
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
