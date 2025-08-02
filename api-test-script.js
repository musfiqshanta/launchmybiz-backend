const axios = require('axios');

// API endpoint for CorpNet business formation packages
const API_URL = 'https://staging22api.corpnet.com/api/business-formation/package';

// Query parameters
const params = {
  entityType: 'llc',
  state: 'GA',
  filing: 'express'
};

 
async function fetchBusinessFormationPackages() {
  try {
    console.log('🚀 Making API call to CorpNet...');
    console.log('📡 URL:', API_URL);
    console.log('🔍 Parameters:', params);
    console.log('⏳ Waiting for response...\n');

    const response = await axios.get(API_URL, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization':'Bearer B3FD30BB85103E34BB5369D4A5E8DD3D85A196C1303B8044F7196AFE6FAA41F75BF06996652A657AA7C1EF4481D1B9F360A6'
      },
      timeout: 10000 // 10 second timeout
    });

    console.log('✅ API Call Successful!');
    console.log('📊 Status Code:', response.status);
    console.log('📋 Response Headers:', JSON.stringify(response.headers, null, 2));
    console.log('\n📦 Response Data:');
    console.log(JSON.stringify(response.data, null, 2));

    // Additional analysis of the response
    if (response.data) {
      console.log('\n📈 Response Analysis:');
      console.log('📄 Data Type:', typeof response.data);
      console.log('📏 Data Length:', Array.isArray(response.data) ? response.data.length : 'Not an array');
      
      if (Array.isArray(response.data)) {
        console.log('📋 Number of packages found:', response.data.length);
        response.data.forEach((package, index) => {
          console.log(`\n📦 Package ${index + 1}:`);
          console.log('   ID:', package.id || 'N/A');
          console.log('   Name:', package.name || 'N/A');
          console.log('   Price:', package.price || 'N/A');
        });
      }
    }

  } catch (error) {
    console.error('❌ API Call Failed!');
    console.error('🔍 Error Details:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('📊 Status Code:', error.response.status);
      console.error('📋 Response Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('📦 Error Response Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('📡 No response received from server');
      console.error('🔍 Request details:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('⚙️ Error setting up request:', error.message);
    }
    
    console.error('🔍 Full Error Object:', error);
  }
}

// Function to test with different parameters
async function testMultipleScenarios() {
  console.log('🧪 Testing Multiple API Scenarios\n');
  
  const testCases = [
    { entityType: 'llc', state: 'GA', filing: 'express' },
    { entityType: 'llc', state: 'CA', filing: 'standard' },
    { entityType: 'corporation', state: 'NY', filing: 'express' }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🧪 Test Case ${i + 1}: ${JSON.stringify(testCase)}`);
    console.log(`${'='.repeat(50)}`);
    
    try {
      const response = await axios.get(API_URL, {
        params: testCase,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      });
      
      console.log('✅ Success!');
      console.log('📊 Status:', response.status);
      console.log('📦 Packages found:', Array.isArray(response.data) ? response.data.length : 'N/A');
      
    } catch (error) {
      console.log('❌ Failed!');
      console.log('📊 Status:', error.response?.status || 'No response');
      console.log('💬 Error:', error.response?.data?.message || error.message);
    }
  }
}

// Main execution
async function main() {
  console.log('🎯 CorpNet API Test Script');
  console.log('📅 Date:', new Date().toISOString());
  console.log('🔗 Endpoint:', API_URL);
  console.log('');

  // Run the main test
  await fetchBusinessFormationPackages();
  
  // Uncomment the line below to test multiple scenarios
  // await testMultipleScenarios();
}

// Run the script
main().catch(console.error); 