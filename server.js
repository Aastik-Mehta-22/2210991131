// Express server for the Sliding Window Service
const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

const WINDOW_SIZE = 10;

let windowState = {
  windowPrevState: [],
  windowCurrState: [],
  numbers: [],
  avg: 0
};

const AUTH = {
  email: 'aastik1131.be22@chitkara.edu.in',
  name: 'aastik',
  rollNo: '2210991131',
  accessCode: 'PwzufG',
  clientID: '018c968b-ce5b-483a-9ef8-c787deaf849d',
  clientSecret: 'kDEVSpVPvabNQppF'
};



// funtion to calculate average of numbers in the window
function calculateAverage(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / arr.length).toFixed(2));
}

// Get token from auth server
async function getAuthToken() {
    try {
      const response = await axios.post('http://20.244.56.144/evaluation-service/auth', AUTH);
      console.log("✅ Auth Response:", response.data);
      return response.data.access_token;
    } catch (error) {
      console.error('❌ Authentication failed:', error.response?.data || error.message);
      throw new Error('Unable to get auth token');
    }
  }
  

// Map for type to endpoint
const typeToPath = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand"
};

// Endpoint to fetch numbers based on type
app.get('/numbers/:type', async (req, res) => {
  const type = req.params.type;
  const apiPath = typeToPath[type];

  if (!apiPath) {
    return res.status(400).json({
      error: 'Invalid type. Use p (prime), f (fibonacci), e (even), or r (random)'
    });
  }

  try {
    const token = await getAuthToken();
    console.log('🔐 Token received:', token);

    const response = await axios.get(`http://20.244.56.144/evaluation-service/${apiPath}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const newNumbers = response.data.numbers || [];


    windowState.windowPrevState = [...windowState.windowCurrState];

    const updatedNumbers = [...windowState.numbers, ...newNumbers];

    // Keep only unique and latest WINDOW_SIZE numbers
    windowState.numbers = Array.from(new Set(updatedNumbers)).slice(-WINDOW_SIZE);
    windowState.windowCurrState = [...windowState.numbers];
    windowState.avg = calculateAverage(windowState.numbers);

    res.json(windowState);

} catch (error) {
    console.error(' Error fetching numbers:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      res.status(500).json({
        error: 'Server error',
        status: error.response.status,
        message: error.response.data
      });
    } else {
      console.error(error.message);
      res.status(500).json({ error: 'Server error', message: error.message });
    }
  }
  
});

// Default  message
app.get('/', (req, res) => {
  res.send('Sliding Window Number Service. Use /numbers/[p|f|e|r] to get numbers.');
});


app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
}); // start the server
