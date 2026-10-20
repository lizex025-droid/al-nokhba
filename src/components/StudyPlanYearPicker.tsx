'use client';

import { useState } from 'react';

const years = ['2005', '2006', '2007', '2008'] as const;

export function StudyPlanYearPicker({ specialtyTitle }: { specialtyTitle: string }) {
  const [selected, setSelected] = useState<string | null>(null);

  return <div className="plan-year-picker">
    <div className="plan-year-grid">
      {years.map(year => <button key={year} type="button" aria-pressed={selected === year}
        className={`plan-year-card${selected === year ? ' selected' : ''}`}
        onClick={() => setSelected(year)}>
        <span className="plan-year-label">الخطة الدراسية</span>
        <strong dir="ltr">{year}</strong>
        <span className="plan-year-action">{selected === year ? 'تم اختيار الخطة' : 'عرض الخطة'} <span aria-hidden="true">←</span></span>
      </button>)}
    </div>
    {selected && <div className="plan-year-result" role="status">
      <span className="plan-year-result-number" dir="ltr">{selected}</span>
      <div><h2>{specialtyTitle} — خطة {selected}</h2>
      <p>ملف هذه الخطة لم يُضف إلى الموقع بعد. سيتم عرض تفاصيلها هنا عند توفير الملف الرسمي، حتى لا نعرض مواد أو ساعات غير موثّقة.</p></div>
    </div>}
  </div>;
}
