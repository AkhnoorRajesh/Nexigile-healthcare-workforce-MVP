import React, { useState, useEffect } from 'react';
import { FileCheck, Building2, User, Star } from 'lucide-react';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { MatchScore } from '../../components/MatchScore';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/applications');
        setApplications(res.data);
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
          Platform Application Telemetry
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Audit trail of candidate applications and hospital placement confirmations
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading applications..." />
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Hospital Facility</th>
                  <th>Shift Position</th>
                  <th>AI Match</th>
                  <th>Applied At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{app.professional?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.professional?.specialty} · {app.professional?.location}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.shift?.facility_name}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.shift?.role}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.shift?.date}</div>
                    </td>
                    <td><MatchScore score={app.match_score} showBreakdown={false} /></td>
                    <td>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {new Date(app.applied_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td><StatusBadge status={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
