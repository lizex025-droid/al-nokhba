'use client';

import { useState } from 'react';

const years = ['2005', '2006', '2007', '2008'] as const;
const prostheticsPlanPdf = 'https://pub-5e0d8e94b53b42998dc9e8ceeb884c10.r2.dev/%D8%AE%D8%B7%D8%A9/%D8%A7%D9%84%D8%AE%D8%B7%D8%A9%20%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%B3%D9%8A%D8%A9%20%D9%84%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D8%AC%20%D8%A7%D9%84%D8%A7%D9%94%D8%B7%D8%B1%D8%A7%D9%81%20%D8%A7%D9%84%D8%A7%D8%B5%D8%B7%D9%86%D8%A7%D8%B9%D9%8A%D8%A9%20%D9%88%D8%A7%D9%84%D8%A7%D9%94%D8%AC%D9%87%D8%B2%D8%A9%20%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9%20%202020-%202021%20%282%29.pdf';

export function StudyPlanYearPicker({ specialtyTitle, specialty }: { specialtyTitle: string; specialty: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const linkedPdf = specialty === 'prosthetics-orthotics' && (selected === '2005' || selected === '2006') ? prostheticsPlanPdf : null;

  return <div className="plan-year-picker">
    <div className="plan-year-grid">
      {years.map(year => <button key={year} type="button" aria-pressed={selected === year}
        className={`plan-year-card${selected === year ? ' selected' : ''}`} data-card-reveal
        onClick={() => setSelected(year)}>
        <span className="plan-year-label">الخطة الدراسية</span>
        <strong dir="ltr">{year}</strong>
        <span className="plan-year-action">{selected === year ? 'تم اختيار الخطة' : 'عرض الخطة'} <span aria-hidden="true">←</span></span>
      </button>)}
    </div>
    {selected && <div className="plan-year-result" role="status">
      <span className="plan-year-result-number" dir="ltr">{selected}</span>
      <div><h2>{specialtyTitle} — خطة {selected}</h2>
      {linkedPdf ? <><p>ملف الخطة متاح للعرض. ملاحظة: اسم الملف يشير إلى العام الدراسي 2020–2021؛ يرجى التأكد من مطابقته لسنة خطتك.</p><a className="plan-year-pdf-link" href={linkedPdf} target="_blank" rel="noopener noreferrer">فتح ملف PDF ↗</a></> : <p>ملف هذه الخطة لم يُضف إلى الموقع بعد. سيتم عرض تفاصيلها هنا عند توفير الملف الرسمي، حتى لا نعرض مواد أو ساعات غير موثّقة.</p>}</div>
    </div>}
  </div>;
}
