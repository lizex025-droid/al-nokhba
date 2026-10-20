export type ResourceTab = 'summaries' | 'slides' | 'tests' | 'lectures';
export type ResourceSection = 'midterm' | 'final' | 'extra';
export type CourseResource = {
  id: string;
  title: string;
  url: string;
  tab?: ResourceTab;
  section?: ResourceSection;
  type?: string;
  downloadUrl?: string;
  interactive?: boolean;
};

/** Only root-relative URLs and HTTPS links; never execute supplied markup or URLs. */
export function safeResourceUrl(value?: string): string | undefined {
  if (!value || value !== value.trim() || /[\\\u0000-\u0020\u007f]/.test(value)) return;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password) return url.href;
  } catch { /* Invalid URLs are not displayed. */ }
}

export function classifyResource(resource: CourseResource) {
  let pathname = '';
  try { pathname = decodeURIComponent(new URL(resource.url, 'https://local.invalid').pathname); } catch { /* Metadata still supports classification. */ }
  const text = `${resource.title} ${resource.type || ''} ${pathname}`.toLowerCase();
  const tab: ResourceTab = resource.tab || (
    resource.interactive ? 'tests' :
    /ملخص|summary|summaries/.test(`${resource.title} ${resource.type || ''}`.toLowerCase()) ? 'summaries' :
    /اختبار|امتحان|أسئلة|اسئلة|\b(?:questions?|quizzes|quiz|exams?|tests?)\b/.test(text) ? 'tests' :
    (/video|\.mp4|\.webm|تسجيل|فيديو|playlist/.test(text) || /^https:\/\/(?:www\.)?(?:youtube\.com|youtu\.be|vimeo\.com)\//i.test(resource.url)) ? 'lectures' :
    /slide|presentation|powerpoint|\.pptx?|سلايد|شرائح|عرض تقديمي/.test(text) ? 'slides' : 'summaries');
  const section: ResourceSection = resource.section || (/midterm|mid-term|منتصف|ميد/.test(text) ? 'midterm' : /final|نهاية|نهائي|فاينل/.test(text) ? 'final' : 'extra');
  return { tab, section };
}

export function availableResources(resources: CourseResource[] = []) {
  const seen = new Set<string>();
  return resources.flatMap(resource => {
    const url = safeResourceUrl(resource.url);
    if (!url || seen.has(url)) return [];
    seen.add(url);
    return [{ ...resource, url, downloadUrl: safeResourceUrl(resource.downloadUrl), ...classifyResource(resource) }];
  });
}
