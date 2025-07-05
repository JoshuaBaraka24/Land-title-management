import { useState } from 'react';
import { loadBlockchainData } from '../blockchain';
import { supabase } from '../supabase';

export default function Verification() {
  const [titleDeed, setTitleDeed] = useState('');
  const [result, setResult] = useState(null);

  const verify = async () => {
    try {
      // 1. Check Supabase database
      const { data, error } = await supabase
        .from('land_records')
        .select('*')
        .eq('title_deed_number', titleDeed)
        .single();
      
      if (error || !data) {
        setResult("Record not found");
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
    }
  };

  return (
    <div>
      <input 
        value={titleDeed}
        onChange={(e) => setTitleDeed(e.target.value)}
        placeholder="Enter Title Deed Number"
      />
      <button onClick={verify}>Verify</button>
      {result && <p>{result}</p>}
    </div>
  );
}