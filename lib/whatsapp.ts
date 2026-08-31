import fetch from 'node-fetch';

export async function sendWhatsAppText(phoneE164: string, message: string): Promise<{ success: boolean; id?: string; status?: number }>{
  const instanceId = process.env.ZAPI_INSTANCE_ID;
  const token = process.env.ZAPI_TOKEN;

  if (!instanceId || !token) {
    console.error('Z-API env vars missing');
    return { success: false };
  }

  try {
    const url = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneE164, message }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('Z-API send error', res.status, text);
      return { success: false, status: res.status };
    }
    const data = await res.json().catch(() => ({}));
    return { success: true, id: data?.messageId, status: res.status };
  } catch (err) {
    console.error('Z-API send exception', err);
    return { success: false };
  }
}

export function formatDateTimeForUser(dateISO: string, timeZone: string): string {
  const d = new Date(dateISO);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', timeZone,
  }).format(d);
}

