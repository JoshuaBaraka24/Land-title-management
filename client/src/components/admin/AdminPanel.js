import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import './AdminPanel.css';

const AdminPanel = () => {
  // Add state for the AddLandRecord form
  const [titleDeedNumber, setTitleDeedNumber] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('');

  const handleAddRecord = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="admin-panel">
      <h2>Administrator Dashboard</h2>
      <div className="admin-actions">
        <Link to="register-user" className="admin-card">
          <h3>Register New User</h3>
          <p>Create accounts for new administrators, legal officers, or citizens</p>
        </Link>
        
        <div className="admin-card">
          <h3>Manage Land Records</h3>
          <p>View and verify land title registrations</p>
        </div>
        
        <div className="admin-card">
          <h3>System Settings</h3>
          <p>Configure application parameters</p>
        </div>
      </div>
      {/* Add Land Record Form */}
      <div className="add-land-record-form">
        <h3>Add Land Record</h3>
        <form onSubmit={handleAddRecord}>
          <div>
            <label>Title Deed Number:</label>
            <input
              type="text"
              value={titleDeedNumber}
              onChange={e => setTitleDeedNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Owner:</label>
            <input
              type="text"
              value={owner}
              onChange={e => setOwner(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Record</button>
        </form>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
};

export default AdminPanel;