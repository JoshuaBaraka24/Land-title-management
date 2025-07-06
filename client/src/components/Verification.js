import { useState } from 'react';
import { loadBlockchainData } from '../blockchain';
import { supabase } from '../supabase';
import './GlobalStyles.css';

export default function Verification() {
  const [titleDeed, setTitleDeed] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const verify = async () => {
    if (!titleDeed.trim()) {
      setResult("Please enter a title deed number");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // 1. Check Supabase database
      const { data, error } = await supabase
        .from('land_records')
        .select('*')
        .eq('title_deed_number', titleDeed)
        .single();
      
      if (error || !data) {
        setResult("Record not found");
        setIsLoading(false);
        return;
      }
      
      // 2. Check blockchain verification (if blockchain is still being used)
      try {
        const { contract } = await loadBlockchainData();
        const record = await contract.records(titleDeed);
        
        setResult(record.verified ? 
          "✅ Officially Verified" : 
          "⚠️ Not Verified");
      } catch (blockchainError) {
        // If blockchain is not available, just show database result
        setResult(data.verified ? 
          "✅ Record Found (Database)" : 
          "⚠️ Record Found but Not Verified");
      }
    } catch (error) {
      console.error('Verification error:', error);
      setResult("Error during verification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verify();
  };

  const getResultClass = () => {
    if (!result) return '';
    if (result.includes('✅')) return 'success';
    if (result.includes('⚠️')) return 'warning';
    if (result.includes('Error') || result.includes('not found')) return 'error';
    return 'info';
  };

  return (
    <div className="page-container">
      <div className="content-card">
        <div className="page-header">
          <h2 className="page-title">Land Verification</h2>
          <p className="page-subtitle">Verify land title authenticity and ownership</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title Deed Number</label>
            <input 
              type="text"
              value={titleDeed}
              onChange={(e) => setTitleDeed(e.target.value)}
              placeholder="Enter the title deed number to verify"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className={`btn btn-primary btn-large ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Title Deed'}
          </button>
        </form>
        
        {result && (
          <div className={`message ${getResultClass()}`}>
            <strong>Verification Result:</strong> {result}
          </div>
        )}
        
        <div className="verification-info">
          <h3>How Verification Works</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-icon">🔍</span>
              <h4>Database Check</h4>
              <p>Verifies the title deed exists in our official records</p>
            </div>
            <div className="info-item">
              <span className="info-icon">🔗</span>
              <h4>Blockchain Verification</h4>
              <p>Cross-references with blockchain for additional security</p>
            </div>
            <div className="info-item">
              <span className="info-icon">✅</span>
              <h4>Status Confirmation</h4>
              <p>Confirms the current status and ownership details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}