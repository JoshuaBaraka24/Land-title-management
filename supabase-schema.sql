-- Drop existing triggers and functions (if they exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('citizen', 'admin', 'legal')) NOT NULL DEFAULT 'citizen',
  phone TEXT,
  profile JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create land_records table
CREATE TABLE land_records (
  id TEXT PRIMARY KEY,
  title_deed_number TEXT UNIQUE NOT NULL,
  owner TEXT NOT NULL,
  location TEXT,
  area TEXT,
  verified BOOLEAN DEFAULT FALSE,
  coordinates JSONB,
  land_use TEXT,
  registration_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create disputes table
CREATE TABLE disputes (
  id TEXT PRIMARY KEY,
  dispute_id TEXT UNIQUE NOT NULL,
  title_deed_number TEXT REFERENCES land_records(title_deed_number),
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'in_review', 'resolved', 'rejected')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  evidence JSONB DEFAULT '[]',
  reported_by TEXT,
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for land_records
ALTER TABLE land_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view land records" ON land_records
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert land records" ON land_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update land records" ON land_records
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for disputes
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view disputes" ON disputes
  FOR SELECT USING (true);

CREATE POLICY "Citizens can insert disputes" ON disputes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('citizen', 'admin', 'legal')
    )
  );

CREATE POLICY "Legal officers and admins can update disputes" ON disputes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('legal', 'admin')
    )
  );

-- Create function to handle new user signup (with secure search_path)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'citizen'),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_land_records_title_deed ON land_records(title_deed_number);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_reported_by ON disputes(reported_by); 