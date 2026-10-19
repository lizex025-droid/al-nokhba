const paths = ['/', '/materials', '/physical-therapy-materials', '/occupational-therapy-materials', '/prosthetics-orthotics-materials', '/hearing-speech-materials', '/computerized-tests', '/gpa-calculator', '/professors-emails', '/study-plans', '/about', '/request-help', '/join-us', '/contact'];
let failed = false;
for (const path of paths) {
  const response = await fetch(`http://127.0.0.1:3000${path}`);
  const html = await response.text();
  const h1Count = (html.match(/<h1\b/g) || []).length;
  const meta = /<meta name="description" content="[^"]+"/.test(html);
  const rtl = /<html[^>]+lang="ar"[^>]+dir="rtl"/.test(html);
  const ok = response.ok && h1Count === 1 && meta && rtl;
  if (!ok) failed = true;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${path}: ${response.status}, h1=${h1Count}, meta=${meta}, rtl=${rtl}`);
}
if (failed) process.exitCode = 1;
