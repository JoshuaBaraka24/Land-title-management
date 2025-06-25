import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
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
      let q;
      
      if (adminView) {
        // Legal officers see all disputes
        q = query(collection(db, 'disputes'));
      } else {
        // Citizens see only their disputes
        q = query(collection(db, 'disputes'), 
              where('reportedBy', '==', currentUser.uid));
      }
      
      try {
        const querySnapshot = await getDocs(q);
        const disputesData = [];
        
        querySnapshot.forEach((doc) => {
          disputesData.push({ id: doc.id, ...doc.data() });
        });
        
        setDisputes(disputesData);
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
      await addDoc(collection(db, 'disputes'), {
        ...newDispute,
        status: 'pending',
        reportedBy: currentUser.uid,
        reporterEmail: currentUser.email,
        createdAt: new Date()
      });
      
      setNewDispute({ titleDeedNumber: '', description: '', evidence: '' });
      alert('Dispute reported successfully!');
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
                  <td>{dispute.titleDeedNumber}</td>
                  {adminView && <td>{dispute.reporterEmail}</td>}
                  <td className="description-cell">{dispute.description}</td>
                  <td className={`status-${dispute.status}`}>
                    {dispute.status}
                  </td>
                  <td>{dispute.createdAt?.toDate().toLocaleDateString()}</td>
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