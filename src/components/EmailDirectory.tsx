'use client';

import { useState } from 'react';

type Professor = { name: string; email: string; department: string };

const departmentOrder = [
  'العلاج الطبيعي',
  'العلاج الوظيفي',
  'الأطراف الاصطناعية والأجهزة المساعدة',
  'السمع والنطق',
];

const professors: Professor[] = [
  { name: 'عالية الغويري', email: 'alia.alghwiri@gmail.com', department: 'العلاج الطبيعي' },
  { name: 'دانية قطيشات', email: 'd.qutishat@ju.edu.jo', department: 'العلاج الطبيعي' },
  { name: 'هناء خريس', email: 'h_khraise@ju.edu.jo', department: 'العلاج الطبيعي' },
  { name: 'إبراهيم الطوباسي', email: 'I.Tubasi@ju.edu.jo', department: 'العلاج الطبيعي' },
  { name: 'جنفر مهيدات', email: 'j.muhaidat@ju.edu.jo', department: 'العلاج الطبيعي' },
  { name: 'لارا الخليفات', email: 'l.khlaifat@ju.edu.jo', department: 'العلاج الطبيعي' },
  { name: 'مها تيسير', email: 'maha.tayseer@gmail.com', department: 'العلاج الطبيعي' },
  { name: 'ميس الدغمي', email: 'm.aldughmi@ju.edu.jo', department: 'العلاج الطبيعي' },
  { name: 'ميسون نمر صالح', email: 'mayson.saleh@ju.edu.jo', department: 'العلاج الطبيعي' },
  { name: 'محمد درابسه', email: 'm_darabseh@ju.edu.jo', department: 'العلاج الطبيعي' },
  { name: 'نهاد المصري', email: 'n.almasri@ju.edu.jo', department: 'العلاج الطبيعي' },
  { name: 'سمية أبو جابر', email: 's.abujaber@ju.edu.jo', department: 'العلاج الطبيعي' },

  { name: 'دعاء الواوي', email: 'd.alwawi@ju.edu.jo', department: 'العلاج الوظيفي' },
  { name: 'حنان ماضي', email: 'hanan.madi@ju.edu.jo', department: 'العلاج الوظيفي' },
  { name: 'مجد جرار', email: 'm.jarrar@ju.edu.jo', department: 'العلاج الوظيفي' },
  { name: 'نداء الوريكات', email: 'n_alworikat@ju.edu.jo', department: 'العلاج الوظيفي' },
  { name: 'روان الهرش', email: 'r.alheresh@ju.edu.jo', department: 'العلاج الوظيفي' },
  { name: 'سلمى عبد الجابر', email: 'S.Abduljaber@ju.edu.jo', department: 'العلاج الوظيفي' },
  { name: 'سنا أبو الدهب', email: 's.abudahab@ju.edu.jo', department: 'العلاج الوظيفي' },
  { name: 'سمية ملكاوي', email: 's.malkawi@ju.edu.jo', department: 'العلاج الوظيفي' },
  { name: 'يسر قطيشات', email: 'y.qutishat@ju.edu.jo', department: 'العلاج الوظيفي' },

  { name: 'بشار القاروط', email: 'b.alqaroot@ju.edu.jo', department: 'الأطراف الاصطناعية والأجهزة المساعدة' },
  { name: 'حذيفة عطاالله', email: 'h.atallah@ju.edu.jo', department: 'الأطراف الاصطناعية والأجهزة المساعدة' },
  { name: 'محمد صبح', email: 'm.sobuh@ju.edu.jo', department: 'الأطراف الاصطناعية والأجهزة المساعدة' },
  { name: 'أمنة الشوابكة', email: 'A.alshawabka@ju.edu.jo', department: 'الأطراف الاصطناعية والأجهزة المساعدة' },
  { name: 'هوشانك رانجبار', email: 'housh_ranj@yahoo.com', department: 'الأطراف الاصطناعية والأجهزة المساعدة' },
  { name: 'محمود الفطافطة', email: 'm.alfatafta@ju.edu.jo', department: 'الأطراف الاصطناعية والأجهزة المساعدة' },
  { name: 'ريم مصاروة', email: 'reemmassarweh@hotmail.com', department: 'الأطراف الاصطناعية والأجهزة المساعدة' },
  { name: 'وائل قعدان', email: 'waeldavid234@hotmail.com', department: 'الأطراف الاصطناعية والأجهزة المساعدة' },

  { name: 'إنعام الخرابشة', email: 'e.kharabsheh@ju.edu.jo', department: 'السمع والنطق' },
  { name: 'فاتن عبيدات', email: 'fso1e13@soton.ac.uk', department: 'السمع والنطق' },
  { name: 'هنادي بني هاني', email: 'Hanady.banihani@mail.mcgill.ca', department: 'السمع والنطق' },
  { name: 'رنا الخمرة', email: 'ranaalkhamra@gmail.com', department: 'السمع والنطق' },
  { name: 'سارة الحنبلي', email: 's.alhanbali@ju.edu.jo', department: 'السمع والنطق' },
  { name: 'سهى جردات', email: 's.garadat@ju.edu.jo', department: 'السمع والنطق' },
  { name: 'ياسر الناطور', email: 'natour@fulbrightmail.org', department: 'السمع والنطق' },
  { name: 'دعاء قطيشات', email: 'd_qutishat@ju.edu.jo', department: 'السمع والنطق' },
  { name: 'هلا العمري', email: 'halaomari@gmail.com', department: 'السمع والنطق' },
  { name: 'هناء محمود', email: 'hhnawaf@yahoo.com', department: 'السمع والنطق' },
  { name: 'محمد دمهورية', email: 'm.damhoureyeh@ju.edu.jo', department: 'السمع والنطق' },
];

export function EmailDirectory() {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLocaleLowerCase('ar');
  const filtered = professors.filter((professor) =>
    [professor.name, professor.email, professor.department].some((value) => value.toLocaleLowerCase('ar').includes(normalizedQuery)),
  );

  return <div className="directory" data-reveal>
    <div className="directory-toolbar">
      <div><span className="eyebrow">دليل التواصل</span><h2>قائمة أعضاء الهيئة التدريسية</h2><p>{professors.length} عضوًا من كلية علوم التأهيل</p></div>
      <label><span className="sr-only">ابحث عن دكتور أو قسم أو بريد إلكتروني</span><input type="search" placeholder="ابحث بالاسم أو القسم أو البريد..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    </div>
    <div className="table-scroll"><table><thead><tr><th>اسم الدكتور</th><th>الكلية</th><th>القسم</th><th>البريد الإلكتروني</th></tr></thead><tbody>
      {departmentOrder.map((department) => {
        const departmentProfessors = filtered.filter((professor) => professor.department === department);
        if (departmentProfessors.length === 0) return null;
        return <DepartmentRows key={department} department={department} professors={departmentProfessors} />;
      })}
    </tbody></table>{filtered.length === 0 && <p className="no-results">لا توجد نتائج مطابقة لبحثك.</p>}</div>
  </div>;
}

function DepartmentRows({ department, professors: departmentProfessors }: { department: string; professors: Professor[] }) {
  return <>
    <tr className="directory-group-row"><th colSpan={4}>{department} <span>{departmentProfessors.length}</span></th></tr>
    {departmentProfessors.map((professor) => <tr key={`${professor.name}-${professor.email}`}><td className="professor-name">{professor.name}</td><td>علوم التأهيل</td><td>{professor.department}</td><td><a className="professor-email" href={`mailto:${professor.email}`} dir="ltr">{professor.email}</a></td></tr>)}
  </>;
}
