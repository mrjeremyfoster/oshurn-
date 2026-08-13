export async function onRequestPost(context) {
  const headers = { 'content-type': 'application/json; charset=UTF-8' };
  try {
    const body = await context.request.json();
    const required = ['firstName','lastName','email','phone','state','interest','contactPreference','consent'];
    for (const field of required) {
      if (!body[field]) return new Response(JSON.stringify({ error: `Missing ${field}` }), { status: 400, headers });
    }
    if (body.consent !== 'on') return new Response(JSON.stringify({ error: 'Consent is required' }), { status: 400, headers });
    const leadId = `OSH-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
    const lead = {
      leadId,
      receivedAt: new Date().toISOString(),
      firstName: String(body.firstName).trim(),
      lastName: String(body.lastName).trim(),
      email: String(body.email).trim().toLowerCase(),
      phone: String(body.phone).trim(),
      state: String(body.state).trim(),
      interest: String(body.interest).trim(),
      contactPreference: String(body.contactPreference).trim(),
      timing: String(body.timing || '').trim(),
      referralSource: String(body.referralSource || '').trim(),
      status: 'new',
      assignedAdvisorId: null
    };
    // Phase 1: validate and normalize the lead. Phase 2 will persist it to the Oshurn CRM/D1 database.
    console.log('OSHURN_LEAD_INTAKE', JSON.stringify(lead));
    return new Response(JSON.stringify({ ok: true, leadId, status: 'new' }), { status: 201, headers });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers });
  }
}
