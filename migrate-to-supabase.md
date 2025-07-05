# Firebase to Supabase Migration Guide

## **Prerequisites**

1. **Supabase Account:** Sign up at [supabase.com](https://supabase.com)
2. **Node.js:** Version 16 or higher
3. **Git:** For version control

## **Step 1: Set Up Supabase Project**

1. **Create New Project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: `land-title-system`
   - Set database password (save it!)
   - Choose region closest to your users
   - Click "Create new project"

2. **Get Project Credentials:**
   - Go to Settings > API
   - Copy your Project URL and anon/public key
   - Save these for later use

## **Step 2: Set Up Database Schema**

1. **In Supabase Dashboard:**
   - Go to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Click "Run" to execute the schema

2. **Verify Tables Created:**
   - Go to Table Editor
   - You should see: `profiles`, `land_records`, `disputes`

## **Step 3: Install Dependencies**

```bash
# In client directory
cd client
npm install @supabase/supabase-js
npm uninstall firebase react-firebase-hooks

# In server directory
cd ../server
npm install @supabase/supabase-js express cors dotenv
npm uninstall firebase-admin
```

## **Step 4: Configure Environment Variables**

1. **Create `.env` file in client directory:**
   ```bash
   cd client
   cp env.example .env
   ```

2. **Edit `.env` with your Supabase credentials:**
   ```
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Create `.env` file in server directory:**
   ```bash
   cd ../server
   ```

4. **Add server environment variables:**
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## **Step 5: Test the Migration**

1. **Start the development server:**
   ```bash
   cd client
   npm start
   ```

2. **Test user creation:**
   ```bash
   cd ../server
   npm run create-users
   ```

3. **Test login functionality:**
   - Go to your app
   - Try logging in with the created users

## **Step 6: Data Migration (Optional)**

If you have existing Firebase data:

1. **Export Firebase Data:**
   - Use Firebase Console to export your data
   - Or use Firebase CLI: `firebase firestore:export`

2. **Transform Data:**
   - Convert Firestore documents to SQL format
   - Update field names to match Supabase schema

3. **Import to Supabase:**
   - Use Supabase Dashboard > SQL Editor
   - Or use Supabase CLI for bulk imports

## **Step 7: Update Components**

The following files have been updated:
- ✅ `client/src/supabase.js` - Supabase configuration
- ✅ `client/src/auth.js` - Authentication functions
- ✅ `client/src/authContext.js` - Auth context
- ✅ `client/src/components/admin/AdminPanel.js` - Admin panel
- ✅ `server/supabase-admin.js` - Server-side admin functions

## **Step 8: Test All Features**

1. **Authentication:**
   - ✅ User registration
   - ✅ User login/logout
   - ✅ Password reset
   - ✅ Role-based access

2. **Database Operations:**
   - ✅ Create land records
   - ✅ View land records
   - ✅ Create disputes
   - ✅ Update user profiles

3. **Role-Based Access:**
   - ✅ Admin panel access
   - ✅ Legal officer access
   - ✅ Citizen access

## **Step 9: Deploy**

1. **Update environment variables in production**
2. **Deploy your React app**
3. **Deploy your server (if applicable)**

## **Troubleshooting**

### **Common Issues:**

1. **"Invalid API key" error:**
   - Check your Supabase URL and anon key
   - Ensure environment variables are loaded

2. **"Table doesn't exist" error:**
   - Run the schema SQL in Supabase SQL Editor
   - Check table names match your queries

3. **"RLS policy violation" error:**
   - Check Row Level Security policies
   - Ensure user is authenticated
   - Verify user has correct role

4. **"Auth state not updating" error:**
   - Check auth state listener implementation
   - Ensure proper error handling

### **Debugging Tips:**

1. **Check Supabase Dashboard:**
   - Go to Authentication > Users
   - Go to Table Editor to see data
   - Check Logs for errors

2. **Use Browser DevTools:**
   - Check Network tab for API calls
   - Check Console for errors

3. **Test with Supabase CLI:**
   ```bash
   npm install -g supabase
   supabase login
   supabase db reset
   ```

## **Benefits of Supabase Migration:**

1. **Better SQL Support:** Full PostgreSQL capabilities
2. **Real-time Subscriptions:** Built-in real-time features
3. **Row Level Security:** More granular security policies
4. **Better Performance:** PostgreSQL optimization
5. **Open Source:** Self-hostable if needed
6. **Better Developer Experience:** SQL interface, better docs

## **Next Steps:**

1. **Add Real-time Features:** Use Supabase subscriptions
2. **Optimize Queries:** Use PostgreSQL features
3. **Add Edge Functions:** Serverless functions
4. **Set Up Monitoring:** Database performance monitoring
5. **Backup Strategy:** Regular database backups

## **Support:**

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues) 