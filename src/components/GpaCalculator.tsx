'use client';

import { useMemo, useState } from 'react';
import { admissionPrograms } from '@/lib/admissionPrograms';
import { PlusIcon } from './Icons';

type CalculatorTab = 'gpa' | 'maximum' | 'admission';
type Course = { id: number; hours: string; grade: string; repeated: boolean; oldGrade: string };

const gradeOptions = [
  ['A', 4], ['A-', 3.75], ['B+', 3.5], ['B', 3], ['B-', 2.75], ['C+', 2.5],
  ['C', 2], ['C-', 1.75], ['D+', 1.5], ['D', 1.25], ['D-', 1], ['F', .5],
] as const;

const gradePoints = Object.fromEntries(gradeOptions) as Record<string, number>;
const newCourse = (id: number): Course => ({ id, hours: '3', grade: '', repeated: false, oldGrade: '' });
const gradeLabel = (value: number) => value >= 3.65 ? 'ممتاز' : value >= 3 ? 'جيد جدًا' : value >= 2.5 ? 'جيد' : value >= 2 ? 'مقبول' : 'ضعيف';

const tabs: { id: CalculatorTab; label: string; short: string }[] = [
  { id: 'gpa', label: 'حاسبة المعدل الجامعي', short: 'المعدل الجامعي' },
  { id: 'maximum', label: 'حاسبة أعلى معدل ممكن عند التخرج', short: 'أعلى معدل' },
  { id: 'admission', label: 'حاسبة القبول', short: 'القبول' },
];

function SelectGrade({ value, onChange, label = 'التقدير' }: { value: string; onChange: (value: string) => void; label?: string }) {
  return <label className="suite-field"><span>{label}</span><select value={value} onChange={event => onChange(event.target.value)}><option value="">اختر التقدير</option>{gradeOptions.map(([grade, points]) => <option value={grade} key={grade}>{grade} ({points.toFixed(2)})</option>)}</select></label>;
}

function UniversityGpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([newCourse(1)]);
  const [previousHours, setPreviousHours] = useState('');
  const [previousGpa, setPreviousGpa] = useState('');
  const [result, setResult] = useState<{ semester: number; cumulative: number; hours: number } | null>(null);
  const [error, setError] = useState('');

  const updateCourse = (id: number, changes: Partial<Course>) => {
    setCourses(current => current.map(course => course.id === id ? { ...course, ...changes } : course));
    setResult(null);
    setError('');
  };

  const calculate = () => {
    const oldHours = Number(previousHours || 0);
    const oldGpa = Number(previousGpa || 0);
    if ((previousHours && !previousGpa) || (!previousHours && previousGpa)) return setError('أدخل الساعات والمعدل السابقين معًا، أو اترك الحقلين فارغين.');
    if (oldHours < 0 || oldGpa < 0 || oldGpa > 4) return setError('تأكد أن الساعات صحيحة وأن المعدل السابق بين 0 و4.');
    if (courses.some(course => !course.grade || course.repeated && !course.oldGrade)) return setError('اختر التقدير لكل مادة، والتقدير السابق لأي مادة معادة.');

    let semesterPoints = 0;
    let semesterHours = 0;
    let totalPoints = oldHours * oldGpa;
    let totalHours = oldHours;

    courses.forEach(course => {
      const hours = Number(course.hours);
      const points = gradePoints[course.grade] * hours;
      semesterPoints += points;
      semesterHours += hours;
      if (course.repeated && oldHours > 0) totalPoints += (gradePoints[course.grade] - gradePoints[course.oldGrade]) * hours;
      else { totalPoints += points; totalHours += hours; }
    });

    setError('');
    setResult({ semester: semesterPoints / semesterHours, cumulative: totalPoints / totalHours, hours: semesterHours });
  };

  return <div className="suite-panel">
    <div className="suite-panel-heading"><span className="suite-step">01</span><div><h2>حاسبة المعدل التراكمي</h2><p>أضف موادك واحسب المعدل الفصلي والتراكمي بنظام النقاط من 4.</p></div></div>
    <div className="suite-fields suite-fields-two">
      <label className="suite-field"><span>الساعات التراكمية السابقة <small>اختياري</small></span><input type="number" min="0" step="1" placeholder="مثال: 45" value={previousHours} onChange={event => { setPreviousHours(event.target.value); setResult(null); }} /></label>
      <label className="suite-field"><span>المعدل التراكمي السابق <small>اختياري</small></span><input type="number" min="0" max="4" step="0.01" placeholder="0.00 إلى 4.00" value={previousGpa} onChange={event => { setPreviousGpa(event.target.value); setResult(null); }} /></label>
    </div>
    <div className="suite-section-title"><h3>المواد الدراسية</h3><span>{courses.length} {courses.length === 1 ? 'مادة' : 'مواد'}</span></div>
    <div className="suite-courses">{courses.map((course, index) => <div className="suite-course-card" key={course.id}>
      <div className="suite-course-head"><strong>المادة {index + 1}</strong><div><button type="button" onClick={() => setCourses(current => { const copy = { ...course, id: Date.now() }; const at = current.findIndex(item => item.id === course.id); return [...current.slice(0, at + 1), copy, ...current.slice(at + 1)]; })}>نسخ المادة</button><button type="button" className="danger" disabled={courses.length === 1} onClick={() => setCourses(current => current.filter(item => item.id !== course.id))}>حذف</button></div></div>
      <div className="suite-fields suite-course-fields"><SelectGrade value={course.grade} onChange={grade => updateCourse(course.id, { grade })} /><label className="suite-field"><span>الساعات</span><select value={course.hours} onChange={event => updateCourse(course.id, { hours: event.target.value })}>{[1, 2, 3, 4, 5, 6].map(hours => <option value={hours} key={hours}>{hours} {hours === 1 ? 'ساعة' : 'ساعات'}</option>)}</select></label><fieldset className="suite-repeat"><legend>هل المادة معادة؟</legend><label><input type="radio" name={`repeat-${course.id}`} checked={!course.repeated} onChange={() => updateCourse(course.id, { repeated: false, oldGrade: '' })} /> لا</label><label><input type="radio" name={`repeat-${course.id}`} checked={course.repeated} onChange={() => updateCourse(course.id, { repeated: true })} /> نعم</label></fieldset>{course.repeated && <SelectGrade label="التقدير السابق" value={course.oldGrade} onChange={oldGrade => updateCourse(course.id, { oldGrade })} />}</div>
    </div>)}</div>
    <button className="suite-add" type="button" onClick={() => setCourses(current => [...current, newCourse(Date.now())])}><PlusIcon /> إضافة مادة جديدة</button>
    {error && <p className="suite-error" role="alert">{error}</p>}
    <div className="suite-actions"><button className="button button-gold" type="button" onClick={calculate}>احسب معدلك</button><button className="reset-button" type="button" onClick={() => { setCourses([newCourse(1)]); setPreviousHours(''); setPreviousGpa(''); setResult(null); setError(''); }}>إعادة تعيين</button></div>
    {result && <div className="suite-results" role="status"><div><span>المعدل الفصلي</span><strong>{result.semester.toFixed(2)}</strong></div><div><span>المعدل التراكمي</span><strong>{result.cumulative.toFixed(2)}</strong></div><div><span>ساعات الفصل</span><strong>{result.hours}</strong></div><div><span>التقدير المتوقع</span><strong className="result-label">{gradeLabel(result.cumulative)}</strong></div></div>}
  </div>;
}

