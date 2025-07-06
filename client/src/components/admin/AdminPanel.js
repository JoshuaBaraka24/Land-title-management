import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import '../GlobalStyles.css';
import './AdminPanel.css';

const AdminPanel = () => {
  const [titleDeedNumber, setTitleDeedNumber] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('Submitting...');
    
    try {
      const { error } = await supabase
        .from('land_records')
        .insert({
          id: titleDeedNumber,
          title_deed_number: titleDeedNumber,
          owner: owner,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setStatus('Record added successfully!');
      setTitleDeedNumber('');
      setOwner('');
    } catch (err) {
      console.error('Error adding record:', err);
      setStatus('Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = () => {
    if (!status) return '';
    if (status.includes('successfully')) return 'success';
    if (status.includes('Error')) return 'error';
    if (status.includes('Submitting')) return 'warning';
    return 'info';
  };

  return (
    <div className="page-container">
      <div className="content-card">
        <div className="page-header">
          <h2 className="page-title">Administrator Dashboard</h2>
          <p className="page-subtitle">Manage land records, users, and system settings</p>
        </div>
        
        <div className="admin-actions">
          <Link to="register-user" className="admin-card">
            <div className="card-icon">👥</div>
            <h3>Register New User</h3>
            <p>Create accounts for new administrators, legal officers, or citizens</p>
            <span className="card-arrow">→</span>
          </Link>
          
          <div className="admin-card">
            <div className="card-icon">📋</div>
            <h3>Manage Land Records</h3>
            <p>View and verify land title registrations</p>
            <span className="card-arrow">→</span>
          </div>
          
          <div className="admin-card">
            <div className="card-icon">⚙️</div>
            <h3>System Settings</h3>
            <p>Configure application parameters and security settings</p>
            <span className="card-arrow">→</span>
          </div>
        </div>

        <div className="add-land-record-section">
          <h3>Add Land Record</h3>
          <form onSubmit={handleAddRecord}>
            <div className="form-group">
              <label>Title Deed Number</label>
              <input
                type="text"
                value={titleDeedNumber}
                onChange={e => setTitleDeedNumber(e.target.value)}
                placeholder="Enter the title deed number"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>Owner Name</label>
              <input
                type="text"
                value={owner}
                onChange={e => setOwner(e.target.value)}
                placeholder="Enter the owner's full name"
                required
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary btn-large ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Adding Record...' : 'Add Land Record'}
            </button>
          </form>
          
          {status && (
            <div className={`message ${getStatusClass()}`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;