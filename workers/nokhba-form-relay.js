/**
 * Al Nokhba Telegram form relay.
 * Secrets: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID (Cloudflare Worker Secrets).
 * Never add bot tokens, chat credentials or private student data to GitHub.
 */
const ORIGINS = new Set([
  'https://rehabilitation-ju.vercel.app',
  'https://rehabilitation.ju',
  'https://al-nokhba-kappa.vercel.app',
  'https://al-nokhba-9qo.pages.dev',
  'https://rehabilitation-ju.pages.dev',
]);

const FIELD_NAMES = {
  name: 'الاسم',
  contact: 'التواصل',
  specialty: 'التخصص',
  year: 'السنة الدراسية',
  course: 'المادة',
  professor: 'الدكتور',
  examDate: 'تاريخ الامتحان',
  difficulty: 'الجزء الصعب',
  needs: 'المطلوب',
  notes: 'ملاحظات إضافية',
  field: 'مجال المساعدة',
  role: 'نوع المساهمة',
  phone: 'رقم التواصل',
  reason: 'سبب الانضمام',
};
const REQUIRED = {
  help: ['name', 'contact', 'specialty', 'year', 'course', 'difficulty'],
  join: ['name', 'specialty', 'year', 'field', 'role', 'phone', 'reason'],
};

function reply(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
function text(value, max = 180) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, max);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);
    if (url.pathname === '/health' && request.method === 'GET')
      return reply({status:'ok',configured:Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID)}, 200, ORIGINS.has(origin) ? origin : 'null');
    if (!ORIGINS.has(origin)) return reply({ok:false},403,'null');
    if (request.method === 'OPTIONS') {
      return new Response(null, {status:204, headers:{
        'Access-Control-Allow-Origin':origin,
        'Access-Control-Allow-Methods':'POST, OPTIONS',
        'Access-Control-Allow-Headers':'Content-Type',
        'Access-Control-Max-Age':'3600',
        'Vary':'Origin',
      }});
    }
    if (request.method !== 'POST' || url.pathname !== '/submit')
      return reply({ok:false},405,origin);
    const size = Number(request.headers.get('Content-Length') || 0);
    if (size > 18000 || !request.headers.get('Content-Type')?.includes('application/json'))
      return reply({ok:false,error:'invalid_payload'},413,origin);
    let data;
    try {data = await request.json()}catch{return reply({ok:false,error:'invalid_json'},400,origin)}
    const form = data?.form;
    if (!Object.prototype.hasOwnProperty.call(REQUIRED,form))
      return reply({ok:false,error:'invalid_form'},400,origin);
    if (text(data.website || '',100)) return reply({ok:true},200,origin); // honeypot
    const startedAt = Number(data.startedAt);
    if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2500 ||
        Date.now() - startedAt > 86400000)
      return reply({ok:false,error:'invalid_time'},400,origin);
    const fields = data.fields;
    if (!fields || typeof fields !== 'object' || Array.isArray(fields))
      return reply({ok:false,error:'invalid_fields'},400,origin);
    for (const key of REQUIRED[form]) {
      if (!text(fields[key],240)) return reply({ok:false,error:'missing_field'},400,origin);
    }
    const lines = [
      form === 'join' ? 'طلب انضمام جديد — النخبة' : 'طلب مساعدة دراسية جديد — النخبة',
      '─────────────────',
    ];
    for (const [key,label] of Object.entries(FIELD_NAMES)) {
      const raw = fields[key];
      const value = Array.isArray(raw)
        ? raw.slice(0,8).map(x=>text(x,140)).filter(Boolean).join('، ')
        : text(raw, key === 'difficulty' || key === 'notes' || key === 'reason' ? 1500 : 180);
      if (value) lines.push(label + ': ' + value);
    }
    lines.push('─────────────────');
    lines.push('المصدر: موقع النخبة');
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID)
      return reply({ok:false,error:'not_configured'},503,origin);
    try {
      const response = await fetch('https://api.telegram.org/bot' + env.TELEGRAM_BOT_TOKEN + '/sendMessage', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: lines.join('\n').slice(0,3900),
          disable_web_page_preview:true,
        }),
        signal:AbortSignal.timeout(8500),
      });
      const result = await response.json();
      if (!response.ok || !result.ok)
        return reply({ok:false,error:'delivery_failed'},502,origin);
      return reply({ok:true},200,origin);
    } catch {
      return reply({ok:false,error:'delivery_failed'},502,origin);
    }
  }
};
