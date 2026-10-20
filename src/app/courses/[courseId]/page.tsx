import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allCourses, courseDescription } from '@/lib/specialtyMaterials';
import { availableResources } from '@/lib/courseResources';
import { CourseTabs } from '@/components/CourseTabs';
import { CourseHero } from '@/components/CourseHero';
import './course-details.css';

export const dynamicParams = false;
export function generateStaticParams() { return allCourses().map(course => ({ courseId: course.id })); }
export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }): Promise<Metadata> {
  const { courseId } = await params;
  const course = allCourses().find(course => course.id === courseId);
  return course ? { title: course.material.title, description: courseDescription(course.material) } : { title: 'المادة غير موجودة' };
}
export default async function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = allCourses().find(course => course.id === courseId);
  if (!course) notFound();
  const { material, categories } = course;
  const category = categories.find(category => category.slug.endsWith('requirements')) || categories[0];
  const resources = availableResources(material.resources);
  return <section className="course-details container-wide" aria-labelledby="course-title">
    <div className="course-details-shell">
      <nav className="course-breadcrumbs" aria-label="مسار التصفح">
        <Link href="/materials">مركز المواد</Link><span aria-hidden="true">/</span>
        <Link href={`/${category.slug}`}>{category.title}</Link>
        {material.year && <><span aria-hidden="true">/</span><span>السنة {material.year}</span></>}
        <span aria-hidden="true">/</span><span aria-current="page">{material.code || material.title}</span>
      </nav>
      <CourseHero material={material} count={resources.length} />
      <CourseTabs resources={resources} />
      <footer className="course-details-footer"><Link href={`/${category.slug}`}>← العودة إلى {category.title}</Link><span>المحتوى الدراسي يُضاف حسب توفره.</span></footer>
    </div>
  </section>;
}
