'use client';

import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowIcon } from './Icons';

const specialties = ['العلاج الطبيعي', 'العلاج الوظيفي', 'الأطراف الاصطناعية والأجهزة المساعدة', 'السمع والنطق', 'متطلبات الكلية', 'متطلبات الجامعة', 'غير ذلك'];
const years = ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة', 'السنة الرابعة', 'لا أعرف'];
type FieldProps = { label: string; name: string; required?: boolean; placeholder?: string; type?: string; hint?: string };
export function FormInput({ label, name, required = false, placeholder, type = 'text', hint }: FieldProps) { return <label className="form-field"><span>{label}{required && <em> *</em>}</span><input name={name} type={type} required={required} placeholder={placeholder} />{hint && <small>{hint}</small>}</label>; }
export function FormTextarea({ label, name, required = false, placeholder, hint }: FieldProps) { return <label className="form-field form-field-full"><span>{label}{required && <em> *</em>}</span><textarea name={name} required={required} rows={5} placeholder={placeholder} />{hint && <small>{hint}</small>}</label>; }
export function SelectField({ label, name, options, required = false }: { label: string; name: string; options: string[]; required?: boolean }) { return <label className="form-field"><span>{label}{required && <em> *</em>}</span><select name={name} required={required} defaultValue=""><option value="" disabled>اختر من القائمة</option>{options.map(x => <option key={x}>{x}</option>)}</select></label>; }


const FORM_ENDPOINT = 'https://al-nokhba-forms.lizex025.workers.dev/submit';

function FormShell({ children, title, button, kind }: { children: ReactNode; title: string; button: string; kind: 'help' | 'join' | 'contact' }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const startedAt = useRef(Date.now());

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
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
      setSent(true);
    } catch {
      setError('تعذر إرسال الطلب، ولم يصل تأكيد باستلامه. حاول مرة أخرى لاحقًا.');
    } finally {
      setSending(false);
    }
  };

  return <div className="form-shell" data-reveal>{sent ? <div className="form-confirmation" role="status">
    <span className="success-symbol">✓</span>
    <h2>تم إرسال الطلب بنجاح</h2>
    <p>تم استلام طلبك في نظام النخبة.</p>
    <button className="button button-navy" type="button" onClick={() => { setSent(false); startedAt.current = Date.now(); }}>إرسال طلب جديد</button>
  </div> : <>
    <div className="form-heading"><span className="eyebrow">النخبة معك</span><h2>{title}</h2><p>الحقول المطلوبة مميزة بعلامة النجمة.</p></div>
    <form className="form-grid" onSubmit={handleSubmit}>
      <label className="form-honeypot" aria-hidden="true">اترك الحقل فارغًا<input tabIndex={-1} type="text" autoComplete="off" name="website" /></label>
      {children}
      <div className="form-actions">
        <p>لن يظهر تأكيد الإرسال إلا بعد وصول الطلب إلى نظام النخبة.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-navy" type="submit" disabled={sending}>{sending ? 'جارٍ إرسال الطلب…' : button}<ArrowIcon className="arrow-icon" /></button>
      </div>
    </form>
  </>}</div>;
}

export function HelpForm() { return <FormShell title="أخبرنا كيف يمكننا مساعدتك" button="إرسال طلب المساعدة" kind="help"><FormInput label="الاسم" name="name" required placeholder="اسمك الكامل" /><FormInput label="رقم التواصل أو Telegram" name="contact" required placeholder="رقم الهاتف أو اسم المستخدم" /><SelectField label="التخصص" name="specialty" options={specialties} required /><SelectField label="السنة الدراسية" name="year" options={years} required /><FormInput label="اسم المادة" name="course" required placeholder="مثال: التشريح" /><FormInput label="اسم الدكتور" name="professor" hint="اختياري، لكن يساعدنا على فهم طبيعة المادة أو طريقة الأسئلة." /><FormInput label="متى موعد الكويز أو الامتحان؟" name="examDate" type="date" /><FormTextarea label="ما الجزء الذي تواجه فيه صعوبة؟" name="difficulty" required placeholder="اكتب الموضوع، الوحدة، السلايدات، أو نوع الأسئلة التي لا تفهمها." /><fieldset className="checkbox-field"><legend>ماذا تحتاج؟</legend><div>{['ملخص', 'شرح', 'مراجعة', 'أسئلة تدريبية', 'مصدر للمادة', 'لا أعرف، أحتاج توجيه'].map(x => <label key={x}><input type="checkbox" name="needs" value={x} /><span>{x}</span></label>)}</div></fieldset><FormTextarea label="ملاحظات إضافية" name="notes" placeholder="أي تفاصيل تساعدنا على فهم طلبك" /></FormShell>; }
export function JoinForm() { return <FormShell title="طلب الانضمام للفريق" button="تقديم طلب الانضمام" kind="join"><FormInput label="الاسم" name="name" required /><SelectField label="التخصص" name="specialty" options={specialties} required /><SelectField label="السنة الدراسية" name="year" options={years} required /><FormInput label="المادة أو المجال الذي تستطيع المساعدة فيه" name="field" required /><SelectField label="كيف تفضل أن تساهم؟" name="role" options={['الشرح', 'التلخيص', 'التنظيم', 'التصميم', 'لا أعرف']} required /><FormInput label="رقم التواصل" name="phone" type="tel" required /><FormTextarea label="لماذا تريد الانضمام؟" name="reason" required /></FormShell>; }
export function ContactForm() { return <FormShell title="أرسل رسالتك" button="إرسال الرسالة" kind="contact"><FormInput label="الاسم" name="name" required /><FormInput label="البريد الإلكتروني أو رقم التواصل" name="contact" required /><SelectField label="نوع الرسالة" name="type" options={['طلب مساعدة', 'اقتراح مادة', 'ملاحظة على محتوى', 'انضمام للفريق', 'أخرى']} required /><FormTextarea label="نص الرسالة" name="message" required placeholder="اكتب رسالتك هنا..." /></FormShell>; }

/** Shared entry point for academic-help and volunteer-join requests. */
export function HelpHub() {
  const [selected, setSelected] = useState<'help' | 'join' | null>(null);
  if (selected === 'help') return <div className="help-hub"><button type="button" className="form-back-link" onClick={() => setSelected(null)}>العودة إلى الخيارات</button><HelpForm /></div>;
  if (selected === 'join') return <div className="help-hub"><button type="button" className="form-back-link" onClick={() => setSelected(null)}>العودة إلى الخيارات</button><JoinForm /></div>;
  return <div className="help-options">
    <div className="help-options-intro"><span className="eyebrow">النخبة معك</span><h2>كيف نقدر نساعدك؟</h2><p>اختر نوع الطلب المناسب.</p></div>
    <div className="help-options-grid">
      <button type="button" className="help-option-card" onClick={() => setSelected('help')}>
        <span className="help-option-index">01</span>
        <strong>اطلب مساعدة دراسية</strong>
        <span>ملخصات، شرح، مراجعات، أو أسئلة تدريبية للمادة التي تحتاجها.</span>
        <span className="help-option-open">إرسال طلب المساعدة <ArrowIcon className="arrow-icon" /></span>
      </button>
      <button type="button" className="help-option-card" onClick={() => setSelected('join')}>
        <span className="help-option-index">02</span>
        <strong>انضم إلى النخبة</strong>
        <span>ساعدنا في الشرح والتلخيص وتنظيم المواد وخدمة الطلبة.</span>
        <span className="help-option-open">تقديم طلب الانضمام <ArrowIcon className="arrow-icon" /></span>
      </button>
    </div>
  </div>;
}
