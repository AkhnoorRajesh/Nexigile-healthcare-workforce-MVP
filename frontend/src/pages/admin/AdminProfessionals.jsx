import React, { useState, useEffect } from 'react';
import { Users, MapPin, Award, Star, Clock } from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AdminProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
          Platform Healthcare Professionals
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Vetted clinicians, specialists, and care assistants registered on MediOracle
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading clinicians..." />
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Professional Name</th>
                  <th>Clinical Specialty</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Availability</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {professionals.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.email}</div>
                    </td>
                    <td>
                      <span className="badge badge-specialty">{p.specialty}</span>
                    </td>
                    <td>{p.experience_years} years</td>
                    <td>{p.location}, Ireland</td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--brand-blue)' }}>{p.availability}</span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 700 }}>
                        <Star size={14} color="#F59E0B" fill="#F59E0B" /> {p.rating}
                      </span>
                    </td>
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
