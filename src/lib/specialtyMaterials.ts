export type MaterialNature = 'إجباري عام' | 'إجباري كلية' | 'إجباري تخصص';
export type AcademicYear = 'الأولى' | 'الثانية' | 'الثالثة' | 'الرابعة';

import type { CourseResource } from './courseResources';

export type SpecialtyMaterial = {
  id?: string;
  semester?: string;
  resources?: CourseResource[];
  code?: string;
  title: string;
  description?: string;
  nature?: MaterialNature;
  year?: AcademicYear;
  hours?: number;
};

export type SpecialtyMaterialSet = {
  title: string;
  subtitle: string;
  materials: SpecialtyMaterial[];
};

const commonMaterials: SpecialtyMaterial[] = [
  { code: 'UNI 101', title: 'مهارات اللغة العربية', description: 'مهارات الكتابة والقراءة والتواصل الأكاديمي باللغة العربية.', nature: 'إجباري عام', year: 'الأولى', hours: 3 },
  { code: 'UNI 102', title: 'مهارات اللغة الإنجليزية', description: 'المصطلحات والمهارات الأساسية اللازمة للدراسة الجامعية.', nature: 'إجباري عام', year: 'الأولى', hours: 3 },
  { code: 'RHS 101', title: 'التشريح العام', description: 'مدخل إلى تركيب جسم الإنسان والأجهزة الرئيسة وعلاقتها بالحركة.', nature: 'إجباري كلية', year: 'الأولى', hours: 3 },
  { code: 'RHS 102', title: 'وظائف الأعضاء', description: 'فهم وظائف أجهزة الجسم والعمليات الحيوية الأساسية.', nature: 'إجباري كلية', year: 'الأولى', hours: 3 },
  { code: 'RHS 204', title: 'علم النفس الصحي', description: 'المفاهيم النفسية المرتبطة بالصحة والمرض والتأهيل.', nature: 'إجباري كلية', year: 'الثانية', hours: 3 },
];

