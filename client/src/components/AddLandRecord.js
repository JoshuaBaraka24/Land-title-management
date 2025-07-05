import React, { useState } from 'react';
import { loadBlockchainData } from '../blockchain';

const AddLandRecord = () => {
  const [titleDeedNumber, setTitleDeedNumber] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const { accounts, contract } = await loadBlockchainData();
      await contract.addRecord(titleDeedNumber, owner, { from: accounts[0] });
      setStatus('Record added successfully!');
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Add Land Record</h2>
      <form onSubmit={handleSubmit}>
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
  );
};

export default AddLandRecord;
