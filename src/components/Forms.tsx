'use client';

import { useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowIcon } from './Icons';
import { worldCountryDialCodes } from '@/lib/countryDialCodes';

const specialties = ['العلاج الطبيعي', 'العلاج الوظيفي', 'الأطراف الاصطناعية والأجهزة المساعدة', 'السمع والنطق', 'متطلبات الكلية', 'متطلبات الجامعة', 'غير ذلك'];
const years = ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة', 'السنة الرابعة', 'لا أعرف'];
type FieldProps = { label: string; name: string; required?: boolean; placeholder?: string; type?: string; hint?: string };
export function FormInput({ label, name, required = false, placeholder, type = 'text', hint }: FieldProps) { return <label className="form-field"><span>{label}{required && <em> *</em>}</span><input name={name} type={type} required={required} placeholder={placeholder} />{hint && <small>{hint}</small>}</label>; }
export function FormTextarea({ label, name, required = false, placeholder, hint }: FieldProps) { return <label className="form-field form-field-full"><span>{label}{required && <em> *</em>}</span><textarea name={name} required={required} rows={5} placeholder={placeholder} />{hint && <small>{hint}</small>}</label>; }
export function SelectField({ label, name, options, required = false }: { label: string; name: string; options: string[]; required?: boolean }) { return <label className="form-field"><span>{label}{required && <em> *</em>}</span><select name={name} required={required} defaultValue=""><option value="" disabled>اختر من القائمة</option>{options.map(x => <option key={x}>{x}</option>)}</select></label>; }


/** Localized names and flags with Jordan always at the top of the list. */
const arabicRegionNames = new Intl.DisplayNames(['ar'], { type: 'region' });
const arabicNameSorter = new Intl.Collator('ar', { sensitivity: 'base' });
const countryFlag = (iso: string) =>
  String.fromCodePoint(...Array.from(iso.toUpperCase()).map(letter => letter.charCodeAt(0) + 127397));
const countryCodes = worldCountryDialCodes.map(([iso, code]) => ({
  iso,
  code,
  name: arabicRegionNames.of(iso) || iso,
  flag: countryFlag(iso),
})).sort((a, b) =>
  a.iso === 'JO' ? -1 : b.iso === 'JO' ? 1 : arabicNameSorter.compare(a.name, b.name)
);

function WhatsAppField() {
  return <div className="form-field form-whatsapp-field">
    <label htmlFor="nokhba-whatsapp" className="form-whatsapp-label">رقم واتساب <em>*</em></label>
    <div className="form-whatsapp-inputs" dir="ltr">
      <select className="form-country-code" name="countryCode" aria-label="رمز الدولة" defaultValue="+962" required>
        {countryCodes.map(country => <option key={country.iso} value={country.code}>{country.flag} {country.name} ({country.code})</option>)}
      </select>
      <input id="nokhba-whatsapp" type="tel" name="phone" inputMode="tel" autoComplete="tel-national" placeholder="07XXXXXXXX" maxLength={20} dir="ltr" required />
    </div>
    <small>الأردن محدد تلقائيًا. اختر أي دولة وأدخل رقم الواتساب المحلي.</small>
  </div>;
}


// Public endpoint only. Keep Telegram credentials in Supabase Function Secrets.
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_NOKHBA_FORM_ENDPOINT || 'https://ueednyqvafymexoejdvp.supabase.co/functions/v1/nokhba-submit';