export const specialtyMaterialSets: Record<string, SpecialtyMaterialSet> = {
  'physical-therapy-materials': {
    title: 'مواد العلاج الطبيعي',
    subtitle: 'ابحث في مواد العلاج الطبيعي وصفِّ النتائج حسب طبيعة المادة والسنة الدراسية.',
    materials: [
      ...commonMaterials,
      { code: 'PT 111', title: 'مقدمة في العلاج الطبيعي', description: 'مبادئ المهنة، مجالات العمل، وأساسيات الممارسة العلاجية.', nature: 'إجباري تخصص', year: 'الأولى', hours: 2 },
      { code: 'PT 221', title: 'علم الحركة', description: 'تحليل حركة جسم الإنسان وعمل المفاصل والعضلات.', nature: 'إجباري تخصص', year: 'الثانية', hours: 3 },
      { code: 'PT 224', title: 'التمارين العلاجية', description: 'تصميم التمارين العلاجية وتطبيقها وفق احتياج المريض.', nature: 'إجباري تخصص', year: 'الثانية', hours: 3 },
      { code: 'PT 331', title: 'العلاج الطبيعي للعظام', description: 'تقييم وعلاج إصابات واضطرابات الجهاز العضلي الهيكلي.', nature: 'إجباري تخصص', year: 'الثالثة', hours: 4 },
      { code: 'PT 336', title: 'التأهيل العصبي', description: 'مبادئ تقييم وتأهيل الحالات العصبية لدى البالغين.', nature: 'إجباري تخصص', year: 'الثالثة', hours: 4 },
      { code: 'PT 442', title: 'العلاج الطبيعي القلبي والتنفسي', description: 'تقييم وتأهيل الحالات القلبية والتنفسية في الممارسة السريرية.', nature: 'إجباري تخصص', year: 'الرابعة', hours: 3 },
      { code: 'PT 499', title: 'التدريب السريري في العلاج الطبيعي', description: 'تطبيق عملي متقدم للمهارات المهنية ضمن بيئة سريرية.', nature: 'إجباري تخصص', year: 'الرابعة', hours: 6 },
    ],
  },
  'occupational-therapy-materials': {
    title: 'مواد العلاج الوظيفي',
    subtitle: 'تصفح مواد العلاج الوظيفي بسهولة، أو استخدم البحث وفلاتر السنة وطبيعة المادة.',
    materials: [
      ...commonMaterials,
      { code: 'OT 111', title: 'مقدمة في العلاج الوظيفي', description: 'أسس المهنة ودور النشاط الهادف في دعم استقلالية الفرد.', nature: 'إجباري تخصص', year: 'الأولى', hours: 2 },
      { code: 'OT 221', title: 'تحليل النشاط', description: 'تحليل متطلبات الأنشطة وتكييفها بما يلائم قدرات المستفيد.', nature: 'إجباري تخصص', year: 'الثانية', hours: 3 },
      { code: 'OT 225', title: 'الأداء الوظيفي عبر مراحل الحياة', description: 'تطور الأداء والمهارات الوظيفية من الطفولة إلى الشيخوخة.', nature: 'إجباري تخصص', year: 'الثانية', hours: 3 },
      { code: 'OT 332', title: 'العلاج الوظيفي للأطفال', description: 'تقييم وتدخلات العلاج الوظيفي لمشكلات الطفولة والنمو.', nature: 'إجباري تخصص', year: 'الثالثة', hours: 4 },
      { code: 'OT 337', title: 'العلاج الوظيفي والصحة النفسية', description: 'تدخلات تدعم المشاركة والاستقلال لدى حالات الصحة النفسية.', nature: 'إجباري تخصص', year: 'الثالثة', hours: 3 },
      { code: 'OT 443', title: 'التكنولوجيا المساعدة', description: 'اختيار وتوظيف التقنيات والأدوات المساعدة في التأهيل.', nature: 'إجباري تخصص', year: 'الرابعة', hours: 3 },
      { code: 'OT 499', title: 'التدريب السريري في العلاج الوظيفي', description: 'تطبيق مهارات التقييم والتدخل والتوثيق ضمن بيئة سريرية.', nature: 'إجباري تخصص', year: 'الرابعة', hours: 6 },
    ],
  },
  'prosthetics-orthotics-materials': {
    title: 'مواد الأطراف الاصطناعية والأجهزة المساعدة',
    subtitle: 'اعثر على مواد تخصص الأطراف والأجهزة المساعدة حسب السنة أو طبيعة المتطلب.',
    materials: [
      ...commonMaterials,
      { code: 'PO 111', title: 'مقدمة في الأطراف والأجهزة المساعدة', description: 'مدخل إلى التخصص، المصطلحات الأساسية ومسار الخدمة التأهيلية.', nature: 'إجباري تخصص', year: 'الأولى', hours: 2 },
      { code: 'PO 221', title: 'الميكانيكا الحيوية', description: 'القوى والحركة وتطبيقاتهما على جسم الإنسان والأجهزة التعويضية.', nature: 'إجباري تخصص', year: 'الثانية', hours: 3 },
      { code: 'PO 226', title: 'علم المواد والتصنيع', description: 'خصائص المواد وطرق تشكيلها واستخدامها في الأطراف والأجهزة.', nature: 'إجباري تخصص', year: 'الثانية', hours: 3 },
      { code: 'PO 331', title: 'الأطراف الاصطناعية السفلية', description: 'تقييم وتصميم وتصنيع الأطراف الاصطناعية للطرف السفلي.', nature: 'إجباري تخصص', year: 'الثالثة', hours: 4 },
      { code: 'PO 335', title: 'الأجهزة التقويمية', description: 'مبادئ وصف وتصميم الأجهزة التقويمية لمختلف الحالات.', nature: 'إجباري تخصص', year: 'الثالثة', hours: 4 },
      { code: 'PO 441', title: 'تحليل المشي', description: 'تحليل دورة المشي وتفسير الانحرافات لاتخاذ القرار السريري.', nature: 'إجباري تخصص', year: 'الرابعة', hours: 3 },
      { code: 'PO 445', title: 'التصميم والتصنيع الرقمي', description: 'استخدام التقنيات الرقمية في تصميم وتصنيع الأجهزة التعويضية.', nature: 'إجباري تخصص', year: 'الرابعة', hours: 3 },
      { code: 'PO 499', title: 'التدريب السريري في الأطراف والأجهزة', description: 'تطبيق عملي متقدم من التقييم وحتى التسليم والمتابعة.', nature: 'إجباري تخصص', year: 'الرابعة', hours: 6 },
    ],
  },
  'hearing-speech-materials': {
    title: 'مواد السمع والنطق',
    subtitle: 'تصفح مواد السمع والنطق وابحث بالاسم أو الرمز، ثم صفِّها حسب السنة والمتطلب.',
    materials: [
      ...commonMaterials,
      { code: 'AS 111', title: 'مدخل إلى علوم السمع والنطق', description: 'تعريف بالمهنة ومجالات التقييم والتأهيل والتواصل الإنساني.', nature: 'إجباري تخصص', year: 'الأولى', hours: 2 },
      { code: 'AS 214', title: 'الصوتيات وعلم الأصوات', description: 'خصائص الأصوات وإنتاجها وتحليلها ضمن الكلام واللغة.', nature: 'إجباري تخصص', year: 'الثانية', hours: 3 },
      { code: 'AS 222', title: 'تشريح جهاز النطق والسمع', description: 'البنى التشريحية والوظيفية المسؤولة عن السمع وإنتاج الكلام.', nature: 'إجباري تخصص', year: 'الثانية', hours: 3 },
      { code: 'AS 331', title: 'تقييم السمع', description: 'أساليب الفحص السمعي وقراءة النتائج وتفسيرها.', nature: 'إجباري تخصص', year: 'الثالثة', hours: 4 },
      { code: 'AS 335', title: 'اضطرابات اللغة', description: 'تقييم اضطرابات اللغة لدى الأطفال والبالغين ووضع خطة التدخل.', nature: 'إجباري تخصص', year: 'الثالثة', hours: 3 },
      { code: 'AS 341', title: 'اضطرابات النطق والطلاقة', description: 'فهم اضطرابات النطق والطلاقة وأساليب التقييم والعلاج.', nature: 'إجباري تخصص', year: 'الثالثة', hours: 3 },
      { code: 'AS 443', title: 'التأهيل السمعي', description: 'تدخلات تأهيلية لتحسين الاستماع والتواصل وجودة الحياة.', nature: 'إجباري تخصص', year: 'الرابعة', hours: 3 },
      { code: 'AS 499', title: 'التدريب السريري في السمع والنطق', description: 'تطبيق التقييم والتدخل والتوثيق تحت الإشراف السريري.', nature: 'إجباري تخصص', year: 'الرابعة', hours: 6 },
    ],
  },
};

