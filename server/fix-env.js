const fs = require('fs');

const envContent = `SUPABASE_URL=https://yegopjktstqsvxqthvjk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZ29wamt0c3Rxc3Z4cXRodmprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTY2MzQ1OSwiZXhwIjoyMDY3MjM5NDU5fQ.soFooZuYbpltdjqAxnZgzQoY7mwTT7DZ9nYrnY-Av_A
`;
 
fs.writeFileSync('.env', envContent);
console.log('✅ .env file created successfully!');
console.log('Now run: node test-connection.js'); 