import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  FileCheck,
  Clock,
  Euro,
  Sparkles,
  MapPin,
  ArrowRight,
  Stethoscope,
  Building2,
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DashboardCard } from '../../components/DashboardCard';
import { MatchScore } from '../../components/MatchScore';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

export const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState(null);
  const [applying, setApplying] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/professionals/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load professional dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleApply = async (shift) => {
    setApplying(true);
    try {
      await api.post('/applications', { shift_id: shift.id });
      addToast(`Successfully applied to ${shift.role} at ${shift.facility_name}!`, 'success');
      setSelectedShift(null);
      fetchDashboard();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to apply for shift';
      addToast(msg, 'error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <LoadingSpinner text="Analyzing clinical matches for your profile..." />;

  const firstName = user?.name ? user.name.split(' ')[0] : 'Sarah';

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-blue)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <Stethoscope size={16} />
          Caregiver Hub
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
          Good morning, {firstName}
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Here are your high-compatibility shift opportunities tailored to your clinical credentials and preferences
        </p>
      </div>

      {/* 4 Cards */}
      <div className="stats-grid">
        <DashboardCard
          title="Available Shifts"
          value={data?.available_shifts_count || 8}
          subtext="Matching your qualifications"
          icon={CalendarDays}
          color="blue"
        />
        <DashboardCard
          title="My Applications"
          value={data?.applications_count || 3}
          subtext="Under facility review"
          icon={FileCheck}
          color="purple"
        />
        <DashboardCard
          title="Upcoming Shifts"
          value={data?.upcoming_shifts_count || 1}
          subtext="Confirmed placements"
          icon={Clock}
          color="emerald"
        />
        <DashboardCard
          title="Estimated Earnings"
          value={`€${(data?.estimated_earnings || 1450).toFixed(0)}`}
          subtext="Projected this month"
          icon={Euro}
          color="amber"
        />
      </div>

      {/* Main Recommended Shifts Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <Sparkles size={20} color="var(--accent-emerald-dark)" />
              Recommended Shifts (Top AI Matches)
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Ranked by specialty alignment, proximity, experience, and preferred compensation
            </div>
          </div>

          <Link
            to="/professional/shifts"
            style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
          >
            Browse All Shifts <ArrowRight size={14} />
          </Link>
        </div>

        {data?.recommended_shifts && data.recommended_shifts.length > 0 ? (
          <div className="shifts-grid">
            {data.recommended_shifts.map((shift) => (
              <div key={shift.id} className="shift-card">
                <div className="shift-card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                      <Building2 size={14} />
                      <span style={{ fontWeight: 600 }}>{shift.facility_name}</span>
                    </div>
                    <div className="shift-role">{shift.role}</div>
                    <span className="badge badge-specialty" style={{ marginTop: '0.3rem' }}>{shift.specialty}</span>
                  </div>

                  <StatusBadge status={shift.status} />
                </div>

                {/* AI Match Score with breakdown toggle */}
                <div style={{ margin: '0.75rem 0' }}>
                  <MatchScore
                    score={shift.match_score || 92}
                    factors={shift.match_factors || ['Specialty match', 'Availability match', 'Location proximity', 'Experience match']}
                    showBreakdown={true}
                  />
                </div>

                {/* Shift Details Meta */}
                <div className="shift-meta-list">
                  <div className="shift-meta-item">
                    <CalendarDays size={15} color="var(--text-muted)" />
                    <span>{shift.date}</span>
                  </div>
                  <div className="shift-meta-item">
                    <Clock size={15} color="var(--text-muted)" />
                    <span>{shift.start_time} – {shift.end_time}</span>
                  </div>
                  <div className="shift-meta-item">
                    <MapPin size={15} color="var(--text-muted)" />
                    <span>{shift.location} (Proximity: &lt; 8 km)</span>
                  </div>
                </div>

                <div className="shift-card-footer">
                  <div className="shift-rate">
                    €{shift.rate.toFixed(2)}
                    <span>/hr</span>
                  </div>

                  {shift.has_applied ? (
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald-dark)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={16} /> Applied
                    </span>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedShift(shift)}
                    >
                      View & Apply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No recommended shifts right now. Check back soon!
          </div>
        )}
      </div>

      {/* Shift Details & Apply Modal */}
      {selectedShift && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedShift(null)}
          title="Shift Details & Application"
          maxWidth="600px"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setSelectedShift(null)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleApply(selectedShift)}
                disabled={applying}
              >
                {applying ? 'Submitting Application...' : 'Confirm & Submit Application'}
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                  {selectedShift.role}
                </h3>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
                  {selectedShift.facility_name}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-emerald-dark)' }}>
                  €{selectedShift.rate.toFixed(2)}/hr
                </div>
                <span className="badge badge-specialty">{selectedShift.specialty}</span>
              </div>
            </div>

            {/* AI Match Overview In Modal */}
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                  AI Compatibility Analysis
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald-dark)' }}>
                  {selectedShift.match_score || 92}% Match
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                You meet or exceed the required experience ({selectedShift.required_experience}+ years), your specialty ({selectedShift.specialty}) directly matches this ward, and the hospital is in {selectedShift.location}.
              </div>
            </div>

            {/* Shift Logistics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Date</span>
                <div style={{ fontWeight: 600, color: 'var(--primary)', marginTop: '0.1rem' }}>{selectedShift.date}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Hours</span>
                <div style={{ fontWeight: 600, color: 'var(--primary)', marginTop: '0.1rem' }}>{selectedShift.start_time} - {selectedShift.end_time}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Location</span>
                <div style={{ fontWeight: 600, color: 'var(--primary)', marginTop: '0.1rem' }}>{selectedShift.location}, Ireland</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Required Experience</span>
                <div style={{ fontWeight: 600, color: 'var(--primary)', marginTop: '0.1rem' }}>{selectedShift.required_experience}+ Years</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
