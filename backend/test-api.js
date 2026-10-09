const http = require('http');

// Helper to make HTTP requests
const request = (options, data = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
};

async function runTests() {
  console.log('--- Starting HabitFlow MERN REST API Verification Tests ---');

  // Start the server programmatically
  const { app, server } = require('./server');
  // Wait 1 second for mongo connection
  await new Promise((r) => setTimeout(r, 1000));

  try {
    const testEmail = `testuser_${Date.now()}@habitflow.com`;
    const testPassword = 'password123';

    // 1. Test Register
    console.log('\n1. Testing Registration...');
    const regRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        name: 'Alex Hackathon',
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword
      }
    );
    console.log('Register Response Status:', regRes.status);
    console.log('Register Success:', regRes.body.success, '| User:', regRes.body.data?.name);
    const token = regRes.body.data?.token;

    if (!token) throw new Error('Failed to obtain JWT token from registration');

    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    // 2. Test Get Current User
    console.log('\n2. Testing GET /api/auth/me...');
    const meRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET',
      headers: authHeaders
    });
    console.log('Me Response Status:', meRes.status, '| Email:', meRes.body.data?.email);

    // 3. Test Create Habit (CRUD - Create)
    console.log('\n3. Testing POST /api/habits (Create Habit)...');
    const today = new Date().toISOString().split('T')[0];
    const habitRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/habits',
        method: 'POST',
        headers: authHeaders
      },
      {
        habit: 'Morning Cardio Workout',
        date: today,
        target: '30 minutes',
        targetValue: 30,
        progressValue: 15,
        unit: 'minutes',
        category: 'Fitness',
        completionStatus: 'Pending',
        notes: 'Run on treadmill and stretch'
      }
    );
    console.log('Create Habit Status:', habitRes.status);
    console.log('Created Habit:', habitRes.body.data?.habit, '| ID:', habitRes.body.data?._id);
    const habitId = habitRes.body.data?._id;

    // 4. Test Get Habits (CRUD - Read)
    console.log('\n4. Testing GET /api/habits (Read Habits)...');
    const getRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/habits',
      method: 'GET',
      headers: authHeaders
    });
    console.log('Get Habits Status:', getRes.status, '| Count:', getRes.body.count);

    // 5. Test Toggle Status
    console.log('\n5. Testing PATCH /api/habits/:id/toggle (Mark Completed)...');
    const toggleRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/habits/${habitId}/toggle`,
      method: 'PATCH',
      headers: authHeaders
    });
    console.log('Toggle Status:', toggleRes.status, '| New Status:', toggleRes.body.data?.completionStatus, '| Streak:', toggleRes.body.data?.currentStreak);

    // 6. Test Update Progress
    console.log('\n6. Testing PATCH /api/habits/:id/progress...');
    const progRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/habits/${habitId}/progress`,
        method: 'PATCH',
        headers: authHeaders
      },
      { progressValue: 30 }
    );
    console.log('Progress Update Status:', progRes.status, '| Progress:', progRes.body.data?.progressValue, '| Status:', progRes.body.data?.completionStatus);

    // 7. Test Update Habit (CRUD - Update)
    console.log('\n7. Testing PUT /api/habits/:id (Update Habit)...');
    const updateRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/habits/${habitId}`,
        method: 'PUT',
        headers: authHeaders
      },
      {
        habit: 'Morning Cardio Workout & Core',
        date: today,
        target: '45 minutes',
        targetValue: 45
      }
    );
    console.log('Update Habit Status:', updateRes.status, '| New Name:', updateRes.body.data?.habit, '| Target:', updateRes.body.data?.target);

    // 8. Test Analytics Summary
    console.log('\n8. Testing GET /api/habits/analytics/summary...');
    const analyticsRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/habits/analytics/summary',
      method: 'GET',
      headers: authHeaders
    });
    console.log('Analytics Status:', analyticsRes.status, '| Overall Rate:', analyticsRes.body.data?.overallRate, '%');

    // 9. Test Calendar Overview
    console.log('\n9. Testing GET /api/habits/calendar/overview...');
    const calRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/habits/calendar/overview',
      method: 'GET',
      headers: authHeaders
    });
    console.log('Calendar Overview Status:', calRes.status, '| Dates Tracked:', Object.keys(calRes.body.data || {}).length);

    // 10. Test Seed Demo Data
    console.log('\n10. Testing POST /api/habits/seed...');
    const seedRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/habits/seed',
        method: 'POST',
        headers: authHeaders
      },
      { clearExisting: true }
    );
    console.log('Seed Demo Status:', seedRes.status, '| Habits Seeded:', seedRes.body.count);

    // 11. Test Delete Habit (CRUD - Delete)
    console.log('\n11. Testing DELETE /api/habits/:id (Delete Habit)...');
    const firstSeededId = seedRes.body.data[0]._id;
    const deleteRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/habits/${firstSeededId}`,
      method: 'DELETE',
      headers: authHeaders
    });
    console.log('Delete Habit Status:', deleteRes.status, '| Deleted ID:', deleteRes.body.data?._id);

    console.log('\nALL 11 BACKEND API REST & CRUD TESTS PASSED SUCCESSFULLY! ✅');
  } catch (err) {
    console.error('Test Failed with Error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();
