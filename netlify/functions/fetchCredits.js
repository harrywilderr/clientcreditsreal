import querystring from 'querystring';

export async function handler(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // ✅ GET: your existing fetchCredits logic
  if (event.httpMethod === 'GET') {
    const { email } = event.queryStringParameters || {};

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required.' }),
        headers
      };
    }

    const googleScriptUrl = `https://script.google.com/macros/s/AKfycbwOzIRST5PxbMEXidHyo-QK7mBswP4RRL6KXbZ8I-qaKmFzh4ic7h1gavznOIClH1Pu0g/exec?email=${encodeURIComponent(email)}`;

    try {
      const response = await fetch(googleScriptUrl);
      const data = await response.json();

      return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error fetching data from Google Apps Script.', details: error.message }),
        headers
      };
    }
  }

  // ✅ POST: Handle Google Sign-In redirect
  if (event.httpMethod === 'POST') {
    const parsedBody = querystring.parse(event.body);
    const idToken = parsedBody.credential;

    if (!idToken) {
      return {
        statusCode: 400,
        body: 'Missing credential token',
        headers
      };
    }

    try {
      const base64Url = idToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = JSON.parse(Buffer.from(base64, 'base64').toString());
      const email = jsonPayload.email;

      if (!email) {
        return {
          statusCode: 400,
          body: 'Email not found in token',
          headers
        };
      }

      const googleScriptUrl = `https://script.google.com/macros/s/AKfycbwOzIRST5PxbMEXidHyo-QK7mBswP4RRL6KXbZ8I-qaKmFzh4ic7h1gavznOIClH1Pu0g/exec?email=${encodeURIComponent(email)}`;
      const response = await fetch(googleScriptUrl);
      const data = await response.json();

      const redirectTo = data.exists
        ? 'https://portal.cutline.co'
        : 'https://www.cutline.co/onboarding';

      return {
        statusCode: 302,
        headers: {
          Location: redirectTo,
          ...headers
        },
        body: ''
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error decoding token', details: err.message }),
        headers
      };
    }
  }

  return {
    statusCode: 405,
    body: 'Method Not Allowed',
    headers
  };
}
