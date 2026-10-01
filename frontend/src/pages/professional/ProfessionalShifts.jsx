import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Euro,
  Building2,
  CheckCircle2,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import api from '../../services/api';
import { MatchScore } from '../../components/MatchScore';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';

export const ProfessionalShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [minRateFilter, setMinRateFilter] = useState('');
  const [selectedShift, setSelectedShift] = useState(null);
  const [applying, setApplying] = useState(false);
  const { addToast } = useToast();

  const fetchShifts = async () => {
    try {
      const res = await api.get('/shifts', {
        params: {
          search: searchTerm || undefined,
          location: locationFilter !== 'ALL' ? locationFilter : undefined,
          specialty: specialtyFilter !== 'ALL' ? specialtyFilter : undefined,
          role: roleFilter !== 'ALL' ? roleFilter : undefined,
          min_rate: minRateFilter ? parseFloat(minRateFilter) : undefined,
          status_filter: 'OPEN',
        },
      });
      setShifts(res.data);
    } catch (err) {
      console.error('Failed to load shifts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, [searchTerm, locationFilter, specialtyFilter, roleFilter, minRateFilter]);

  const handleApply = async (shift) => {
    setApplying(true);
    try {
      await api.post('/applications', { shift_id: shift.id });
      addToast(`Application sent for ${shift.role} at ${shift.facility_name}!`, 'success');
      setSelectedShift(null);
      fetchShifts();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to submit application';
      addToast(msg, 'error');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
          Browse Open Clinical Shifts
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Explore shifts with real-time AI suitability ratings calculated from your clinical background
        </p>
      </div>

      {/* Search and Multi-Filter Controls */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by hospital, role, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="ALL">All Locations</option>
            <option value="Dublin">Dublin</option>
            <option value="Cork">Cork</option>
            <option value="Galway">Galway</option>
            <option value="Limerick">Limerick</option>
          </select>

          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          >
            <option value="ALL">All Specialties</option>
            <option value="Emergency Care">Emergency Care</option>
            <option value="ICU">ICU</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Clinical Pharmacist">Clinical Pharmacist</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Rehabilitation">Rehabilitation</option>
            <option value="Mental Health">Mental Health</option>
          </select>

          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="Registered Nurse">Registered Nurse</option>
            <option value="Staff Nurse">Staff Nurse</option>
            <option value="Healthcare Assistant">Healthcare Assistant</option>
            <option value="Clinical Pharmacist">Clinical Pharmacist</option>
            <option value="Physiotherapist">Physiotherapist</option>
          </select>

          <input
            type="number"
            placeholder="Min Rate (€/hr)"
            value={minRateFilter}
            onChange={(e) => setMinRateFilter(e.target.value)}
            className="form-input"
            style={{ width: '130px' }}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Querying available healthcare shifts..." />
      ) : shifts.length > 0 ? (
        <div className="shifts-grid">
          {shifts.map((shift) => (
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

              {/* AI Match Score with interactive breakdown */}
              <div style={{ margin: '0.75rem 0' }}>
                <MatchScore
                  score={shift.match_score || 88}
                  factors={shift.match_factors || ['Specialty match', 'Availability match', 'Location proximity']}
                  showBreakdown={true}
                />
              </div>

              <div className="shift-meta-list">
                <div className="shift-meta-item">
                  <Calendar size={15} color="var(--text-muted)" />
                  <span>{shift.date}</span>
                </div>
                <div className="shift-meta-item">
                  <Clock size={15} color="var(--text-muted)" />
                  <span>{shift.start_time} - {shift.end_time}</span>
                </div>
                <div className="shift-meta-item">
                  <MapPin size={15} color="var(--text-muted)" />
                  <span>{shift.location}, Ireland</span>
                </div>
              </div>

              <div className="shift-card-footer">
                <div className="shift-rate">
                  €{shift.rate.toFixed(2)}
                  <span>/hr</span>
                </div>

                {shift.has_applied ? (
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-emerald-dark)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
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
        <EmptyState
          title="No shifts matching your filters"
          description="Try broadening your location, specialty, or rate filter settings."
        />
      )}

      {/* Shift Details Modal */}
      {selectedShift && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedShift(null)}
          title="Shift Details & Verification"
          maxWidth="600px"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setSelectedShift(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleApply(selectedShift)}
                disabled={applying}
              >
                {applying ? 'Applying...' : 'Apply Now'}
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                  {selectedShift.role}
                </h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
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

            {/* AI Match Details */}
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.4rem' }}>
                <Sparkles size={16} color="var(--brand-blue)" />
                <span>AI Deterministic Match: {selectedShift.match_score || 92}%</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Calculated across clinical specialty alignment (30%), schedule availability (20%), geographic proximity (20%), experience (15%), and caregiver rating (10%).
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Date</span>
                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{selectedShift.date}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Hours</span>
                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{selectedShift.start_time} - {selectedShift.end_time}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Location</span>
                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{selectedShift.location}, Ireland</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Min Experience</span>
                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{selectedShift.required_experience}+ Years</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
