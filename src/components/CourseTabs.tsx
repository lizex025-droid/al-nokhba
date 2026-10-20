'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { availableResources, type CourseResource, type ResourceTab, type ResourceSection } from '@/lib/courseResources';

const tabs: { id: ResourceTab; label: string }[] = [
  { id: 'summaries', label: 'ملخصات' }, { id: 'slides', label: 'سلايدات' },
  { id: 'tests', label: 'اختبارات' }, { id: 'lectures', label: 'محاضرات' },
];
const sections: { id: ResourceSection; label: string }[] = [
  { id: 'midterm', label: 'منتصف الفصل' }, { id: 'final', label: 'نهاية الفصل' }, { id: 'extra', label: 'مواد إضافية' },
];
function ResourceIcon({ tab }: { tab: ResourceTab }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {tab === 'lectures' ? <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/></> : tab === 'slides' ? <><path d="M3 4h18v13H3zM12 17v4m-4 0h8M7 9h10M7 12h6"/></> : tab === 'tests' ? <><path d="M8 4H5v17h14V4h-3M9 2h6v4H9zM8 12l2 2 5-5M8 18h7"/></> : <><path d="M6 2h8l4 4v16H6zM14 2v5h4M9 12h6m-6 4h6"/></>}
  </svg>;
}
export function CourseEmptyState() {
  return <div className="course-empty-state"><ResourceIcon tab="summaries"/><p>لا توجد ملفات متاحة حاليًا في هذا القسم.</p><span>يمكنك تصفح الأقسام الأخرى للاطّلاع على المحتوى المتوفر.</span></div>;
}
export function CourseResourceItem({ resource }: { resource: ReturnType<typeof availableResources>[number] }) {
  const isVideo = resource.tab === 'lectures';
  const isTest = resource.tab === 'tests' && resource.interactive;
  const isFile = /\.(pdf|pptx?|docx?|xlsx?|zip|png|jpe?g)(?:[?#]|$)/i.test(resource.url) || /pdf|powerpoint|presentation/i.test(resource.type || '');
  return <li className="course-resource-item">
    <span className="course-file-icon"><ResourceIcon tab={resource.tab}/></span>
    <div className="course-resource-copy"><h3>{resource.title}</h3><p>{resource.type || (isVideo ? 'محاضرة مرئية' : isTest ? 'اختبار تفاعلي' : 'مادة دراسية')}</p></div>
    <div className="course-resource-actions">
      <a href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={`${isVideo ? 'فتح الفيديو' : isTest ? 'بدء الاختبار' : 'معاينة'}: ${resource.title} (نافذة جديدة)`}>{isVideo ? 'فتح الفيديو' : isTest ? 'بدء الاختبار' : 'معاينة'}<span aria-hidden="true">↗</span></a>
      {!isVideo && !isTest && (resource.downloadUrl || isFile) && <a href={resource.downloadUrl || resource.url} download target="_blank" rel="noopener noreferrer" aria-label={`تحميل: ${resource.title}`}>تحميل <span aria-hidden="true">↓</span></a>}
    </div>
  </li>;
}
export function CourseResourceAccordion({ label, resources }: { label: string; resources: ReturnType<typeof availableResources> }) {
  return <details className="course-resource-group" open><summary><span className="course-folder" aria-hidden="true">▱</span><span><strong>{label}</strong><small>{resources.length} ملف متاح</small></span><span className="course-chevron" aria-hidden="true">⌄</span></summary><ul>{resources.map(resource => <CourseResourceItem key={resource.url} resource={resource}/>)}</ul></details>;
}
export function CourseTabs({ resources }: { resources: CourseResource[] }) {
  const [active, setActive] = useState<ResourceTab>('summaries');
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const available = availableResources(resources);
  function handleKeys(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowLeft') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowRight') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); setActive(tabs[next].id); refs.current[next]?.focus();
  }
  return <>
    <div className="course-tabs" role="tablist" aria-label="المحتوى الدراسي">{tabs.map((tab, index) => <button key={tab.id} type="button" role="tab" id={`tab-${tab.id}`} aria-selected={active === tab.id} aria-controls={`panel-${tab.id}`} tabIndex={active === tab.id ? 0 : -1} ref={node => { refs.current[index] = node; }} onKeyDown={event => handleKeys(event, index)} onClick={() => setActive(tab.id)}><ResourceIcon tab={tab.id}/>{tab.label}</button>)}</div>
    {tabs.map(tab => {
      const items = available.filter(resource => resource.tab === tab.id);
      return <section key={tab.id} id={`panel-${tab.id}`} role="tabpanel" aria-labelledby={`tab-${tab.id}`} hidden={active !== tab.id} tabIndex={0} className="course-panel">
        <header><h2>{tab.label}</h2><p>المحتوى الدراسي</p></header>
        {items.length ? sections.map(section => {
          const grouped = items.filter(item => item.section === section.id);
          return grouped.length ? <CourseResourceAccordion key={section.id} label={section.label} resources={grouped}/> : null;
        }) : <CourseEmptyState/>}
      </section>;
    })}
  </>;
}
