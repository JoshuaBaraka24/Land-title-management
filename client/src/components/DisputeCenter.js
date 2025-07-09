import React, { useEffect, useState } from 'react';
import { useAuth } from '../authContext';
import { supabase } from '../supabase';
import './DisputeCenter.css';
import './GlobalStyles.css';

const DisputeCenter = ({ adminView }) => {
  const [disputes, setDisputes] = useState([]);
  const [newDispute, setNewDispute] = useState({
    titleDeedNumber: '',
    description: '',
    evidence: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchDisputes = async () => {
      setLoading(true);
      
      try {
        let query = supabase.from('disputes').select('*');
        
        if (!adminView) {
          // For citizen view, check both UID and fullname to handle existing and new disputes
          query = query.or(`reported_by.eq.${currentUser.uid},reported_by.eq.${currentUser.fullname}`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // If admin view, fetch reporter names for disputes that still have UIDs
        if (adminView && data && data.length > 0) {
          const disputesWithUIDs = data.filter(dispute => 
            dispute.reported_by && dispute.reported_by.length > 20 // UIDs are typically longer
          );
          
          if (disputesWithUIDs.length > 0) {
            const reporterIds = [...new Set(disputesWithUIDs.map(dispute => dispute.reported_by))];
            
            const { data: profiles, error: profilesError } = await supabase
              .from('profiles')
              .select('id, email, fullname')
              .in('id', reporterIds);
            
            if (!profilesError && profiles) {
              const profilesMap = {};
              profiles.forEach(profile => {
                profilesMap[profile.id] = profile;
              });
              
              // Update disputes with UIDs to show fullnames
              const updatedDisputes = data.map(dispute => {
                if (dispute.reported_by && dispute.reported_by.length > 20) {
                  // This is likely a UID, try to get the fullname
                  const profile = profilesMap[dispute.reported_by];
                  return {
                    ...dispute,
                    reported_by: profile ? profile.fullname : dispute.reported_by
                  };
                }
                return dispute;
              });
              
              setDisputes(updatedDisputes);
            } else {
              setDisputes(data || []);
            }
          } else {
            setDisputes(data || []);
          }
        } else {
          setDisputes(data || []);
        }
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
      // First, check if the title deed exists
      const { data: landRecord, error: landError } = await supabase
        .from('land_records')
        .select('title_deed_number')
        .eq('title_deed_number', newDispute.titleDeedNumber)
        .single();
      
      if (landError || !landRecord) {
        alert('Title deed not found. Please enter a valid title deed number.');
        setLoading(false);
        return;
      }
      
      const disputeData = {
        id: `dispute-${Date.now()}`,
        dispute_id: `D${Date.now()}`,
        title_deed_number: newDispute.titleDeedNumber,
        description: newDispute.description,
        evidence: newDispute.evidence ? [{ type: 'text', description: newDispute.evidence }] : [],
        status: 'pending',
        priority: 'medium',
        reported_by: currentUser.fullname,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Submitting dispute data:', disputeData);
      
      const { error } = await supabase.from('disputes').insert(disputeData);
      
      if (error) {
        console.error('Supabase insert error details:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        throw error;
      }
      
      setNewDispute({ titleDeedNumber: '', description: '', evidence: '' });
      alert('Dispute reported successfully!');
      
      // Refresh the disputes list
      const { data, error: fetchError } = await supabase
        .from('disputes')
        .select('*')
        .or(`reported_by.eq.${currentUser.uid},reported_by.eq.${currentUser.fullname}`);
      
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

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'resolved': return 'status-resolved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  return (
    <div className="page-container">
      <div className="content-card">
        <div className="page-header">
          <h2 className="page-title">
            {adminView ? 'Dispute Management' : 'Report Land Dispute'}
          </h2>
          <p className="page-subtitle">
            {adminView ? 'Manage and resolve land disputes' : 'Report a land title dispute for investigation'}
          </p>
        </div>
        
        {!adminView && (
          <div className="dispute-form-section">
            <h3>Report New Dispute</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title Deed Number</label>
                <input
                  type="text"
                  name="titleDeedNumber"
                  value={newDispute.titleDeedNumber}
                  onChange={handleChange}
                  placeholder="Enter the title deed number in dispute"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Description of Dispute</label>
                <textarea
                  name="description"
                  value={newDispute.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of the dispute..."
                  required
                  rows={4}
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Supporting Evidence</label>
                <textarea
                  name="evidence"
                  value={newDispute.evidence}
                  onChange={handleChange}
                  placeholder="Provide URLs, documents, or descriptions of evidence..."
                  rows={3}
                  disabled={loading}
                />
              </div>
              
              <button 
                type="submit" 
                className={`btn btn-primary btn-large ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Report Dispute'}
              </button>
            </form>
          </div>
        )}
        
        <div className="dispute-list-section">
          <h3>{adminView ? 'All Disputes' : 'My Reported Disputes'}</h3>
          
          {loading ? (
            <div className="loading-message">
              <p>Loading disputes...</p>
            </div>
          ) : disputes.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p>No disputes found</p>
            </div>
          ) : (
            <div className="table-container">
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
                      <td><strong>{dispute.title_deed_number}</strong></td>
                      {adminView && <td>{dispute.reported_by}</td>}
                      <td className="description-cell">
                        <div className="description-content">
                          {dispute.description}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(dispute.status)}`}>
                          {dispute.status}
                        </span>
                      </td>
                      <td>{new Date(dispute.created_at).toLocaleDateString()}</td>
                      {adminView && (
                        <td className="action-buttons">
                          {dispute.status === 'pending' && (
                            <button className="btn btn-primary btn-small">Resolve</button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputeCenter;