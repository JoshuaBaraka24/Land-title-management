require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key (for admin operations)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please check your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// User data for creation
const usersToAdd = [
  {
    email: 'citizen1@example.com',
    password: 'SecurePass123!',
    phoneNumber: '+254712345678',
    role: 'citizen',
    profile: {
      fullName: 'Jane Doe',
      idNumber: 'A1234567'
    }
  },
  {
    email: 'admin@lands.go.ke',
    password: 'AdminLandPass!',
    phoneNumber: '+254722334455',
    role: 'admin',
    profile: {
      fullName: 'Land Administrator',
      department: 'Nairobi Central'
    }
  },
  {
    email: 'legal@nlc.go.ke',
    password: 'LegalOfficerPass!',
    phoneNumber: '+254733445566',
    role: 'legal',
    profile: {
      fullName: 'Legal Officer',
      barNumber: 'BAR-98765'
    }
  }
];

async function createUsers() {
  try {
    console.log('Starting user creation...');
    
    for (const userData of usersToAdd) {
      // Create authentication user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        phone: userData.phoneNumber,
        email_confirm: true,
        user_metadata: {
          role: userData.role,
          profile: userData.profile
        }
      });
      
      if (authError) {
        console.error(`❌ Auth user creation failed for ${userData.email}:`, authError);
        continue;
      }
      
      console.log(`✅ Auth user created: ${authData.user.email} (${authData.user.id})`);
      
      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: userData.role,
          phone: userData.phoneNumber,
          profile: userData.profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id);
      
      if (profileError) {
        console.error(`❌ Profile update failed for ${userData.email}:`, profileError);
      } else {
        console.log(`📝 Profile updated for ${userData.email}`);
      }
    }
    
    console.log('🎉 All users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating users:', error);
    process.exit(1);
  }
}

// Function to get email by idNumber
async function getEmailByIdNumber(idNumber) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('profile->idNumber', idNumber)
      .single();
    
    if (error) throw error;
    return data.email;
  } catch (error) {
    throw new Error('ID number not found');
  }
}

// Export functions for use in other files
module.exports = {
  createUsers,
  getEmailByIdNumber,
  supabase
};

// Run if this file is executed directly
if (require.main === module) {
  createUsers();
} 