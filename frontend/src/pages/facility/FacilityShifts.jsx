import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Filter, Clock, MapPin, Euro, Award, Search } from 'lucide-react';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { CreateShiftModal } from '../../components/CreateShiftModal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';

export const FacilityShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchShifts = async () => {
    try {
      const res = await api.get('/shifts', {
        params: {
          facility_only: true,
          status_filter: statusFilter !== 'ALL' ? statusFilter : undefined,
          search: searchTerm || undefined,
        },
      });
      setShifts(res.data);
    } catch (err) {
      console.error('Failed to fetch facility shifts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, [statusFilter, searchTerm]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
            Facility Shift Roster
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Manage, schedule, and track fulfillment across hospital units
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} />
          <span>Create New Shift</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by role, specialty, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="APPLIED">Applied</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Shifts Table */}
      {loading ? (
        <LoadingSpinner text="Fetching facility shifts..." />
      ) : shifts.length > 0 ? (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role & Specialty</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Hourly Rate</th>
                  <th>Req. Experience</th>
                  <th>Applicants</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr key={shift.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{shift.role}</div>
                      <span className="badge badge-specialty" style={{ marginTop: '0.2rem' }}>{shift.specialty}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{shift.date}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {shift.start_time} - {shift.end_time}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <MapPin size={14} />
                        {shift.location}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-emerald-dark)' }}>
                        €{shift.rate.toFixed(2)}
                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/hr</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {shift.required_experience}+ years
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: shift.applicants_count > 0 ? 'var(--brand-blue)' : 'var(--text-muted)' }}>
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
        </div>
      ) : (
        <EmptyState
          title="No shifts found"
          description="You haven't posted any shifts matching these filters yet."
          actionLabel="Create Your First Shift"
          onAction={() => setIsCreateModalOpen(true)}
        />
      )}

      <CreateShiftModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onShiftCreated={() => fetchShifts()}
      />
    </div>
  );
};