function MaximumGpaCalculator() {
  const [doneHours, setDoneHours] = useState('');
  const [currentGpa, setCurrentGpa] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [expectedGrade, setExpectedGrade] = useState('A');
  const [result, setResult] = useState<{ remaining: number; gpa: number } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const done = Number(doneHours); const current = Number(currentGpa); const total = Number(totalHours);
    if (!Number.isFinite(done) || done < 0 || !Number.isFinite(current) || current < 0 || current > 4 || !Number.isFinite(total) || total <= 0 || done > total) return setError('تأكد من إدخال الساعات بشكل صحيح، وأن المعدل الحالي بين 0 و4، وأن الساعات المقطوعة لا تتجاوز الخطة.');
    const remaining = total - done;
    const gpa = Math.min(4, ((current * done) + (gradePoints[expectedGrade] * remaining)) / total);
    setError(''); setResult({ remaining, gpa });
  };

  return <div className="suite-panel">
    <div className="suite-panel-heading"><span className="suite-step">02</span><div><h2>حاسبة أعلى معدل ممكن عند التخرج</h2><p>اعرف المعدل المتوقع إذا حافظت على تقدير محدد في الساعات المتبقية.</p></div></div>
    <div className="suite-fields suite-fields-two">
      <label className="suite-field"><span>الساعات المقطوعة</span><input type="number" min="0" step="1" placeholder="مثال: 60" value={doneHours} onChange={event => { setDoneHours(event.target.value); setResult(null); }} /></label>
      <label className="suite-field"><span>المعدل الحالي</span><input type="number" min="0" max="4" step="0.01" placeholder="0.00 إلى 4.00" value={currentGpa} onChange={event => { setCurrentGpa(event.target.value); setResult(null); }} /></label>
      <label className="suite-field"><span>ساعات الخطة الكلية</span><input type="number" min="1" step="1" placeholder="مثال: 160" value={totalHours} onChange={event => { setTotalHours(event.target.value); setResult(null); }} /></label>
      <SelectGrade label="التقدير المتوقع لباقي المواد" value={expectedGrade} onChange={value => { setExpectedGrade(value); setResult(null); }} />
    </div>
    {error && <p className="suite-error" role="alert">{error}</p>}
    <div className="suite-actions"><button className="button button-gold" type="button" onClick={calculate}>احسب أعلى معدل ممكن</button></div>
    {result && <div className="suite-results" role="status"><div><span>الساعات المتبقية</span><strong>{result.remaining}</strong></div><div><span>أعلى معدل ممكن</span><strong>{result.gpa.toFixed(2)}</strong></div><div><span>التقدير المتوقع</span><strong className="result-label">{gradeLabel(result.gpa)}</strong></div></div>}
    <p className="suite-note">النتيجة تقديرية وتفترض حصولك على التقدير المختار في جميع الساعات المتبقية.</p>
  </div>;
}

