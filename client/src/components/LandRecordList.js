// src/components/LandRecordList.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import BlockchainLandRecord from './BlockchainLandRecord';

export default function LandRecordList({ ownerName, ownerEmail }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      setLoading(true);
      let query = supabase.from('land_records').select('*');
      if (ownerName) query = query.eq('owner', ownerName);
      if (ownerEmail) query = query.eq('owner', ownerEmail); // If you want to filter by email, ensure 'owner' field stores email
      const { data, error } = await query;
      if (!error) setRecords(data || []);
      setLoading(false);
    }
    fetchRecords();
  }, [ownerName, ownerEmail]);

  if (loading) return <div>Loading land records...</div>;
  if (!records.length) return <div>No land records found.</div>;

  return (
    <div>
      <h3>Land Records</h3>
      <ul>
        {records.map(record => (
          <li key={record.id}>
            <strong>{record.title_deed_number}</strong> - {record.owner} ({record.location}, {record.area})
            <BlockchainLandRecord titleDeedNumber={record.title_deed_number} />
          </li>
        ))}
      </ul>
    </div>
  );
}
