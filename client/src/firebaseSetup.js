import { db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

const initializeFirestore = async () => {
  // Create sample land record
  await setDoc(doc(collection(db, 'land_records'), 'LR001'), {
    titleDeedNumber: 'LR001',
    owner: 'Ministry of Lands',
    location: 'Nairobi',
    verified: false,
    coordinates: { lat: -1.2921, lng: 36.8219 },
    createdAt: new Date()
  });

  // Create sample dispute
  await setDoc(doc(collection(db, 'disputes'), 'D001'), {
    titleDeedNumber: 'LR001',
    description: 'Boundary dispute with neighboring property',
    status: 'pending',
    evidence: [],
    reportedBy: '',
    createdAt: new Date()
  });

  console.log('Firestore structure initialized');
};

// Call this once during setup
initializeFirestore();