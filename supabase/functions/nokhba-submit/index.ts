// Al Nokhba public form endpoint (Supabase Edge Function).
// Telegram credentials belong in Supabase function secrets, never in GitHub.
const allowedOrigins = new Set([
  "https://rehabilitation-ju.vercel.app",
  "https://al-nokhba-kappa.vercel.app",
  "https://rehabilitation.ju",
  "https://al-nokhba-9qo.pages.dev",
  "https://rehabilitation-ju.pages.dev",
]);

const labels: Record<string, string> = {
  name: "الاسم",
  contact: "طريقة التواصل",
  countryCode: "رمز الدولة",
  specialty: "التخصص",
  year: "السنة الدراسية",
  course: "المادة",
  professor: "الدكتور",
  examDate: "تاريخ الامتحان",
  difficulty: "تفاصيل طلب المساعدة",
  needs: "نوع المساعدة",
  notes: "ملاحظات",
  field: "مجال التطوع",
  role: "الدور المطلوب",
  phone: "رقم واتساب",
  reason: "سبب الانضمام",
};
const required: Record<string, string[]> = {
  help: ["name", "phone", "countryCode", "specialty", "year", "course"],
  join: ["name", "specialty", "year", "field", "role", "phone", "countryCode"],
};

// Keep this version aligned with src/lib/legalPolicies.ts at publication time.
const legalPolicyVersion = '2026-10-29';

function clean(value: unknown, maxLength = 180): string {
  return typeof value === "string"
    ? value.trim().replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, maxLength)
    : "";
}
function respond(payload: unknown, status: number, origin: string) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "access-control-allow-origin": allowedOrigins.has(origin) ? origin : "null",
      "vary": "Origin",
    },
  });
}

// For hosts without a secrets API integration, credentials are kept in
// Supabase Vault and exposed only to the privileged Edge Function role.
// The repository and client bundle never contain the actual token.
async function loadCredentials(): Promise<{ botToken: string; chatId: string } | null> {
  const directToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const directChat = Deno.env.get("TELEGRAM_CHAT_ID");
  if (directToken && directChat) return { botToken: directToken, chatId: directChat };

  const url = Deno.env.get("SUPABASE_URL");
  const legacyKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  let defaultKey = "";
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    defaultKey = keys.default || "";
  } catch { /* Missing modern secret-key map; legacy key is used below. */ }
  const key = legacyKey || defaultKey;
  if (!url || !key) return null;

  try {
    const response = await fetch(url + "/rest/v1/rpc/nokhba_telegram_credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: "Bearer " + key,
      },
      body: "{}",
      signal: AbortSignal.timeout(5500),
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (typeof data.bot_token !== "string" || typeof data.chat_id !== "string") return null;
    return { botToken: data.bot_token, chatId: data.chat_id };
  } catch {
    return null;
  }
}

type AdminContext = { url: string; key: string };