function FormShell({ children, title, button, kind }: { children: ReactNode; title: string; button: string; kind: 'help' | 'join' | 'contact' }) {
  const [sent, setSent] = useState(false);
  const [queued, setQueued] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const startedAt = useRef(Date.now());
  const confirmationRef = useRef<HTMLDivElement>(null);

  // The original form can be much taller than the success card. On iOS Safari
  // this height change otherwise clamps the old scroll position near the footer.
  // After React mounts the success card, bring it directly below the navbar.
  useLayoutEffect(() => {
    if (!sent) return;
    const confirmation = confirmationRef.current;
    if (!confirmation) return;

    confirmation.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });

    const showConfirmation = () => {
      const card = confirmationRef.current;
      if (!card) return;
      const headerBottom = Math.max(0,
        document.querySelector<HTMLElement>('.site-header')?.getBoundingClientRect().bottom ?? 0
      );
      const desiredTop = headerBottom + 18;
      const actualTop = card.getBoundingClientRect().top;
      if (Math.abs(actualTop - desiredTop) > 10) {
        window.scrollTo({
          top: Math.max(0, window.scrollY + actualTop - desiredTop),
          left: 0,
          behavior: 'instant',
        });
      }
    };

    showConfirmation();
    const frame = window.requestAnimationFrame(showConfirmation);
    // Safari can resize the visual viewport again after hiding the keyboard.
    const settle = window.setTimeout(showConfirmation, 220);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [sent]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    if (!FORM_ENDPOINT) {
      setError('خدمة استقبال الطلبات قيد التفعيل حاليًا. لا يمكن إرسال الطلب بعد.');
      return;
    }
    const data = new FormData(event.currentTarget);
    const fields: Record<string, string | string[]> = {};
    for (const key of new Set(Array.from(data.keys()))) {
      if (key === 'website') continue;
      const all = data.getAll(key).map(value => String(value));
      fields[key] = all.length > 1 ? all : all[0] ?? '';
    }
    setSending(true);
    setError('');
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: kind,
          fields,
          website: String(data.get('website') || ''),
          startedAt: startedAt.current,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error('delivery failed');
      setQueued(result.queued === true);
      setSent(true);
    } catch {
      setError('تعذر إرسال الطلب، ولم يصل تأكيد باستلامه. حاول مرة أخرى لاحقًا.');
    } finally {
      setSending(false);
    }
  };

  return <div className="form-shell">{sent ? <div className="form-confirmation" ref={confirmationRef} role="status" aria-live="polite">
    <span className="success-symbol">✓</span>
    <h2 tabIndex={-1}>{queued ? 'تم حفظ طلبك بنجاح' : 'تم إرسال الطلب بنجاح'}</h2>
    <p>{queued ? 'وصل طلبك إلى نظام النخبة وتم حفظه بأمان، وسيتم إشعار الفريق تلقائيًا.' : 'وصل طلبك إلى فريق النخبة بنجاح.'}</p>
    <button className="button button-navy" type="button" onClick={() => { setSent(false); startedAt.current = Date.now(); }}>إرسال طلب جديد</button>
  </div> : <>
    <div className="form-heading"><span className="eyebrow">النخبة معك</span><h2>{title}</h2><p>الحقول المطلوبة مميزة بعلامة النجمة.</p></div>
    <form className="form-grid" onSubmit={handleSubmit}>
      <label className="form-honeypot" aria-hidden="true" hidden>اترك الحقل فارغًا<input tabIndex={-1} type="text" autoComplete="off" name="website" /></label>
      {children}
      <div className="form-actions">
        <p>بياناتك تُرسل بأمان إلى فريق النخبة.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-navy" type="submit" disabled={sending}>{sending ? 'جارٍ إرسال الطلب…' : button}<ArrowIcon className="arrow-icon" /></button>
      </div>
    </form>
  </>}</div>;
}


export function HelpForm() {
  return <FormShell title="طلب مساعدة دراسية" button="إرسال طلب المساعدة" kind="help">
    <FormInput label="الاسم الكامل" name="name" required placeholder="اكتب اسمك الكامل" />
    <WhatsAppField />
    <SelectField label="التخصص" name="specialty" options={specialties} required />
    <SelectField label="السنة الدراسية" name="year" options={years} required />
    <FormInput label="اسم المادة" name="course" required placeholder="مثال: التشريح" />
    <FormInput label="موعد الكويز أو الامتحان" name="examDate" type="date" />
    <fieldset className="checkbox-field">
      <legend>نوع المساعدة المطلوبة</legend>
      <div>{['ملخص', 'شرح', 'مراجعة', 'أسئلة تدريبية', 'مصدر للمادة', 'أحتاج توجيه'].map(x =>
        <label key={x}><input type="checkbox" name="needs" value={x} /><span>{x}</span></label>)}</div>
    </fieldset>
  </FormShell>;
}

