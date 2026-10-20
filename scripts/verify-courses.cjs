const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'nokhba-courses-'));
try {
  execFileSync('node_modules/.bin/tsc', ['--ignoreConfig', '--outDir', temp, '--module', 'commonjs', '--target', 'es2020', '--skipLibCheck', 'src/lib/specialtyMaterials.ts', 'src/lib/courseResources.ts']);
  const { allCourses, specialtyMaterialSets, courseId, courseDescription } = require(path.join(temp, 'specialtyMaterials.js'));
  const { availableResources, classifyResource, safeResourceUrl } = require(path.join(temp, 'courseResources.js'));
  const courses = allCourses();
  assert.equal(new Set(courses.map(c => c.id)).size, courses.length);
  let occurrences = 0;
  for (const [slug, set] of Object.entries(specialtyMaterialSets)) {
    const directory = fs.readFileSync(`out/${slug}.html`, 'utf8');
    for (const material of set.materials) {
      occurrences++;
      const course = courses.find(c => c.id === courseId(material));
      assert.ok(course, `${slug}: ${material.title}`);
      for (const field of ['title', 'code', 'year', 'hours', 'nature', 'description']) assert.equal(course.material[field], material[field]);
      const html = fs.readFileSync(`out/courses/${course.id}.html`, 'utf8');
      assert.ok(html.includes(material.title));
      assert.ok(directory.includes(`/courses/${encodeURIComponent(course.id)}`));
      for (const tab of ['summaries', 'slides', 'tests', 'lectures']) assert.ok(html.includes(`id="tab-${tab}"`));
      assert.ok(html.includes('لا توجد ملفات متاحة حاليًا في هذا القسم.'));
      assert.equal(availableResources(course.material.resources).length, 0);
    }
  }
  for (const url of ['javascript:alert(1)', 'data:text/html,bad', '//evil.test/file', '/\\evil.test/file', 'https://user:pass@test.com', 'http://test.com/file', '/bad\npath']) assert.equal(safeResourceUrl(url), undefined, url);
  assert.equal(safeResourceUrl('/files/notes.pdf'), '/files/notes.pdf');
  assert.ok(safeResourceUrl('https://example.org/notes.pdf'));
  const fixture = (title, url='/notes.pdf', extra={}) => ({id:title, title, url, ...extra});
  assert.deepEqual(classifyResource(fixture('ملخص منتصف الفصل')), {tab:'summaries',section:'midterm'});
  assert.deepEqual(classifyResource(fixture('عرض تقديمي نهائي', '/file.pptx')), {tab:'slides',section:'final'});
  assert.equal(classifyResource(fixture('أسئلة تدريبية')).tab, 'tests');
  assert.equal(classifyResource(fixture('محاضرة', 'https://youtube.com/watch?v=example')).tab, 'lectures');
  assert.equal(classifyResource(fixture('اختبار', '/quiz', {interactive:true})).tab, 'tests');
  assert.equal(classifyResource(fixture('عرض', '/file.pdf', {tab:'slides'})).tab, 'slides');
  assert.equal(availableResources([fixture('one'),fixture('duplicate'),fixture('bad','javascript:alert(1)')]).length, 1);
  specialtyMaterialSets['future-test'] = {title:'قسم جديد',subtitle:'',materials:[{id:'future-course',title:'مادة جديدة', resources:[fixture('file')]}]};
  const future = allCourses().find(c => c.id === 'future-course');
  assert.ok(future);
  assert.ok(courseDescription(future.material).includes('مادة جديدة'));
  assert.equal(future.material.code, undefined);
  assert.equal(availableResources(future.material.resources).length, 1);
  delete specialtyMaterialSets['future-test'];
  console.log(`Verified ${courses.length} unique courses, ${occurrences} catalog entries, all 6 categories, 4 tabs, metadata preservation, empty states, future courses, classification, deduplication and unsafe URL rejection.`);
} finally { fs.rmSync(temp, {recursive:true, force:true}); }
