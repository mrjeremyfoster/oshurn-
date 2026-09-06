const jsonHeaders = {
  'content-type': 'application/json; charset=UTF-8',
  'cache-control': 'no-store'
};

const text = (value, max) => String(value ?? '').trim().slice(0, max);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactPreferences = new Set(['email', 'phone', 'text']);

export async function onRequestPost(context) {
  try {
    const contentType = context.request.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return new Response(JSON.stringify({ error: 'JSON request body required' }), { status: 415, headers: jsonHeaders });
    }

    const body = await context.request.json();

    // Honeypot support: forms may send an invisible website field. Real users should leave it empty.
    if (text(body.website, 120)) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: jsonHeaders });
    }

    const firstName = text(body.firstName, 80);
    const lastName = text(body.lastName, 80);
    const email = text(body.email, 254).toLowerCase();
    const phone = text(body.phone, 30);
    const state = text(body.state, 2).toUpperCase();
    const interest = text(body.interest, 120);
    const contactPreference = text(body.contactPreference, 20).toLowerCase();
    const timing = text(body.timing, 80);
    const referralSource = text(body.referralSource, 120);

    if (!firstName || !lastName || !email || !phone || !state || !interest || !contactPreference || body.consent !== 'on') {
      return new Response(JSON.stringify({ error: 'Required lead information or consent is missing' }), { status: 400, headers: jsonHeaders });
    }
    if (!emailPattern.test(email) || email.length > 254) {
      return new Response(JSON.stringify({ error: 'A valid email is required' }), { status: 400, headers: jsonHeaders });
    }
    if (phone.length < 7) {
      return new Response(JSON.stringify({ error: 'A valid phone number is required' }), { status: 400, headers: jsonHeaders });
    }
    if (!/^[A-Z]{2}$/.test(state)) {
      return new Response(JSON.stringify({ error: 'A two-letter state code is required' }), { status: 400, headers: jsonHeaders });
    }
    if (!contactPreferences.has(contactPreference)) {
      return new Response(JSON.stringify({ error: 'Invalid contact preference' }), { status: 400, headers: jsonHeaders });
    }

    const leadId = `OSH-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const lead = {
      leadId,
      receivedAt: new Date().toISOString(),
      firstName,
      lastName,
      email,
      phone,
      state,
      interest,
      contactPreference,
      timing,
      referralSource,
      status: 'new',
      assignedAdvisorId: null
    };

    // Phase 1: validate and normalize. Do not log raw PII; persistence belongs in the CRM/D1 phase.
    return new Response(JSON.stringify({ ok: true, leadId, status: lead.status }), { status: 201, headers: jsonHeaders });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: jsonHeaders });
  }
}
