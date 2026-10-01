import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  CalendarDays,
  Award,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import { DashboardCard } from '../../components/DashboardCard';
import { StatusBadge } from '../../components/StatusBadge';
import { MatchScore } from '../../components/MatchScore';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <LoadingSpinner text="Aggregating platform workforce telemetry..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#7E22CE', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <Activity size={16} />
          Executive Platform Governance
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
          MediOracle Platform Ecosystem
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          High-level metrics across all connected hospital facilities, healthcare professionals, and placement velocity
        </p>
      </div>

      {/* 4 KPIs */}
      <div className="stats-grid">
        <DashboardCard
          title="Total Facilities"
          value={data?.total_facilities || 5}
          subtext="Verified hospital networks"
          icon={Building2}
          color="blue"
        />
        <DashboardCard
          title="Total Professionals"
          value={data?.total_professionals || 10}
          subtext="Licensed clinical talent"
          icon={Users}
          color="purple"
        />
        <DashboardCard
          title="Active Shifts"
          value={data?.active_shifts || 12}
          subtext="Open across facilities"
          icon={CalendarDays}
          color="amber"
        />
        <DashboardCard
          title="Successful Placements"
          value={data?.successful_placements || 24}
          subtext="Fulfillments to date"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Platform Analytics Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={18} color="var(--brand-blue)" />
              Monthly Shift Placements & Growth
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>2026 Trend</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
            {data?.analytics?.monthly_placements?.map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100px' }}>
                  <div
                    style={{
                      width: '18px',
                      height: `${(item.shifts / 200) * 100}px`,
                      background: '#E2E8F0',
                      borderRadius: '3px 3px 0 0',
                    }}
                    title={`Shifts Posted: ${item.shifts}`}
                  ></div>
                  <div
                    style={{
                      width: '18px',
                      height: `${(item.placements / 200) * 100}px`,
                      background: '#7E22CE',
                      borderRadius: '3px 3px 0 0',
                    }}
                    title={`Placed: ${item.placements}`}
                  ></div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.month}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 10, height: 10, background: '#E2E8F0', borderRadius: 2 }}></span>
              <span>Total Shifts Requested</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 10, height: 10, background: '#7E22CE', borderRadius: 2 }}></span>
              <span>Successful Placements</span>
            </div>
          </div>
        </div>

        {/* Specialty Demand */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title">
              <Activity size={18} color="var(--accent-emerald-dark)" />
              Clinical Demand Share
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {data?.analytics?.specialty_demand?.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{item.specialty}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{item.percentage}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      background: idx === 0 ? 'var(--brand-blue)' : idx === 1 ? '#7E22CE' : 'var(--accent-emerald-dark)',
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Recent Tables */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <CalendarDays size={18} color="var(--brand-blue)" />
            Recent Platform Shifts
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Hospital Facility</th>
                <th>Role & Specialty</th>
                <th>Schedule</th>
                <th>Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.recent_shifts?.map((shift) => (
                <tr key={shift.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{shift.facility_name}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{shift.role}</div>
                    <span className="badge badge-specialty" style={{ marginTop: '0.15rem' }}>{shift.specialty}</span>
                  </td>
                  <td>
                    <div>{shift.date}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{shift.start_time} - {shift.end_time}</div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-emerald-dark)' }}>€{shift.rate.toFixed(2)}/hr</td>
                  <td><StatusBadge status={shift.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
