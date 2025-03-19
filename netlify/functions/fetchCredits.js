export async function handler(event) {
  const { email } = event.queryStringParameters || {};

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Email is required.' }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    };
  }

  const googleScriptUrl = `https://script.google.com/macros/s/AKfycbwxbsyCBzGulAiJ5BcZ_UWpWz5Oew2y85WWQrQithOiJUYXMNseGlDkJg_I7GsgZxcjSg/exec?email=${encodeURIComponent(email)}`;

  try {
    const response = await fetch(googleScriptUrl);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching data from Google Apps Script.', details: error.message }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    };
  }
}
