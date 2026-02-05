// Test Login Endpoint
// Run: node scripts/test-login-api.js

const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api';

async function testLogin() {
    console.log('🧪 Testing Login API Endpoint\n');
    console.log('=' .repeat(50));
    
    const credentials = {
        email: 'nhao47111@gmail.com',
        password: '123456'
    };
    
    console.log('📧 Email:', credentials.email);
    console.log('🔒 Password:', credentials.password);
    console.log('\n🚀 Sending POST request to /api/auth/login...\n');
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        console.log('📬 Response Status:', response.status, response.statusText);
        console.log('📋 Response Headers:');
        response.headers.forEach((value, key) => {
            console.log(`   ${key}: ${value}`);
        });
        
        const data = await response.json();
        
        console.log('\n📦 Response Body:');
        console.log(JSON.stringify(data, null, 2));
        
        if (data.success) {
            console.log('\n✅ LOGIN SUCCESSFUL!');
            console.log('🎫 Token:', data.token.substring(0, 50) + '...');
            console.log('👤 User:', data.user.email);
            console.log('📛 Display Name:', data.user.displayName);
        } else {
            console.log('\n❌ LOGIN FAILED!');
            console.log('💬 Message:', data.message);
        }
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
    }
    
    console.log('\n' + '='.repeat(50));
}

testLogin();
