import React, { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Euro, Award, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const CreateShiftModal = ({ isOpen, onClose, onShiftCreated }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    role: 'Registered Nurse',
    specialty: 'Emergency Care',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    start_time: '08:00',
    end_time: '20:00',
    location: 'Dublin',
    rate: 38.50,
    required_experience: 2,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rate' || name === 'required_experience' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.role || !formData.specialty || !formData.date || !formData.location) {
      setError('Please fill in all mandatory fields');
      return;
    }

    if (formData.rate <= 0) {
      setError('Hourly rate must be greater than €0');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/shifts', formData);
      addToast('New shift published successfully and open for applicants!', 'success');
      if (onShiftCreated) onShiftCreated(res.data);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create shift';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Clinical Shift"
      maxWidth="600px"
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Shift'}
          </button>
        </>
      }
    >
      {error && (
        <div
          style={{
            padding: '0.75rem',
            background: 'var(--rose-light)',
            color: 'var(--rose)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Clinical Role *</label>
            <select name="role" value={formData.role} onChange={handleChange} className="form-select">
              <option value="Registered Nurse">Registered Nurse</option>
              <option value="Staff Nurse">Staff Nurse</option>
              <option value="Healthcare Assistant">Healthcare Assistant</option>
              <option value="Clinical Pharmacist">Clinical Pharmacist</option>
              <option value="Physiotherapist">Physiotherapist</option>
              <option value="Social Care Worker">Social Care Worker</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Specialty *</label>
            <select name="specialty" value={formData.specialty} onChange={handleChange} className="form-select">
              <option value="Emergency Care">Emergency Care</option>
              <option value="ICU">ICU</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Rehabilitation">Rehabilitation</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location / City *</label>
            <select name="location" value={formData.location} onChange={handleChange} className="form-select">
              <option value="Dublin">Dublin</option>
              <option value="Cork">Cork</option>
              <option value="Galway">Galway</option>
              <option value="Limerick">Limerick</option>
              <option value="Waterford">Waterford</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Time *</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Time *</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Hourly Rate (€/hr) *</label>
            <input
              type="number"
              step="0.5"
              min="15"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Required Experience (Years) *</label>
            <input
              type="number"
              min="0"
              max="20"
              name="required_experience"
              value={formData.required_experience}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
