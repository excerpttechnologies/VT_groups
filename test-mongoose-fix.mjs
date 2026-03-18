// Test script to verify /api/customers/me endpoint works after Mongoose fix
import fetch from 'node-fetch';

async function testCustomerMeEndpoint() {
  try {
    console.log('1. Testing seed endpoint...');
    let res = await fetch('http://localhost:3000/api/seed');
    console.log('   Seed status:', res.status);

    console.log('\n2. Testing login...');
    res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@vtgroups.com',
        password: 'Cust@123'
      })
    });
    
    const loginData = await res.json();
    console.log('   Login status:', res.status);
    console.log('   Login success:', loginData.success);

    console.log('\n3. Testing /api/customers/me...');
    // Note: This test won't have the httpOnly cookie, so it will fail with 401
    // But if Mongoose schema error is gone, it should fail with 401/403, not 500
    res = await fetch('http://localhost:3000/api/customers/me');
    console.log('   Status:', res.status);
    
    if (res.status === 500) {
      const data = await res.json();
      if (data.message && data.message.includes('Schema')) {
        console.log('   ❌ FAILED - Mongoose schema error still present');
        process.exit(1);
      }
    } else if (res.status === 401 || res.status === 403) {
      console.log('   ✅ SUCCESS - Endpoint responds with auth error (not Mongoose error)');
    }

  } catch (error) {
    console.error('Test error:', error.message);
    process.exit(1);
  }
}

testCustomerMeEndpoint();
