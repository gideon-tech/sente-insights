const BASE_URL = process.env.PESAPAL_API_URL!;

let cachedToken: { token: string; expiry: Date } | null = null;

export async function getToken(): Promise<string> {
  if (cachedToken && new Date() < cachedToken.expiry) return cachedToken.token;

  const res = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    }),
  });

  if (!res.ok) throw new Error(`Pesapal auth failed: ${res.status}`);
  const data = await res.json();
  cachedToken = { token: data.token, expiry: new Date(data.expiryDate) };
  return data.token;
}

export async function registerIPN(ipnUrl: string) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/api/URLSetup/RegisterIPN`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ url: ipnUrl, ipn_notification_type: 'POST' }),
  });

  if (!res.ok) throw new Error(`Pesapal IPN registration failed: ${res.status}`);
  return res.json();
}

export async function submitOrder(order: {
  id: string;
  amount: number;
  currency: string;
  description: string;
  callbackUrl: string;
  notificationId: string;
  billing: {
    email: string;
    phone: string;
    countryCode: string;
    firstName: string;
    lastName: string;
  };
}) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      description: order.description,
      callback_url: order.callbackUrl,
      redirect_mode: '',
      notification_id: order.notificationId,
      billing_address: {
        email_address: order.billing.email,
        phone_number: order.billing.phone,
        country_code: order.billing.countryCode,
        first_name: order.billing.firstName,
        last_name: order.billing.lastName,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('PesaPal order error:', JSON.stringify(data));
    throw new Error(`Pesapal order submission failed: ${res.status} — ${data.error?.message || JSON.stringify(data)}`);
  }
  return data;
}

export async function getTransactionStatus(orderTrackingId: string) {
  const token = await getToken();
  const res = await fetch(
    `${BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
  );

  if (!res.ok) throw new Error(`Pesapal status check failed: ${res.status}`);
  return res.json();
}