function AdmissionCalculator() {
  const [score, setScore] = useState(80);
  const [search, setSearch] = useState('');
  const filteredPrograms = useMemo(() => { const term = search.trim(); return term ? admissionPrograms.filter(program => `${program.major} ${program.faculty}`.includes(term)) : admissionPrograms; }, [search]);
  const summary = useMemo(() => admissionPrograms.reduce((totals, program) => { if (score > program.minimum) totals.accepted += 1; else if (score === program.minimum) totals.edge += 1; else totals.rejected += 1; return totals; }, { accepted: 0, edge: 0, rejected: 0 }), [score]);

  return <div className="suite-panel admission-calculator">
    <div className="suite-panel-heading"><span className="suite-step">03</span><div><h2>حاسبة القبول</h2><p>حرّك المؤشر لمعرفة التخصصات المتاحة لك مبدئيًا بناءً على معدل التوجيهي.</p></div></div>
    <div className="admission-score-card">
      <div className="admission-score-top"><div><span>معدل التوجيهي</span><strong>{score}<small>%</small></strong></div><div className="admission-summary" aria-live="polite"><span className="accepted"><i />مقبول: {summary.accepted}</span><span className="edge"><i />على الحد: {summary.edge}</span><span className="rejected"><i />غير مقبول: {summary.rejected}</span></div></div>
      <input className="admission-range" aria-label="معدل التوجيهي" type="range" min="50" max="100" step="1" value={score} onChange={event => setScore(Number(event.target.value))} style={{ '--range-progress': `${(score - 50) * 2}%` } as React.CSSProperties} />
      <div className="range-labels"><span>50%</span><span>100%</span></div>
    </div>
    <label className="admission-search"><span className="sr-only">ابحث عن تخصص أو كلية</span><input type="search" placeholder="ابحث عن تخصص أو كلية…" value={search} onChange={event => setSearch(event.target.value)} /><b aria-hidden="true">⌕</b></label>
    <div className="admission-list" aria-label="نتائج التخصصات">{filteredPrograms.map(program => { const status = score > program.minimum ? 'accepted' : score === program.minimum ? 'edge' : 'rejected'; return <article className={`admission-program ${status}`} key={`${program.faculty}-${program.major}`}><div><h3>{program.major}</h3><p>{program.faculty}</p></div><span>{status === 'accepted' ? 'مقبول ✓' : status === 'edge' ? 'على الحد' : `${program.minimum}%`}</span></article>; })}{filteredPrograms.length === 0 && <p className="admission-empty">لا توجد تخصصات مطابقة للبحث.</p>}</div>
    <p className="suite-note admission-note">* الأرقام تقديرية بناءً على معدلات القبول السابقة وقد تتغير سنويًا. راجع وحدة تنسيق القبول الموحد والمصادر الرسمية قبل اتخاذ أي قرار.</p>
  </div>;
}

export function GpaCalculator() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('gpa');
  return <section className="calculator-suite" data-reveal>
    <div className="suite-heading"><span className="eyebrow"><span className="eyebrow-line" />أداة الطالب</span><h1>حاسبات الطالب الجامعي</h1><p>احسب معدلك، استكشف أفضل معدل ممكن، وتعرّف إلى خيارات القبول من مكان واحد.</p></div>
    <div className="calculator-tabs" role="tablist" aria-label="اختر الحاسبة">{tabs.map(tab => <button type="button" role="tab" id={`tab-${tab.id}`} aria-controls={`panel-${tab.id}`} aria-selected={activeTab === tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)} key={tab.id}><span>{tab.label}</span><small>{tab.short}</small></button>)}</div>
    <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>{activeTab === 'gpa' && <UniversityGpaCalculator />}{activeTab === 'maximum' && <MaximumGpaCalculator />}{activeTab === 'admission' && <AdmissionCalculator />}</div>
  </section>;
}
