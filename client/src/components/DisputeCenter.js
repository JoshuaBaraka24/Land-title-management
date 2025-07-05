import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../authContext'; 
import './DisputeCenter.css';

const DisputeCenter = ({ adminView }) => {
  const [disputes, setDisputes] = useState([]);
  const [newDispute, setNewDispute] = useState({
    titleDeedNumber: '',
    description: '',
    evidence: ''
  });
  const [loading, setLoading] = useState(false);
  
  // Get current user from auth context
  const { currentUser } = useAuth();

  // Fetch disputes based on user role
  useEffect(() => {
    if (!currentUser) return; // Wait until user is loaded
    
    const fetchDisputes = async () => {
      setLoading(true);
      
      try {
        let query = supabase.from('disputes').select('*');
        
        if (!adminView) {
          // Citizens see only their disputes
          query = query.eq('reported_by', currentUser.uid);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setDisputes(data || []);
      } catch (error) {
        console.error("Error fetching disputes:", error);
        alert("Failed to load disputes");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDisputes();
  }, [adminView, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase.from('disputes').insert({
        dispute_id: `D${Date.now()}`,
        title_deed_number: newDispute.titleDeedNumber,
        description: newDispute.description,
        evidence: newDispute.evidence ? [{ type: 'text', description: newDispute.evidence }] : [],
        status: 'pending',
        reported_by: currentUser.uid,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (error) throw error;
      
      setNewDispute({ titleDeedNumber: '', description: '', evidence: '' });
      alert('Dispute reported successfully!');
      
      // Refresh the disputes list
      const { data, error: fetchError } = await supabase
        .from('disputes')
        .select('*')
        .eq('reported_by', currentUser.uid);
      
      if (!fetchError) {
        setDisputes(data || []);
      }
    } catch (error) {
      console.error('Error reporting dispute:', error);
      alert('Failed to report dispute');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDispute(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dispute-center">
      <h2>{adminView ? 'Dispute Management' : 'Report Land Dispute'}</h2>
      
      {!adminView && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title Deed Number</label>
            <input
              type="text"
              name="titleDeedNumber"
              value={newDispute.titleDeedNumber}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newDispute.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label>Evidence (URLs or descriptions)</label>
            <textarea
              name="evidence"
              value={newDispute.evidence}
              onChange={handleChange}
              rows={2}
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Report Dispute'}
          </button>
        </form>
      )}
      
      <div className="dispute-list">
        <h3>{adminView ? 'All Disputes' : 'My Reported Disputes'}</h3>
        
        {loading ? (
          <p>Loading disputes...</p>
        ) : disputes.length === 0 ? (
          <p>No disputes found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title Deed</th>
                {adminView && <th>Reporter</th>}
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
                {adminView && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {disputes.map(dispute => (
                <tr key={dispute.id}>
                  <td>{dispute.title_deed_number}</td>
                  {adminView && <td>{dispute.reported_by}</td>}
                  <td className="description-cell">{dispute.description}</td>
                  <td className={`status-${dispute.status}`}>
                    {dispute.status}
                  </td>
                  <td>{new Date(dispute.created_at).toLocaleDateString()}</td>
                  {adminView && (
                    <td>
                      <button>View Details</button>
                      {dispute.status === 'pending' && <button>Resolve</button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DisputeCenter;