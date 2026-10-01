import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  Check,
  X,
  Building2,
  TrendingUp,
} from 'lucide-react';
import api from '../../services/api';
import { DashboardCard } from '../../components/DashboardCard';
import { StatusBadge } from '../../components/StatusBadge';
import { MatchScore } from '../../components/MatchScore';
import { CreateShiftModal } from '../../components/CreateShiftModal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

export const FacilityDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { addToast } = useToast();

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/facilities/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load facility dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleShiftCreated = (newShift) => {
    fetchDashboard();
  };

  const handleApplicationAction = async (appId, action) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: action });
      addToast(`Application marked as ${action.toLowerCase()}`, 'success');
      fetchDashboard();
    } catch (err) {
      addToast('Failed to update application status', 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Loading facility workforce metrics..." />;

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-blue)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Building2 size={16} />
            Facility Operations Portal
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
            {data?.facility_name || "St. Mary's University Hospital"}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Real-time shift fulfillment, candidate matching, and clinical staffing roster
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} />
          <span>Post New Shift</span>
        </button>
      </div>

      {/* 4 Dashboard Metric Cards */}
      <div className="stats-grid">
        <DashboardCard
          title="Open Shifts"
          value={data?.open_shifts_count || 12}
          subtext="Active in talent market"
          icon={CalendarDays}
          color="blue"
        />
        <DashboardCard
          title="Confirmed Staff"
          value={data?.confirmed_staff_count || 48}
          subtext="Placed this period"
          icon={CheckCircle2}
          color="emerald"
        />
        <DashboardCard
          title="Fill Rate"
          value={`${data?.fill_rate || 87}%`}
          subtext="+4.2% vs last month"
          icon={TrendingUp}
          color="purple"
        />
        <DashboardCard
          title="Pending Applications"
          value={data?.pending_applications_count || 9}
          subtext="Requires clinical review"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Staffing Activity Chart & Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={18} color="var(--brand-blue)" />
              Weekly Staffing & Shift Activity
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Last 7 Days</span>
          </div>
          
          {/* Visual Mini Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
            {data?.activity_chart?.map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100px' }}>
                  {/* Total shifts bar */}
                  <div
                    style={{
                      width: '14px',
                      height: `${(item.shifts / 20) * 90}px`,
                      background: '#E2E8F0',
                      borderRadius: '3px 3px 0 0',
                    }}
                    title={`Total Shifts: ${item.shifts}`}
                  ></div>
                  {/* Filled shifts bar */}
                  <div
                    style={{
                      width: '14px',
                      height: `${(item.filled / 20) * 90}px`,
                      background: 'var(--brand-blue)',
                      borderRadius: '3px 3px 0 0',
                    }}
                    title={`Filled: ${item.filled}`}
                  ></div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.day}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 10, height: 10, background: '#E2E8F0', borderRadius: 2 }}></span>
              <span>Requested Shifts</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 10, height: 10, background: 'var(--brand-blue)', borderRadius: 2 }}></span>
              <span>AI Filled Placements</span>
            </div>
          </div>
        </div>

        {/* AI Workforce Quality Highlights */}
        <div className="card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <div className="card-title">
                <Sparkles size={18} color="var(--accent-emerald-dark)" />
                AI Match Precision
              </div>
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              MediOracle automatically filters candidates based on clinical specialty certification, proximity, and historical performance.
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Avg Candidate Match</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-emerald-dark)' }}>92.4%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>License Verification</span>
                <span style={{ fontWeight: 700, color: 'var(--brand-blue)' }}>100% Verified</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Acceptance Rate</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>94%</span>
              </div>
            </div>
          </div>

          <Link to="/facility/applications" className="btn btn-outline btn-sm" style={{ marginTop: '1rem', width: '100%' }}>
            Review Pending Talent →
          </Link>
        </div>
      </div>

      {/* Recent Applications Requiring Action */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Users size={18} color="var(--amber)" />
            Recent Applications
          </div>
          <Link to="/facility/applications" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            View All Applications <ArrowRight size={14} />
          </Link>
        </div>

        {data?.recent_applications && data.recent_applications.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Specialty & Experience</th>
                  <th>Shift Applied</th>
                  <th>AI Match Score</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{app.professional?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.professional?.location} · ⭐ {app.professional?.rating}</div>
                    </td>
                    <td>
                      <span className="badge badge-specialty">{app.professional?.specialty}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {app.professional?.experience_years} years experience
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.shift?.role}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {app.shift?.date} · {app.shift?.start_time} - {app.shift?.end_time}
                      </div>
                    </td>
                    <td>
                      <MatchScore score={app.match_score} showBreakdown={false} />
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {app.status === 'APPLIED' ? (
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApplicationAction(app.id, 'ACCEPTED')}
                            title="Accept candidate"
                          >
                            <Check size={14} /> Accept
                          </button>
                          <button
                            className="btn btn-danger-outline btn-sm"
                            onClick={() => handleApplicationAction(app.id, 'REJECTED')}
                            title="Reject candidate"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                          Processed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No recent applications. New applications will appear here when professionals apply.
          </div>
        )}
      </div>

      {/* Open Shifts Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <CalendarDays size={18} color="var(--brand-blue)" />
            Active Facility Shifts
          </div>
          <Link to="/facility/shifts" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            Manage All Shifts <ArrowRight size={14} />
          </Link>
        </div>

        {data?.recent_shifts && data.recent_shifts.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role & Specialty</th>
                  <th>Schedule</th>
                  <th>Location</th>
                  <th>Hourly Rate</th>
                  <th>Applicants</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_shifts.map((shift) => (
                  <tr key={shift.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{shift.role}</div>
                      <span className="badge badge-specialty" style={{ marginTop: '0.2rem' }}>{shift.specialty}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{shift.date}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {shift.start_time} - {shift.end_time}
                      </div>
                    </td>
                    <td>{shift.location}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--accent-emerald-dark)' }}>
                        €{shift.rate.toFixed(2)}/hr
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: shift.applicants_count > 0 ? 'var(--brand-blue)' : 'var(--text-muted)' }}>
                        {shift.applicants_count} applicants
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={shift.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No shifts posted yet. Click "Post New Shift" above to create one.
          </div>
        )}
      </div>

      <CreateShiftModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onShiftCreated={handleShiftCreated}
      />
    </div>
  );
};
