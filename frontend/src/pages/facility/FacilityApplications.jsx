import React, { useState, useEffect } from 'react';
import { Check, X, FileCheck, Award, MapPin, Calendar, Clock, Star, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { MatchScore } from '../../components/MatchScore';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';

export const FacilityApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { addToast } = useToast();

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications', {
        params: {
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
        },
      });
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleAction = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      addToast(
        newStatus === 'ACCEPTED'
          ? 'Application ACCEPTED! Shift status has been updated to CONFIRMED.'
          : 'Application rejected.',
        newStatus === 'ACCEPTED' ? 'success' : 'info'
      );
      fetchApplications();
    } catch (err) {
      addToast('Failed to update application', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
            Clinical Candidate Applications
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Review AI competency matching, credentials, and confirm hospital placements
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter Status:</span>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Applications</option>
            <option value="APPLIED">Pending Review</option>
            <option value="ACCEPTED">Accepted / Placed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading candidate applications..." />
      ) : applications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {applications.map((app) => (
            <div key={app.id} className="card" style={{ marginBottom: 0, padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                {/* Candidate Info */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'var(--brand-blue-light)',
                      color: 'var(--brand-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      flexShrink: 0,
                    }}
                  >
                    {app.professional?.name ? app.professional.name.charAt(0) : 'P'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                        {app.professional?.name}
                      </h3>
                      <span className="badge badge-specialty">{app.professional?.specialty}</span>
                      <StatusBadge status={app.status} />
                    </div>

                    <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={14} color="var(--text-muted)" /> {app.professional?.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Award size={14} color="var(--text-muted)" /> {app.professional?.experience_years} Years Experience
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Star size={14} color="#F59E0B" fill="#F59E0B" /> {app.professional?.rating} Rating
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} color="var(--text-muted)" /> Avail: {app.professional?.availability}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Match Score Badge */}
                <div>
                  <MatchScore score={app.match_score} showBreakdown={false} />
                </div>
              </div>

              {/* Target Shift Banner */}
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginTop: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Shift Details
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)', marginTop: '0.1rem' }}>
                    {app.shift?.role} · {app.shift?.specialty}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {app.shift?.date} · {app.shift?.start_time} - {app.shift?.end_time} · {app.shift?.location}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shift Rate</div>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--accent-emerald-dark)' }}>
                      €{app.shift?.rate?.toFixed(2)}/hr
                    </div>
                  </div>

                  {/* Actions */}
                  {app.status === 'APPLIED' ? (
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      <button
                        className="btn btn-success"
                        onClick={() => handleAction(app.id, 'ACCEPTED')}
                        style={{ padding: '0.5rem 1.25rem' }}
                      >
                        <Check size={16} />
                        <span>Accept & Confirm</span>
                      </button>
                      <button
                        className="btn btn-danger-outline"
                        onClick={() => handleAction(app.id, 'REJECTED')}
                        style={{ padding: '0.5rem 1rem' }}
                      >
                        <X size={16} />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Decision Finalized
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileCheck}
          title="No applications in this view"
          description="Applications from healthcare professionals will appear here."
        />
      )}
    </div>
  );
};
