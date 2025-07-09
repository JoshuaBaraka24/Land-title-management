require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client with service role key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Middleware
app.use(cors());
app.use(express.json());

// Admin user creation endpoint
app.post('/api/admin/create-user', async (req, res) => {
  try {
    const { email, password, role, phone } = req.body;
    
    console.log('🔧 Creating user via admin API:', { email, role });
    
    // Create user using admin API (bypasses email domain restrictions)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      phone,
      email_confirm: true,
      user_metadata: {
        role,
        phone
      }
    });
    
    if (authError) {
      console.error('❌ Auth user creation failed:', authError);
      return res.status(400).json({ 
        success: false, 
        error: authError.message 
      });
    }
    
    console.log('✅ Auth user created:', authData.user.email);
    
    // Update profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role,
        phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', authData.user.id);
    
    if (profileError) {
      console.error('❌ Profile update failed:', profileError);
      // Don't fail the request, just log the error
      console.log('⚠️ Profile update failed, but user was created');
    } else {
      console.log('📝 Profile updated successfully');
    }
    
    res.json({ 
      success: true, 
      user: authData.user,
      message: 'User created successfully'
    });
    
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Admin API: http://localhost:${PORT}/api/admin/create-user`);
}); 