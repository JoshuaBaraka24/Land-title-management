import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { loadBlockchainData } from '../../blockchain';
import '../GlobalStyles.css';
import './ManageLandRecords.css';

const ManageLandRecords = () => {
  const [landRecords, setLandRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title_deed_number: '',
    owner: '',
    location: '',
    area: '',
    verified: false
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchLandRecords();
  }, []);

  const fetchLandRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('land_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch blockchain verification status for each record
      const recordsWithBlockchain = await Promise.all(
        data.map(async (record) => {
          try {
            const { contract } = await loadBlockchainData();
            if (contract && contract.records) {
              const blockchainRecord = await contract.records(record.title_deed_number);
              return {
                ...record,
                blockchainVerified: blockchainRecord.verified
              };
            }
            return { ...record, blockchainVerified: false };
          } catch (error) {
            console.error(`Error fetching blockchain data for ${record.title_deed_number}:`, error);
            return { ...record, blockchainVerified: false };
          }
        })
      );

      setLandRecords(recordsWithBlockchain);
    } catch (error) {
      console.error('Error fetching land records:', error);
      setStatus('Error loading records: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditForm({
      title_deed_number: record.title_deed_number,
      owner: record.owner,
      location: record.location || '',
      area: record.area || '',
      verified: record.verified || false
    });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('land_records')
        .update({
          owner: editForm.owner,
          location: editForm.location,
          area: editForm.area,
          verified: editForm.verified,
          updated_at: new Date().toISOString()
        })
        .eq('title_deed_number', editForm.title_deed_number);

      if (error) throw error;

      setStatus('Record updated successfully!');
      setIsEditing(false);
      setSelectedRecord(null);
      fetchLandRecords();
    } catch (error) {
      console.error('Error updating record:', error);
      setStatus('Error updating record: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (titleDeedNumber) => {
    if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('land_records')
        .delete()
        .eq('title_deed_number', titleDeedNumber);

      if (error) throw error;

      setStatus('Record deleted successfully!');
      fetchLandRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      setStatus('Error deleting record: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOnBlockchain = async (titleDeedNumber) => {
    setLoading(true);
    try {
      const { contract } = await loadBlockchainData();
      if (contract && contract.verifyRecord) {
        await contract.verifyRecord(titleDeedNumber);
        setStatus('Record verified on blockchain successfully!');
        fetchLandRecords();
      } else {
        setStatus('Error: Blockchain verification not available');
      }
    } catch (error) {
      console.error('Error verifying on blockchain:', error);
      setStatus('Error verifying on blockchain: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = () => {
    if (!status) return '';
    if (status.includes('successfully')) return 'success';
    if (status.includes('Error')) return 'error';
    return 'info';
  };

  return (
    <div className="page-container">
      <div className="content-card">
        <div className="page-header">
          <h2 className="page-title">Manage Land Records</h2>
          <p className="page-subtitle">View, edit, and manage land title records from database and blockchain</p>
        </div>

        {status && (
          <div className={`message ${getStatusClass()}`}>
            {status}
          </div>
        )}

        {loading ? (
          <div className="loading-message">
            <p>Loading land records...</p>
          </div>
        ) : (
          <div className="records-container">
            <div className="records-header">
              <h3>Land Records ({landRecords.length})</h3>
              <button 
                onClick={fetchLandRecords} 
                className="btn btn-secondary btn-small"
                disabled={loading}
              >
                Refresh
              </button>
            </div>

            {landRecords.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <p>No land records found</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Title Deed</th>
                      <th>Owner</th>
                      <th>Location</th>
                      <th>Area</th>
                      <th>DB Verified</th>
                      <th>Blockchain</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {landRecords.map(record => (
                      <tr key={record.id}>
                        <td><strong>{record.title_deed_number}</strong></td>
                        <td>{record.owner}</td>
                        <td>{record.location || '-'}</td>
                        <td>{record.area || '-'}</td>
                        <td>
                          <span className={`status-badge ${record.verified ? 'status-verified' : 'status-pending'}`}>
                            {record.verified ? '✅ Verified' : '⏳ Pending'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${record.blockchainVerified ? 'status-verified' : 'status-pending'}`}>
                            {record.blockchainVerified ? '✅ Verified' : '⏳ Pending'}
                          </span>
                        </td>
                        <td className="action-buttons">
                          <button 
                            onClick={() => handleEdit(record)}
                            className="btn btn-secondary btn-small"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(record.title_deed_number)}
                            className="btn btn-danger btn-small"
                            disabled={loading}
                          >
                            Delete
                          </button>
                          {!record.blockchainVerified && (
                            <button 
                              onClick={() => handleVerifyOnBlockchain(record.title_deed_number)}
                              className="btn btn-primary btn-small"
                              disabled={loading}
                            >
                              Verify
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {isEditing && selectedRecord && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Edit Land Record</h3>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Title Deed Number</label>
                  <input
                    type="text"
                    value={editForm.title_deed_number}
                    disabled
                    className="disabled-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Owner Name</label>
                  <input
                    type="text"
                    value={editForm.owner}
                    onChange={e => setEditForm({...editForm, owner: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={e => setEditForm({...editForm, location: e.target.value})}
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Area</label>
                  <input
                    type="text"
                    value={editForm.area}
                    onChange={e => setEditForm({...editForm, area: e.target.value})}
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={editForm.verified}
                      onChange={e => setEditForm({...editForm, verified: e.target.checked})}
                      disabled={loading}
                    />
                    Verified in Database
                  </label>
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Record'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedRecord(null);
                    }}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLandRecords; 