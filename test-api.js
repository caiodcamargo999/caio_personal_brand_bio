#!/usr/bin/env node

/**
 * Test script to diagnose Google API connectivity issues
 * Run this to check if your Google API setup is working correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Google API Setup...\n');

// Check 1: Environment variables
console.log('1️⃣ Checking environment variables...');
try {
  require('dotenv').config({ path: '.env.local' });
  console.log('✅ .env.local file loaded');
} catch (error) {
  console.log('❌ .env.local file not found or invalid');
}

const requiredEnvVars = [
  'GOOGLE_APPLICATION_CREDENTIALS',
  'GOOGLE_SPREADSHEET_ID',
  'GOOGLE_CALENDAR_ID'
];

let envVarsOk = true;
requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: ${process.env[varName]}`);
  } else {
    console.log(`❌ ${varName}: Not set`);
    envVarsOk = false;
  }
});

// Check 2: Credentials file
console.log('\n2️⃣ Checking Google credentials file...');
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './google-credentials.json';
if (fs.existsSync(credentialsPath)) {
  try {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    if (credentials.type === 'service_account' && credentials.project_id) {
      console.log(`✅ Credentials file found and valid`);
      console.log(`   Project ID: ${credentials.project_id}`);
      console.log(`   Client Email: ${credentials.client_email}`);
    } else {
      console.log('❌ Credentials file exists but format is invalid');
    }
  } catch (error) {
    console.log('❌ Credentials file exists but cannot be parsed as JSON');
  }
} else {
  console.log(`❌ Credentials file not found at: ${credentialsPath}`);
}

// Check 3: Test API endpoints
console.log('\n3️⃣ Testing API endpoints...');
const testApiEndpoint = async (url, method = 'GET') => {
  try {
    const response = await fetch(url, { method });
    if (response.ok) {
      console.log(`✅ ${method} ${url} - Status: ${response.status}`);
    } else {
      console.log(`❌ ${method} ${url} - Status: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ ${method} ${url} - Error: ${error.message}`);
  }
};

// Test if Next.js server is running
const baseUrl = 'http://localhost:3000';
testApiEndpoint(`${baseUrl}/api/leads`, 'POST');
testApiEndpoint(`${baseUrl}/api/calendar`);

console.log('\n4️⃣ Summary:');
if (envVarsOk && fs.existsSync(credentialsPath)) {
  console.log('✅ Basic setup looks good!');
  console.log('   If you\'re still getting "Failed to save to API" errors:');
  console.log('   1. Check that your Next.js server is running (npm run dev)');
  console.log('   2. Verify the service account has access to your spreadsheet');
  console.log('   3. Check the browser console for detailed error messages');
  console.log('   4. Ensure Google APIs are enabled in your Google Cloud project');
} else {
  console.log('❌ Setup issues found. Please fix the problems above first.');
}

console.log('\n📚 For detailed setup instructions, see LEAD_CAPTURE_SETUP.md');
console.log('🔗 Google Cloud Console: https://console.cloud.google.com');