export function JoinForm() {
  return <FormShell title="انضم إلى فريق النخبة" button="تقديم طلب الانضمام" kind="join">
    <FormInput label="الاسم الكامل" name="name" required placeholder="اكتب اسمك الكامل" />
    <WhatsAppField />
    <SelectField label="التخصص" name="specialty" options={specialties} required />
    <SelectField label="السنة الدراسية" name="year" options={years} required />
    <FormInput label="المادة أو المجال الذي تستطيع المساعدة فيه" name="field" required placeholder="مثال: التشريح، التلخيص، التصميم" />
    <SelectField label="كيف تفضل أن تساهم؟" name="role" options={['الشرح', 'التلخيص', 'التنظيم', 'التصميم', 'لا أعرف بعد']} required />
  </FormShell>;
}

export function ContactForm() { return <FormShell title="أرسل رسالتك" button="إرسال الرسالة" kind="contact"><FormInput label="الاسم" name="name" required /><FormInput label="البريد الإلكتروني أو رقم التواصل" name="contact" required /><SelectField label="نوع الرسالة" name="type" options={['طلب مساعدة', 'اقتراح مادة', 'ملاحظة على محتوى', 'انضمام للفريق', 'أخرى']} required /><FormTextarea label="نص الرسالة" name="message" required placeholder="اكتب رسالتك هنا..." /></FormShell>; }

/** A compact, branded choice screen before submitting a request. */
export function HelpHub() {
  const [selected, setSelected] = useState<'help' | 'join' | null>(null);
  if (selected === 'help' || selected === 'join') {
    return <div className="help-hub help-hub-form">
      <button type="button" className="form-back-link" onClick={() => setSelected(null)}>
        <ArrowIcon className="arrow-icon" /> العودة إلى الخيارات
      </button>
      {selected === 'help' ? <HelpForm /> : <JoinForm />}
    </div>;
  }
  return <div className="help-options" aria-labelledby="help-options-heading">
    <header className="help-options-intro">
      <span className="help-options-eyebrow"><span aria-hidden="true" className="help-options-star">✦</span> النخبة معك</span>
      <h2 id="help-options-heading">كيف نقدر <span>نساعدك؟</span></h2>
      <p>اختر نوع الطلب المناسب، والباقي علينا.</p>
    </header>
    <div className="help-options-grid">
      <button type="button" className="help-option-card" onClick={() => setSelected('help')}>
        <span className="help-option-card-top">
          <span className="help-option-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7.5c-2.5-2-5-2.4-9-2v13c4-.4 6.5.1 9 2 2.5-1.9 5-2.4 9-2v-13c-4-.4-6.5 0-9 2Z"/><path d="M12 7.5v13"/></svg>
          </span>
          <span className="help-option-number">01</span>
        </span>
        <strong>اطلب مساعدة دراسية</strong>
        <span className="help-option-description">ملخصات، شرح، مراجعات، وأسئلة تدريبية تساعدك في موادك.</span>
        <span className="help-option-open"><span>إرسال طلب المساعدة</span><ArrowIcon className="arrow-icon" /></span>
      </button>
      <button type="button" className="help-option-card help-option-card-join" onClick={() => setSelected('join')}>
        <span className="help-option-card-top">
          <span className="help-option-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 20v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <span className="help-option-number">02</span>
        </span>
        <strong>انضم إلى النخبة</strong>
        <span className="help-option-description">شارك مهاراتك في الشرح والتلخيص والتصميم وساهم مع الفريق.</span>
        <span className="help-option-open"><span>تقديم طلب الانضمام</span><ArrowIcon className="arrow-icon" /></span>
      </button>
    </div>
    <p className="help-options-footnote">من الطالب... وللطالب.</p>
  </div>;
}
