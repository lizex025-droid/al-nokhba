import Link from 'next/link';
export default function CourseNotFound() {
  return <section className="content-section container-wide"><h1>المادة غير موجودة</h1><p>تعذّر العثور على هذه المادة. تصفح مركز المواد لاختيار مادة متاحة.</p><Link className="button button-navy" href="/materials">مركز المواد</Link></section>;
}
