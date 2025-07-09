// src/components/BlockchainLandRecord.js
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import LandRecordArtifact from '../contracts/LandRecord.json';

export default function BlockchainLandRecord({ titleDeedNumber }) {
  const [record, setRecord] = useState(null);

  useEffect(() => {
    async function fetchRecord() {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const contractAddress = LandRecordArtifact.networks && Object.values(LandRecordArtifact.networks)[0]?.address;
      const contract = new web3.eth.Contract(LandRecordArtifact.abi, contractAddress);
      const rec = await contract.methods.records(titleDeedNumber).call();
      setRecord(rec);
    }
    fetchRecord();
  }, [titleDeedNumber]);

  if (!record) return <div>Loading blockchain record...</div>;
  return (
    <div style={{ fontSize: '0.9em', marginLeft: '1em' }}>
      <span>Blockchain: Owner: {record.owner}, Verified: {record.verified ? 'Yes' : 'No'}</span>
    </div>
  );
}
