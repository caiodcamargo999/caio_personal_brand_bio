
require('dotenv').config({ path: '.env.local' });
const https = require('https');

const API_KEY = process.env.TRELLO_API_KEY;
const API_TOKEN = process.env.TRELLO_API_TOKEN;
const LIST_ID = process.env.TRELLO_LIST_ID;

console.log('Testing Trello Credentials...');
console.log('API Key present:', !!API_KEY);
console.log('API Token present:', !!API_TOKEN);
console.log('List ID:', LIST_ID);

if (!API_KEY || !API_TOKEN || !LIST_ID) {
    console.error('Missing credentials');
    process.exit(1);
}

const params = new URLSearchParams({
    key: API_KEY,
    token: API_TOKEN,
    idList: LIST_ID,
    name: 'TEST CARD FROM SCRIPT',
    desc: 'This is a test card to verify API credentials.',
});

const options = {
    hostname: 'api.trello.com',
    path: '/1/cards?' + params.toString(),
    method: 'POST',
};

const req = https.request(options, (res) => {
    console.log('Response Status:', res.statusCode);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response Body:', data);
    });
});

req.on('error', (e) => {
    console.error('Request Error:', e);
});

req.end();
