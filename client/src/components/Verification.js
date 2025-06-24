import { useState } from 'react';
import { loadBlockchainData } from '../blockchain';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Verification() {
  const [titleDeed, setTitleDeed] = useState('');
  const [result, setResult] = useState(null);

  const verify = async () => {
    // 1. Check Firestore
    const docRef = doc(db, "land_records", titleDeed);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      setResult("Record not found");
      return;
    }
    
    // 2. Check blockchain verification
    const { contract } = await loadBlockchainData();
    const record = await contract.records(titleDeed);
    
    setResult(record.verified ? 
      "✅ Officially Verified" : 
      "⚠️ Not Verified");
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