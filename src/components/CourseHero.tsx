import Image from 'next/image';
import { courseDescription, type SpecialtyMaterial } from '@/lib/specialtyMaterials';

export function CourseHero({ material, count }: { material: SpecialtyMaterial; count: number }) {
  return <header className="course-hero">
    <div className="course-hero-copy">
      <div className="course-hero-badges">{material.nature && <span className="course-classification">{material.nature}</span>}{material.year && <span>السنة {material.year}</span>}{material.semester && <span>{material.semester}</span>}</div>
      <h1 id="course-title">{material.title}</h1>
      <p>{courseDescription(material)}</p>
      <ul className="course-hero-meta" aria-label="معلومات المادة">
        {material.code && <li><span aria-hidden="true">◇</span><bdi>{material.code}</bdi></li>}
        <li><span aria-hidden="true">▤</span>{count} ملف متاح</li>
        {material.hours != null && <li><span aria-hidden="true">◷</span>{material.hours} {material.hours === 1 ? 'ساعة' : 'ساعات'}</li>}
      </ul>
    </div>
    <div className="course-hero-art" aria-hidden="true">
      <Image src="/materials/university-requirements.webp" alt="" width={1672} height={941} loading="eager" fetchPriority="high" sizes="(max-width: 640px) 640px, 850px" />
      <span className="course-orbit" /><span className="course-orbit course-orbit-second" />
    </div>
  </header>;
}
