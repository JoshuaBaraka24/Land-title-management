const fs = require('fs');
const path = require('path');

const owners = [
  { id: '30eb6e87-984a-438e-9efb-9b8e4cc5a614', name: 'Citizen1', email: 'citizen1@example.com' },
  { id: null, name: 'Unassigned', email: '' },
];

const locations = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
  'Thika', 'Machakos', 'Naivasha', 'Kitale', 'Garissa'
];

function randomArea() {
  return (Math.random() * 5 + 0.5).toFixed(2) + ' Ha';
}

function randomDate() {
  const start = new Date(2010, 0, 1);
  const end = new Date(2024, 0, 1);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split('T')[0];
}

const deeds = [];

// Create array of indices to randomly select verified deeds
const allIndices = Array.from({length: 10}, (_, i) => i);
const verifiedIndices = [];

// Ensure 2 out of 3 citizen-owned deeds are verified (indices 0, 1, 2)
const citizenIndices = [0, 1, 2];
const verifiedCitizenIndices = citizenIndices.sort(() => Math.random() - 0.5).slice(0, 2);
verifiedIndices.push(...verifiedCitizenIndices);

// Add 5 more random verified deeds from the remaining 7
const remainingIndices = allIndices.filter(i => !verifiedCitizenIndices.includes(i));
const additionalVerifiedIndices = remainingIndices.sort(() => Math.random() - 0.5).slice(0, 5);
verifiedIndices.push(...additionalVerifiedIndices);

console.log('Verified indices:', verifiedIndices);
console.log('Verified citizen indices:', verifiedCitizenIndices);

for (let i = 1; i <= 10; i++) {
  // Assign 3 records to the citizen, rest unassigned
  const owner = i <= 3 ? owners[0] : owners[1];
  const titleDeedNumber = `KNY-TD-${1000 + i}`;
  const location = locations[(i - 1) % locations.length];
  const area = randomArea();
  const registrationDate = randomDate();
  const isVerified = verifiedIndices.includes(i - 1); // i-1 because array is 0-indexed
  
  const record = {
    titleDeedNumber,
    ownerName: owner.name,
    ownerId: owner.id,
    location,
    area,
    registrationDate,
    id: titleDeedNumber,
    email: owner.email,
    verified: isVerified
  };
  deeds.push(record);
  
  // Write text file
  const verificationStatus = isVerified ? 'VERIFIED' : 'PENDING VERIFICATION';
  const text = `Kenya Land Title Deed\n====================\nTitle Deed Number: ${titleDeedNumber}\nOwner: ${owner.name}\nLocation: ${location}\nArea: ${area}\nRegistration Date: ${registrationDate}\nStatus: ${verificationStatus}`;
  fs.writeFileSync(path.join(__dirname, `${titleDeedNumber}.txt`), text);
}

fs.writeFileSync(path.join(__dirname, 'deeds.json'), JSON.stringify(deeds, null, 2));
console.log('✅ 10 sample title deed files and deeds.json created.');
console.log(`📊 Verification Summary:`);
console.log(`   - Total deeds: 10`);
console.log(`   - Verified: ${verifiedIndices.length}`);
console.log(`   - Citizen-owned verified: ${verifiedCitizenIndices.length}/3`);
console.log(`   - Unassigned verified: ${verifiedIndices.length - verifiedCitizenIndices.length}/7`); 