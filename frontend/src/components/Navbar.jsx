import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Bell, LogOut, User, Building2, ShieldCheck, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleIcon = () => {
    if (user?.role === 'ADMIN') return <ShieldCheck size={14} />;
    if (user?.role === 'FACILITY') return <Building2 size={14} />;
    return <Stethoscope size={14} />;
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="navbar-brand-icon">
          <Activity size={22} />
        </div>
        <div>
          Medi<span>Oracle</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Role identifier badge */}
        <div className="user-profile-badge">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-meta">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              {getRoleIcon()}
              {user?.role} PORTAL
            </span>
          </div>
        </div>

        {/* Notifications mock icon with badge */}
        <button
          className="btn btn-ghost"
          style={{ padding: '0.6rem', borderRadius: '50%', position: 'relative' }}
          title="Notifications"
        >
          <Bell size={19} color="var(--text-primary)" />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-cta)',
            }}
          ></span>
        </button>

        {/* Primary CTA button using #A75D3A */}
        <button
          className="btn btn-primary btn-sm"
          onClick={handleLogout}
          title="Sign out"
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 1.15rem' }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
