const url = 'https://wfmyvylmjepxovtbesvt.supabase.co/rest/v1/notices';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmbXl2eWxtamVweG92dGJlc3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NDE1NTEsImV4cCI6MjEwMzMxNzU1MX0.GM6v8GenoHSUEcAEUKKaMBE1DtySH5F4rb34wUovQSY';
const params = '?select=id,title,status,publish_at,expires_at,created_at,slug&order=created_at.desc&limit=10';

fetch(url + params, {
  headers: {
    apikey: key,
    Authorization: 'Bearer ' + key,
    'Content-Type': 'application/json',
  },
})
  .then(async (res) => {
    const text = await res.text();
    console.log('HTTP', res.status);
    console.log(text);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
