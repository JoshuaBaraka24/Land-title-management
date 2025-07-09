const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const Web3 = require('web3');
const contractArtifact = require('../../client/src/contracts/LandRecord.json');

// Supabase setup
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Blockchain setup
const web3 = new Web3('http://localhost:7545'); // Ganache or local node
const contractAddress = contractArtifact.networks && Object.values(contractArtifact.networks)[0]?.address;
const contract = new web3.eth.Contract(contractArtifact.abi, contractAddress);

// Read deeds
const deeds = JSON.parse(fs.readFileSync(path.join(__dirname, 'deeds.json')));

async function insertAll() {
  // Get admin account for blockchain
  const accounts = await web3.eth.getAccounts();
  const admin = accounts[0];

  for (const deed of deeds) {
    // 1. Insert into Supabase
    const dbRecord = {
      id: deed.titleDeedNumber,
      title_deed_number: deed.titleDeedNumber,
      owner: deed.ownerName,
      location: deed.location,
      area: deed.area,
      registration_date: deed.registrationDate,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    try {
      const { error } = await supabase.from('land_records').insert(dbRecord);
      if (error) {
        if (error.code === '23505') {
          console.log(`⚠️ Record ${deed.titleDeedNumber} already exists in DB.`);
        } else {
          console.error(`❌ DB insert error for ${deed.titleDeedNumber}:`, error.message);
        }
      } else {
        console.log(`✅ Inserted ${deed.titleDeedNumber} into DB.`);
      }
    } catch (err) {
      console.error(`❌ DB error for ${deed.titleDeedNumber}:`, err.message);
    }

    // 2. Add to blockchain
    try {
      await contract.methods.addRecord(deed.titleDeedNumber, deed.ownerName).send({ from: admin });
      console.log(`✅ Added ${deed.titleDeedNumber} to blockchain.`);
      
      // If the deed is marked as verified, call verifyRecord
      if (deed.verified) {
        try {
          await contract.methods.verifyRecord(deed.titleDeedNumber).send({ from: admin });
          console.log(`✅ Verified ${deed.titleDeedNumber} on blockchain.`);
        } catch (verifyErr) {
          console.error(`❌ Verification error for ${deed.titleDeedNumber}:`, verifyErr.message);
        }
      }
    } catch (err) {
      if (err.message && err.message.includes('Record already exists')) {
        console.log(`⚠️ Record ${deed.titleDeedNumber} already exists on blockchain.`);
      } else {
        console.error(`❌ Blockchain error for ${deed.titleDeedNumber}:`, err.message);
      }
    }
  }
  console.log('🎉 All deeds processed!');
}

insertAll(); 