function getAdminContext(): AdminContext | null {
  const url = Deno.env.get("SUPABASE_URL");
  let key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!key) {
    try { key = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}").default || ""; }
    catch { /* Legacy service-role key may be used instead. */ }
  }
  return url && key ? { url, key } : null;
}
function adminHeaders(admin: AdminContext, prefer?: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    apikey: admin.key,
    Authorization: "Bearer " + admin.key,
    ...(prefer ? { Prefer: prefer } : {}),
  };
}
async function checkRateLimit(admin: AdminContext, request: Request): Promise<boolean | null> {
  const ip = request.headers.get("cf-connecting-ip")
    || request.headers.get("x-real-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]
    || "unavailable";
  // Hashed identifier — never persist raw IPs alongside student requests.
  const fingerprint = ip.trim() + "|" + admin.key.slice(-24);
  const bytes = new TextEncoder().encode(fingerprint);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const keyHash = Array.from(new Uint8Array(digest)).map(n => n.toString(16).padStart(2, "0")).join("");
  const response = await fetch(admin.url + "/rest/v1/rpc/nokhba_check_request_limit", {
    method: "POST",
    headers: adminHeaders(admin),
    body: JSON.stringify({ p_key_hash: keyHash }),
    signal: AbortSignal.timeout(6000),
  });
  return response.ok ? (await response.json()) === true : null;
}
async function persistRequest(admin: AdminContext, form: string, fields: Record<string, unknown>): Promise<string | null> {
  const response = await fetch(admin.url + "/rest/v1/nokhba_requests", {
    method: "POST",
    headers: adminHeaders(admin, "return=representation"),
    body: JSON.stringify({ form_type: form, fields, status: "pending" }),
    signal: AbortSignal.timeout(6000),
  });
  if (!response.ok) return null;
  const inserted = await response.json();
  return inserted?.[0]?.id || null;
}
async function markDelivered(admin: AdminContext, id: string, messageId: number | undefined): Promise<void> {
  await fetch(admin.url + "/rest/v1/nokhba_requests?id=eq." + encodeURIComponent(id), {
    method: "PATCH",
    headers: adminHeaders(admin),
    body: JSON.stringify({
      status: "delivered",
      delivered_at: new Date().toISOString(),
      attempts: 1,
      telegram_message_id: messageId ?? null,
    }),
    signal: AbortSignal.timeout(5000),
  });
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin") ?? "";
  if (!allowedOrigins.has(origin)) return respond({ ok: false }, 403, origin);

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": origin,
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "Content-Type",
        "access-control-max-age": "3600",
        "vary": "Origin",
      },
    });
  }
  if (request.method !== "POST") return respond({ ok: false }, 405, origin);
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return respond({ ok: false, error: "invalid_content_type" }, 415, origin);
  }

  let submitted: unknown;
  try {
    const body = await request.text();
    if (body.length > 14000) return respond({ ok: false, error: "too_large" }, 413, origin);
    submitted = JSON.parse(body);
  } catch {
    return respond({ ok: false, error: "invalid_json" }, 400, origin);
  }

  if (!submitted || typeof submitted !== "object" || Array.isArray(submitted)) {
    return respond({ ok: false, error: "invalid_body" }, 400, origin);
  }
  const data = submitted as Record<string, unknown>;
  const form = clean(data.form, 15);
  if (!Object.hasOwn(required, form)) return respond({ ok: false, error: "invalid_form" }, 400, origin);

  // Both public frontends require explicit policy acceptance. Reject requests
  // without a matching record even when they bypass the visual checkbox.
  const consent = data.consent;
  const consentRecord = consent && typeof consent === 'object' && !Array.isArray(consent)
    ? consent as Record<string, unknown> : null;
  const consentAccepted = consentRecord?.accepted === true
    && consentRecord?.version === legalPolicyVersion
    && consentRecord?.form === form;
  if (consent !== undefined && !consentAccepted) {
    return respond({ ok: false, error: "invalid_consent" }, 400, origin);
  }
  if (!consentAccepted) {
    return respond({ ok: false, error: "consent_required" }, 400, origin);
  }

  // A filled honeypot is not accepted; never send a success confirmation.
  if (clean(data.website, 120)) return respond({ ok: false, error: "rejected" }, 400, origin);

  const startedAt = Number(data.startedAt);
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < 2500 || elapsed > 86400000) {
    return respond({ ok: false, error: "invalid_time" }, 400, origin);
  }

  if (!data.fields || typeof data.fields !== "object" || Array.isArray(data.fields)) {
    return respond({ ok: false, error: "invalid_fields" }, 400, origin);
  }
  const fields = data.fields as Record<string, unknown>;
  for (const key of required[form]) {
    if (!clean(fields[key], 180)) return respond({ ok: false, error: "required_field_missing" }, 400, origin);
  }
  // Keep this whitelist in sync with src/lib/countryDialCodes.ts.
  const supportedCodes = new Set(["+962", "+376", "+93", "+1268", "+1264", "+355", "+374", "+244", "+672", "+54", "+1684", "+43", "+61", "+297", "+358", "+994", "+387", "+1246", "+880", "+32", "+226", "+359", "+973", "+257", "+229", "+590", "+1441", "+673", "+591", "+599", "+55", "+1242", "+975", "+47", "+267", "+375", "+501", "+242", "+41", "+225", "+682", "+56", "+237", "+86", "+57", "+506", "+53", "+238", "+357", "+420", "+49", "+253", "+45", "+1767", "+213", "+593", "+372", "+20", "+212", "+291", "+34", "+251", "+679", "+500", "+691", "+298", "+33", "+241", "+44", "+1473", "+995", "+594", "+233", "+350", "+299", "+220", "+224", "+240", "+30", "+502", "+1671", "+245", "+592", "+852", "+504", "+385", "+509", "+36", "+62", "+353", "+91", "+246", "+964", "+98", "+354", "+39", "+1876", "+81", "+254", "+996", "+855", "+686", "+269", "+1869", "+850", "+82", "+965", "+1345", "+7", "+856", "+961", "+1758", "+423", "+94", "+231", "+266", "+370", "+352", "+371", "+218", "+377", "+373", "+382", "+261", "+692", "+389", "+223", "+95", "+976", "+853", "+1670", "+596", "+222", "+1664", "+356", "+230", "+960", "+265", "+52", "+60", "+258", "+264", "+687", "+227", "+234", "+505", "+31", "+977", "+674", "+683", "+64", "+968", "+507", "+51", "+689", "+675", "+63", "+92", "+48", "+1", "+970", "+351", "+680", "+595", "+974", "+262", "+40", "+381", "+250", "+677", "+248", "+249", "+46", "+65", "+386", "+421", "+232", "+378", "+221", "+252", "+597", "+211", "+239", "+503", "+1721", "+963", "+268", "+1649", "+235", "+228", "+66", "+992", "+690", "+670", "+993", "+216", "+676", "+90", "+1868", "+688", "+886", "+255", "+380", "+256", "+598", "+998", "+1784", "+58", "+1284", "+1340", "+84", "+678", "+681", "+685", "+383", "+967", "+27", "+260", "+263"]);
  const dialCode = clean(fields.countryCode, 5);
  const localPhone = clean(fields.phone, 25).replace(/[^0-9]/g, "");
  if (!supportedCodes.has(dialCode) || !/^[0-9]{6,15}$/.test(localPhone)) {
    return respond({ ok: false, error: "invalid_whatsapp" }, 400, origin);
  }
  const withoutTrunkPrefix = localPhone.replace(/^0+/, "");
  if (withoutTrunkPrefix.length < 6) {
    return respond({ ok: false, error: "invalid_whatsapp" }, 400, origin);
  }
  fields.phone = dialCode + " " + withoutTrunkPrefix;

  // Optional protection: enable by setting TURNSTILE_SECRET_KEY and supplying
  // the token as 'turnstileToken' from a Cloudflare Turnstile widget.
  const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (turnstileSecret) {
    const token = clean(data.turnstileToken, 2048);
    if (!token) return respond({ ok: false, error: "captcha_required" }, 400, origin);
    try {
      const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: token,
          remoteip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "",
        }),
        signal: AbortSignal.timeout(8000),
      });
      const verdict = await verification.json();
      if (!verdict.success) return respond({ ok: false, error: "captcha_rejected" }, 400, origin);
    } catch {
      return respond({ ok: false, error: "captcha_unavailable" }, 502, origin);
    }
  }

  const admin = getAdminContext();
  if (!admin) return respond({ ok: false, error: "storage_unavailable" }, 503, origin);
  let allowed: boolean | null = null;
  try { allowed = await checkRateLimit(admin, request); }
  catch { allowed = null; }
  if (allowed === false) return respond({ ok: false, error: "rate_limited" }, 429, origin);
  if (allowed === null) return respond({ ok: false, error: "storage_unavailable" }, 503, origin);

  const normalizedFields: Record<string, string | string[]> = {};
  for (const key of Object.keys(labels)) {
    const raw = fields[key];
    if (Array.isArray(raw)) {
      const values = raw.slice(0, 8).map(v => clean(v, 140)).filter(Boolean);
      if (values.length) normalizedFields[key] = values;
    } else {
      const value = clean(raw, ["difficulty", "notes", "reason"].includes(key) ? 1500 : 180);
      if (value) normalizedFields[key] = value;
    }
  }
  if (consentAccepted) {
    // Server timestamp and policy version become part of the private request
    // record; do not trust a date supplied by the browser.
    normalizedFields.legalConsentVersion = legalPolicyVersion;
    normalizedFields.legalConsentAcceptedAt = new Date().toISOString();
  }
  let requestId: string | null = null;
  try { requestId = await persistRequest(admin, form, normalizedFields); }
  catch { requestId = null; }
  if (!requestId) return respond({ ok: false, error: "storage_unavailable" }, 503, origin);

  const credentials = await loadCredentials();
  if (!credentials) return respond({ ok: true, queued: true }, 202, origin);
  const { botToken, chatId } = credentials;

  const lines = [
    form === "join" ? "طلب انضمام جديد — النخبة" : "طلب مساعدة دراسية جديد — النخبة",
    "────────────────────",
  ];
  for (const [key, label] of Object.entries(labels)) {
    const raw = fields[key];
    const value = Array.isArray(raw)
      ? raw.slice(0, 8).map(v => clean(v, 140)).filter(Boolean).join("، ")
      : clean(raw, ["difficulty", "notes", "reason"].includes(key) ? 1500 : 180);
    if (value) lines.push(label + ": " + value);
  }
  if (consentAccepted) lines.push('موافقة السياسات: ' + legalPolicyVersion);
  lines.push("────────────────────", "المصدر: موقع النخبة");

  try {
    const result = await fetch("https://api.telegram.org/bot" + botToken + "/sendMessage", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n").slice(0, 3900),
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(9000),
    });
    const telegram = await result.json();
    if (!result.ok || !telegram.ok) {
      // The request is already saved; the Telegram notification is pending.
      return respond({ ok: true, queued: true }, 202, origin);
    }
    try { await markDelivered(admin, requestId, telegram.result?.message_id); }
    catch { /* Delivery confirmed; the database update can be reconciled later. */ }
    return respond({ ok: true, delivered: true }, 200, origin);
  } catch {
    return respond({ ok: true, queued: true }, 202, origin);
  }
});
