import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Building2 } from 'lucide-react';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AdminShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await api.get('/shifts');
        setShifts(res.data);
      } catch (err) {
        console.error('Failed to load platform shifts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShifts();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
          Platform Shifts Management
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          All shifts across all registered hospital networks
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading shifts..." />
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hospital Facility</th>
                  <th>Role & Specialty</th>
                  <th>Schedule</th>
                  <th>Location</th>
                  <th>Hourly Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{s.facility_name}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.role}</div>
                      <span className="badge badge-specialty" style={{ marginTop: '0.15rem' }}>{s.specialty}</span>
                    </td>
                    <td>
                      <div>{s.date}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.start_time} - {s.end_time}</div>
                    </td>
                    <td>{s.location}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-emerald-dark)' }}>€{s.rate.toFixed(2)}/hr</td>
                    <td><StatusBadge status={s.status} /></td>
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
