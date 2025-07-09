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
        console.log('Contract loaded:', contract);
        if (!contract || !contract.records) {
          throw new Error('Blockchain contract not loaded or records method missing');
        }
        console.log('Calling contract.records...');
        const record = await withTimeout(contract.records(titleDeed), 10000); // 10s timeout
        console.log('Blockchain record:', record);
        setResult(record.verified
          ? "✅ Officially Verified (Blockchain & Database match)"
          : "⚠️ Not Verified on Blockchain (Check with authorities)");
      } catch (blockchainError) {
        console.error('Blockchain verification error:', blockchainError);
        // Custom error messages based on error type
        let tip = "";
        if (blockchainError.message.includes('not loaded')) {
          tip = " (Our system could not connect to the blockchain. Please try again later or contact support.)";
        } else if (blockchainError.message.includes('network') || blockchainError.message.includes('connection')) {
          tip = " (Network error: Please check your internet connection or try again later.)";
        } else if (blockchainError.message.includes('records is not a function')) {
          tip = " (System error: Please contact support with this error message.)";
        }
        setResult(data.verified
          ? `✅ Record Found in Database, but Blockchain verification is unavailable${tip}`
          : `⚠️ Record Found in Database, but Blockchain verification is unavailable${tip}`);
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
            <div style={{ marginTop: '0.5em', fontSize: '0.95em', color: '#555' }}>
              {result.includes('unavailable') && (
                <>
                  <p>
                    <b>Tip:</b> If you believe this is an error, please try again later or <a href="mailto:support@example.com">contact support</a>.<br/>
                    Blockchain verification may be temporarily unavailable due to network or system issues.
                  </p>
                </>
              )}
              {result.includes('Not Verified') && !result.includes('unavailable') && (
                <>
                  <p>
                    <b>Tip:</b> If your title deed is not verified, please visit your local land office for further assistance.
                  </p>
                </>
              )}
              {result.includes('Officially Verified') && (
                <>
                  <p>
                    <b>Tip:</b> This title deed is officially verified in both our database and the blockchain. You may print or save this result for your records.
                  </p>
                </>
              )}
            </div>
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
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Blockchain call timed out')), ms)
  );
  return Promise.race([promise, timeout]);
}
