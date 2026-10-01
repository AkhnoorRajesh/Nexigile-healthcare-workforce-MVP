import React, { useState, useEffect } from 'react';
import { UserCheck, MapPin, Award, Star, Clock, Search, Filter } from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const FacilityProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');

  useEffect(() => {
    const fetchProfs = async () => {
      try {
        const res = await api.get('/professionals');
        setProfessionals(res.data);
      } catch (err) {
        console.error('Failed to load professionals', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfs();
  }, []);

  const filtered = professionals.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = specialtyFilter === 'ALL' || p.specialty === specialtyFilter;
    return matchesSearch && matchesSpec;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
          Verified Healthcare Talent Pool
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Pre-screened registered nurses, healthcare assistants, and clinical specialists available for placement
        </p>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search professionals by name, specialty, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Specialty:</span>
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
            <option value="Rehabilitation">Rehabilitation</option>
            <option value="Mental Health">Mental Health</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching verified clinical roster..." />
      ) : (
        <div className="shifts-grid">
          {filtered.map((prof) => (
            <div key={prof.id} className="card" style={{ marginBottom: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    background: 'var(--brand-blue-light)',
                    color: 'var(--brand-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                  }}
                >
                  {prof.name ? prof.name.charAt(0) : 'P'}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)' }}>{prof.name}</div>
                  <span className="badge badge-specialty" style={{ marginTop: '0.15rem' }}>{prof.specialty}</span>
                </div>
              </div>

              <div className="shift-meta-list" style={{ margin: '0.5rem 0 1rem 0' }}>
                <div className="shift-meta-item">
                  <MapPin size={15} color="var(--text-muted)" />
                  <span>{prof.location}, Ireland</span>
                </div>
                <div className="shift-meta-item">
                  <Award size={15} color="var(--text-muted)" />
                  <span>{prof.experience_years} years clinical experience</span>
                </div>
                <div className="shift-meta-item">
                  <Clock size={15} color="var(--text-muted)" />
                  <span>Availability: <strong>{prof.availability}</strong></span>
                </div>
                <div className="shift-meta-item">
                  <Star size={15} color="#F59E0B" fill="#F59E0B" />
                  <span>Caregiver Rating: <strong>{prof.rating} / 5.0</strong></span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <UserCheck size={14} /> Verified License
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-blue)' }}>
                  Ready to Dispatch
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