// Shared requirement lists reuse the original records, never copies of official metadata.
for (const [slug, title, nature] of [
  ['faculty-requirements', 'متطلبات الكلية', 'إجباري كلية'],
  ['university-requirements', 'متطلبات الجامعة', 'إجباري عام'],
] as const) {
  const records = Object.values(specialtyMaterialSets).flatMap(set => set.materials);
  specialtyMaterialSets[slug] = {
    title, subtitle: 'تصفح المواد المشتركة وابحث بالاسم أو الرمز والسنة الدراسية.',
    materials: [...new Map(records.filter(item => item.nature === nature).map(item => [item.id || item.code || item.title, item])).values()],
  };
}

export function courseId(material: SpecialtyMaterial): string {
  // Existing codes are stable; explicit IDs support future courses without codes.
  return (material.id || material.code || material.title).trim().toLowerCase().replace(/\s+/g, '-');
}

export function allCourses() {
  const entries = new Map<string, { id: string; material: SpecialtyMaterial; categories: { slug: string; title: string }[] }>();
  for (const [slug, set] of Object.entries(specialtyMaterialSets)) {
    for (const material of set.materials) {
      const id = courseId(material);
      const existing = entries.get(id);
      if (existing) {
        if (existing.material.title !== material.title) throw new Error(`Course ID collision: ${id}. Supply an explicit id.`);
        existing.categories.push({ slug, title: set.title });
        existing.material = { ...existing.material, resources: [...(existing.material.resources || []), ...(material.resources || [])] };
      } else entries.set(id, { id, material, categories: [{ slug, title: set.title }] });
    }
  }
  return [...entries.values()];
}

export function courseDescription(material: SpecialtyMaterial) {
  return material.description?.trim() || `مساحة دراسية لمادة «${material.title}»، تجمع المصادر المتاحة وتُنظّمها لتسهيل الفهم والمراجعة والاستعداد للتقييمات.`;
}
