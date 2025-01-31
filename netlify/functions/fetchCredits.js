export async function handler(event) {
  const { email } = event.queryStringParameters || {};

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Email is required.' }),
    };
  }

  const googleScriptUrl = `https://script.google.com/macros/s/AKfycbyt8YmAJjeMH8g1qmfKl6ncE7_N9izIIqnezhSBZgExlB2PfEGY5pRbvpaHwr_cVCWG_A/exec?email=${encodeURIComponent(email)}`;

  try {
    const response = await fetch(googleScriptUrl);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching data from Google Apps Script.', details: error.message }),
    };
  }
}
