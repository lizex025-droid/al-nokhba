'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { AcademicYear, MaterialNature, specialtyMaterialSets } from '@/lib/specialtyMaterials';
import { ArrowIcon } from '@/components/Icons';

const natures: MaterialNature[] = ['إجباري عام', 'إجباري كلية', 'إجباري تخصص'];
const years: AcademicYear[] = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة'];

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>;
}

export function SpecialtyMaterialsDirectory({ specialty }: { specialty: string }) {
  const collection = specialtyMaterialSets[specialty];
  const [draftQuery, setDraftQuery] = useState('');
  const [query, setQuery] = useState('');
  const [nature, setNature] = useState<MaterialNature | 'الكل'>('الكل');
  const [year, setYear] = useState<AcademicYear | 'الكل'>('الكل');

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('ar');
    return collection.materials.filter(material => {
      const matchesQuery = !needle || `${material.title} ${material.code} ${material.description}`.toLocaleLowerCase('ar').includes(needle);
      return matchesQuery && (nature === 'الكل' || material.nature === nature) && (year === 'الكل' || material.year === year);
    });
  }, [collection.materials, query, nature, year]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(draftQuery);
  }

  function resetFilters() {
    setDraftQuery('');
    setQuery('');
    setNature('الكل');
    setYear('الكل');
  }

  return <section className="specialty-materials-section">
    <div className="container-wide">
      <header className="specialty-directory-heading">
        <span className="eyebrow"><span className="eyebrow-line" />مركز المواد</span>
        <h1>{collection.title}</h1>
        <p>{collection.subtitle}</p>
      </header>

      <div className="specialty-browser-layout">
        <aside className="specialty-filters" aria-label="تصفية المواد">
          <div className="filter-heading"><span>الفلاتر</span><button type="button" onClick={resetFilters}>إعادة ضبط</button></div>
          <div className="mobile-filter-selects">
            <label><span>طبيعة المادة</span><select value={nature} onChange={event => setNature(event.target.value as MaterialNature | 'الكل')}>
              <option value="الكل">كل المتطلبات</option>
              {natures.map(option => <option value={option} key={option}>{option}</option>)}
            </select></label>
            <label><span>السنة الدراسية</span><select value={year} onChange={event => setYear(event.target.value as AcademicYear | 'الكل')}>
              <option value="الكل">كل السنوات</option>
              {years.map(option => <option value={option} key={option}>السنة {option}</option>)}
            </select></label>
          </div>
          <fieldset className="filter-group">
            <legend>طبيعة المادة</legend>
            {(['الكل', ...natures] as const).map(option => <label key={option}>
              <input type="radio" name="material-nature" checked={nature === option} onChange={() => setNature(option)} />
              <span>{option === 'الكل' ? 'كل المتطلبات' : option}</span>
              <b>{option === 'الكل' ? collection.materials.length : collection.materials.filter(item => item.nature === option).length}</b>
            </label>)}
          </fieldset>
          <fieldset className="filter-group">
            <legend>السنة الدراسية</legend>
            {(['الكل', ...years] as const).map(option => <label key={option}>
              <input type="radio" name="material-year" checked={year === option} onChange={() => setYear(option)} />
              <span>{option === 'الكل' ? 'كل السنوات' : `السنة ${option}`}</span>
              <b>{option === 'الكل' ? collection.materials.length : collection.materials.filter(item => item.year === option).length}</b>
            </label>)}
          </fieldset>
        </aside>

        <main className="specialty-material-main">
          <form className="material-search" role="search" onSubmit={submitSearch}>
            <label>
              <span className="sr-only">ابحث عن مادة</span>
              <SearchIcon />
              <input value={draftQuery} onChange={event => setDraftQuery(event.target.value)} placeholder="ابحث عن مادة بالاسم أو الرمز..." />
            </label>
            <button type="submit">بحث</button>
          </form>
          <div className="material-results-bar">
            <p><strong>{filtered.length}</strong> {filtered.length === 1 ? 'مادة' : 'مواد'} متاحة</p>
            <span>{nature === 'الكل' ? 'كل المتطلبات' : nature} · {year === 'الكل' ? 'كل السنوات' : `السنة ${year}`}</span>
          </div>

          {filtered.length > 0 ? <div className="specialty-material-grid">
            {filtered.map((material, index) => <article className="specialty-course-card" key={`${material.code}-${material.title}`}>
              <div className="course-card-top">
                <span className="course-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="course-nature">{material.nature}</span>
              </div>
              <div className="course-year">السنة {material.year}</div>
              <h2>{material.title}</h2>
              <p>{material.description}</p>
              <div className="course-card-meta"><span dir="ltr">{material.code}</span><span>{material.hours} {material.hours === 1 ? 'ساعة' : 'ساعات'}</span></div>
              <Link href="/request-help" className="course-help-link">اطلب محتوى المادة <ArrowIcon className="arrow-icon" /></Link>
            </article>)}
          </div> : <div className="material-empty-state">
            <span><SearchIcon /></span>
            <h2>لا توجد مواد مطابقة</h2>
            <p>جرّب كلمة بحث أخرى أو أعد ضبط الفلاتر لعرض جميع المواد.</p>
            <button type="button" className="button button-navy" onClick={resetFilters}>عرض كل المواد</button>
          </div>}
        </main>
      </div>
      <p className="materials-catalog-note">تصنيف المواد هنا لتنظيم التصفح والمراجعة. ارجع إلى الخطة الدراسية الرسمية عند التسجيل.</p>
    </div>
  </section>;
}
