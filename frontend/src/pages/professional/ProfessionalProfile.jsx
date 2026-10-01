import React from 'react';
import { User, Award, MapPin, Clock, Star, ShieldCheck, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfessionalProfile = () => {
  const { user } = useAuth();
  const prof = user?.professional;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
          Clinical Credentials & Profile
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Your verified credentials used by MediOracle AI for automated competency matching
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Left ID Card */}
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '2rem',
              margin: '0 auto 1rem auto',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
            }}
          >
            {user?.name ? user.name.charAt(0) : 'S'}
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
            {user?.name || 'Sarah Jenkins, RN'}
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--brand-blue)', fontWeight: 600, marginTop: '0.2rem' }}>
            {prof?.specialty || 'Emergency Care'} Specialist
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.75rem', padding: '0.25rem 0.65rem', background: '#D1FAE5', color: '#065F46', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
            <ShieldCheck size={14} /> NMBI & Garda Vetted
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '1.5rem', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <Mail size={15} color="var(--text-muted)" />
              <span>{user?.email || 'professional@medioracle.com'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <MapPin size={15} color="var(--text-muted)" />
              <span>{prof?.location || 'Dublin'}, Ireland</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <Clock size={15} color="var(--text-muted)" />
              <span>Availability: <strong>{prof?.availability || 'Immediate'}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Details Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Award size={18} color="var(--brand-blue)" />
              Competency & Experience Profile
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg-page)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Clinical Specialty</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.2rem' }}>
                {prof?.specialty || 'Emergency Care'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Weights 30% in AI Matching Engine
              </div>
            </div>

            <div style={{ background: 'var(--bg-page)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Clinical Experience</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.2rem' }}>
                {prof?.experience_years || 6} Years Post-Graduation
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Weights 15% in AI Matching Engine
              </div>
            </div>

            <div style={{ background: 'var(--bg-page)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Caregiver Rating</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                {prof?.rating || 4.9} / 5.0 (Top 5%)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Based on 28 completed hospital shifts
              </div>
            </div>

            <div style={{ background: 'var(--bg-page)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Geographic Base</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.2rem' }}>
                {prof?.location || 'Dublin'} Region
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Weights 20% in AI Matching Engine
              </div>
            </div>
          </div>

          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '0.85rem', color: '#1E40AF' }}>
            <strong>💡 AI Match Optimization:</strong> Keep your specialty and availability updated to ensure your profile appears at the top of hospital recommended candidate lists.
          </div>
        </div>
      </div>
    </div>
  );
};
