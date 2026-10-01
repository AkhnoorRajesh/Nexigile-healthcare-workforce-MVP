import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  FileCheck,
  Users,
  UserCheck,
  Activity,
  Briefcase,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--accent-cta)',
              boxShadow: '0 0 10px rgba(167, 93, 58, 0.7)',
            }}
          ></div>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.92rem', fontWeight: 600, color: '#FAF5EF', letterSpacing: '0.01em' }}>
            {role === 'ADMIN' ? 'Platform Governance' : role === 'FACILITY' ? 'Hospital Workforce' : 'Caregiver Portal'}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {role === 'FACILITY' && (
          <>
            <NavLink to="/facility/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/facility/shifts" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <CalendarDays size={18} />
              <span>Shifts</span>
            </NavLink>
            <NavLink to="/facility/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileCheck size={18} />
              <span>Applications</span>
            </NavLink>
            <NavLink to="/facility/professionals" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <UserCheck size={18} />
              <span>Matched Talent</span>
            </NavLink>
          </>
        )}

        {role === 'PROFESSIONAL' && (
          <>
            <NavLink to="/professional/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/professional/shifts" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Briefcase size={18} />
              <span>Available Shifts</span>
            </NavLink>
            <NavLink to="/professional/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileCheck size={18} />
              <span>My Applications</span>
            </NavLink>
            <NavLink to="/professional/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Award size={18} />
              <span>Credentials & Profile</span>
            </NavLink>
          </>
        )}

        {role === 'ADMIN' && (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Platform Overview</span>
            </NavLink>
            <NavLink to="/admin/facilities" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Activity size={18} />
              <span>Facilities</span>
            </NavLink>
            <NavLink to="/admin/professionals" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>Professionals</span>
            </NavLink>
            <NavLink to="/admin/shifts" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <CalendarDays size={18} />
              <span>Platform Shifts</span>
            </NavLink>
            <NavLink to="/admin/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileCheck size={18} />
              <span>All Placements</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div style={{ padding: '0.85rem 1rem', background: 'rgba(250,245,239,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(250,245,239,0.08)' }}>
          <div style={{ fontSize: '0.7rem', color: '#A8A29E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            System Runtime
          </div>
          <div style={{ fontSize: '0.82rem', color: '#F4ECE1', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-cta)' }}></span>
            FastAPI + SQLite Active
          </div>
        </div>
      </div>
    </aside>
  );
};
