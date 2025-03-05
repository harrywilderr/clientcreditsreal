export async function handler(event) {
  const { email } = event.queryStringParameters || {};

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Email is required.' }),
    };
  }

  const googleScriptUrl = `https://script.google.com/macros/s/AKfycbyIcH292dx7Rvt5VtMmagp0l4Li1phbVxDqy0Nfd8qelqab7Yd-wHiqC2dUHTG-wzLg3w/exec?email=${encodeURIComponent(email)}`;

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
