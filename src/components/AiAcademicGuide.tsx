'use client';

import { useMemo, useState } from 'react';

type ToolCategory = 'study' | 'assistants' | 'research' | 'data';

type AiTool = {
  name: string;
  mark: string;
  category: ToolCategory;
  description: string;
  url: string;
  bestFor: string;
};

const categories: { id: 'all' | ToolCategory; label: string }[] = [
  { id: 'all', label: 'كل الأدوات' },
  { id: 'study', label: 'الدراسة والتلخيص' },
  { id: 'assistants', label: 'المساعدات الذكية' },
  { id: 'research', label: 'البحث العلمي' },
  { id: 'data', label: 'البيانات والتقنية' },
];

const tools: AiTool[] = [
  { name: 'NoteGPT', mark: 'NG', category: 'study', description: 'تلخيص المحاضرات والفيديوهات وملفات PDF، واستخراج الأفكار الرئيسية وتحويلها إلى مادة أسهل للمراجعة.', url: 'https://notegpt.io/', bestFor: 'التلخيص والمراجعة' },
  { name: 'NotebookLM', mark: 'NL', category: 'study', description: 'ارفع مصادر المحاضرة واسأل عنها، وأنشئ ملخصات ومواد مراجعة مبنية على الملفات التي أضفتها.', url: 'https://notebooklm.google.com/', bestFor: 'الدراسة من المصادر' },
  { name: 'Napkin AI', mark: 'NA', category: 'study', description: 'يحوّل النصوص والأفكار إلى مخططات ورسومات توضيحية قابلة للاستخدام في العروض والملخصات.', url: 'https://www.napkin.ai/', bestFor: 'المخططات البصرية' },
  { name: 'ChatGPT', mark: 'CG', category: 'assistants', description: 'شرح المفاهيم، إنشاء أسئلة تدريبية، تنظيم خطة الدراسة، والمساعدة في الكتابة والتحليل والبرمجة.', url: 'https://chatgpt.com/', bestFor: 'شرح وتنظيم الدراسة' },
  { name: 'Claude', mark: 'CL', category: 'assistants', description: 'مفيد لقراءة النصوص الطويلة، تنظيم الأفكار، تحسين الكتابة، وتحليل المستندات بصورة متسلسلة.', url: 'https://claude.ai/', bestFor: 'النصوص الطويلة' },
  { name: 'Gemini', mark: 'GE', category: 'assistants', description: 'مساعد من Google لشرح المعلومات وتحليل المستندات والصور والمساعدة في التعلم والبحث.', url: 'https://gemini.google.com/', bestFor: 'الشرح متعدد الوسائط' },
  { name: 'DeepSeek', mark: 'DS', category: 'assistants', description: 'يساعد في حل المسائل، شرح المفاهيم العلمية، الاستدلال المنطقي والمهام البرمجية.', url: 'https://chat.deepseek.com/', bestFor: 'الاستدلال وحل المسائل' },
  { name: 'Microsoft Copilot', mark: 'CO', category: 'assistants', description: 'مساعد للكتابة والبحث والإنتاجية، ويتكامل مع أدوات Microsoft وفق الخطة المتاحة للمستخدم.', url: 'https://copilot.microsoft.com/', bestFor: 'الإنتاجية والكتابة' },
  { name: 'Perplexity', mark: 'PX', category: 'assistants', description: 'محرك إجابات وبحث يعرض روابط للمصادر؛ افتح المصادر الأصلية وتحقق منها قبل الاستشهاد.', url: 'https://www.perplexity.ai/', bestFor: 'بحث أولي بالمصادر' },
  { name: 'Poe', mark: 'PO', category: 'assistants', description: 'منصة تتيح تجربة عدة نماذج ومساعدات ذكاء اصطناعي من مكان واحد ومقارنة أساليب الإجابة.', url: 'https://poe.com/', bestFor: 'تجربة نماذج متعددة' },
  { name: 'Manus', mark: 'MA', category: 'assistants', description: 'ينفّذ مهام متعددة الخطوات مثل جمع المعلومات، تنظيم النتائج، وإنشاء تقارير أو مخرجات مترابطة.', url: 'https://manus.im/', bestFor: 'المهام متعددة الخطوات' },
  { name: 'ResearchRabbit', mark: 'RR', category: 'research', description: 'اكتشاف الأبحاث المتصلة ببعضها وتتبع المؤلفين وشبكات الاستشهادات لبناء خريطة للموضوع.', url: 'https://www.researchrabbit.ai/', bestFor: 'استكشاف الدراسات' },
  { name: 'SciSpace', mark: 'SS', category: 'research', description: 'البحث عن الأوراق العلمية وفهم محتواها، مع تبسيط المنهجية والنتائج والمصطلحات الصعبة.', url: 'https://scispace.com/', bestFor: 'قراءة الأوراق العلمية' },
  { name: 'Elicit', mark: 'EL', category: 'research', description: 'البحث في الدراسات واستخراج البيانات منها ومقارنتها للمساعدة في مراجعات الأدبيات.', url: 'https://elicit.com/', bestFor: 'مراجعة الأدبيات' },
  { name: 'Julius AI', mark: 'JU', category: 'data', description: 'تحليل ملفات Excel وCSV باللغة الطبيعية، وإجراء التحليلات الإحصائية وإنشاء الرسوم البيانية.', url: 'https://julius.ai/', bestFor: 'تحليل البيانات' },
  { name: 'Hugging Face', mark: 'HF', category: 'data', description: 'استكشاف نماذج الذكاء الاصطناعي ومجموعات البيانات والتطبيقات التجريبية المفتوحة.', url: 'https://huggingface.co/', bestFor: 'النماذج ومجموعات البيانات' },
  { name: 'Kaggle', mark: 'KG', category: 'data', description: 'الوصول إلى مجموعات بيانات ودفاتر برمجية ومشاريع عملية في تحليل البيانات وتعلم الآلة.', url: 'https://www.kaggle.com/', bestFor: 'البيانات والمشاريع' },
];

const trfrSteps = [
  { letter: 'T', title: 'Task — المهمة', text: 'حدّد بوضوح ما الذي تريد من الأداة أن تفعله، وابدأ بفعل مباشر.', example: 'اشرح مراحل دورة المشي الطبيعية.' },
  { letter: 'R', title: 'Role — الدور والجمهور', text: 'حدّد الدور الذي يتقمصه المساعد، ومستوى الشخص الذي ستُقدَّم له الإجابة.', example: 'تصرّف كمحاضر علاج طبيعي واشرح لطالب سنة ثانية.' },
  { letter: 'F', title: 'Format — التنسيق', text: 'اختر شكل الإجابة وطولها: جدول، نقاط، خطوات، ملخص أو أسئلة.', example: 'استخدم جدولًا، ثم أضف خمس نقاط مهمة للامتحان.' },
  { letter: 'R', title: 'Rules — القواعد', text: 'ضع الحدود التي تحافظ على الدقة والأسلوب المطلوب وتمنع التخمين.', example: 'اكتب المصطلح الإنجليزي بجانب العربي، ولا تخترع مراجع.' },
];

const risks = [
  { title: 'الانتحال العلمي', english: 'Plagiarism', text: 'تقديم نصوص أو أفكار مولّدة أو منقولة باعتبارها عملًا شخصيًا دون تصريح أو توثيق مناسب.' },
  { title: 'المراجع الوهمية', english: 'Fabricated references', text: 'ذكر دراسات أو مؤلفين أو روابط غير حقيقية. افتح كل مرجع وتأكد من وجوده ومطابقته للادعاء.' },
  { title: 'المخالفات الأخلاقية', english: 'Ethical violations', text: 'مخالفة تعليمات المساق أو الجامعة، أو مشاركة بيانات شخصية أو معلومات مرضى مع أداة خارجية.' },
  { title: 'ضعف التفكير النقدي', english: 'Loss of critical thinking', text: 'قبول الإجابة كما هي من دون تحليلها أو مقارنتها بالمحاضرة والمصادر الأكاديمية المعتمدة.' },
  { title: 'ضعف النزاهة العلمية', english: 'Poor scientific integrity', text: 'إخفاء طريقة إعداد العمل أو استخدام نتائج غير موثوقة بما يضعف شفافية العمل الأكاديمي.' },
];

const examplePrompt = `المهمة: اشرح مراحل دورة المشي (Gait Cycle).
الدور والجمهور: تصرّف كمحاضر جامعي متخصص في العلاج الطبيعي يشرح لطالب سنة ثانية.
التنسيق: قدّم الإجابة في جدول منظم، ثم أضف ملخصًا وخمس نقاط مهمة للامتحان.
القواعد: اكتب المصطلحات الإنجليزية بجانب العربية، وميّز بين المعلومات المؤكدة وما يحتاج إلى مراجعة، ولا تخترع مراجع.`;

export function AiAcademicGuide() {
  const [activeCategory, setActiveCategory] = useState<'all' | ToolCategory>('all');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const visibleTools = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ar');
    return tools.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const searchableText = `${tool.name} ${tool.description} ${tool.bestFor}`.toLocaleLowerCase('ar');
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeCategory, query]);

  async function copyPrompt() {
    await navigator.clipboard.writeText(examplePrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <main className="ai-academic-guide">
    <section className="ai-guide-intro" id="ai-guide">
      <div className="container-wide">
        <div className="ai-guide-heading">
          <span className="eyebrow"><span className="eyebrow-line" />دليل الطالب الرقمي</span>
          <h1>استخدم الذكاء الاصطناعي بوعي، وادرس بطريقة أوضح</h1>
          <p>دليل عربي عملي يجمع أدوات الدراسة والبحث وتحليل البيانات، ويشرح كيف تكتب طلبًا دقيقًا وتحافظ على النزاهة الأكاديمية.</p>
        </div>
        <nav className="ai-jump-links" aria-label="أقسام دليل الذكاء الاصطناعي">
          <a href="#ai-tools">دليل الأدوات <span>17 أداة</span></a>
          <a href="#prompt-engineering">هندسة الأوامر <span>TRFR</span></a>
          <a href="#academic-integrity">النزاهة الأكاديمية <span>5 مخاطر</span></a>
        </nav>
      </div>
    </section>

    <section className="ai-tools-section" id="ai-tools">
      <div className="container-wide">
        <header className="ai-section-heading">
          <div><span className="ai-section-number">01</span><span className="eyebrow">اختر الأداة المناسبة للمهمة</span></div>
          <h2>دليل أدوات الذكاء الاصطناعي والبحث الأكاديمي</h2>
          <p>ابدأ من حاجتك، واقرأ وظيفة الأداة قبل استخدامها. بعض المزايا قد تحتاج إلى حساب أو اشتراك.</p>
        </header>

        <div className="ai-tool-controls">
          <label className="ai-tool-search">
            <span className="sr-only">ابحث عن أداة أو استخدام</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m16.2 16.2 4 4" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن أداة أو استخدام..." />
          </label>
          <div className="ai-category-filters" role="group" aria-label="تصفية الأدوات">
            {categories.map((category) => <button key={category.id} type="button" className={activeCategory === category.id ? 'active' : ''} aria-pressed={activeCategory === category.id} onClick={() => setActiveCategory(category.id)}>{category.label}</button>)}
          </div>
        </div>

        {visibleTools.length > 0 ? <div className="ai-tool-grid">
          {visibleTools.map((tool, index) => <article className="ai-tool-card" key={tool.name} style={{ '--tool-order': index } as React.CSSProperties}>
            <div className="ai-tool-card-top">
              <span className="ai-tool-mark" aria-hidden="true">{tool.mark}</span>
              <span className="ai-tool-use">{tool.bestFor}</span>
            </div>
            <h3 dir="ltr">{tool.name}</h3>
            <p>{tool.description}</p>
            <a href={tool.url} target="_blank" rel="noreferrer" aria-label={`زيارة موقع ${tool.name}`}>
              زيارة الأداة
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7" /></svg>
            </a>
          </article>)}
        </div> : <div className="ai-tools-empty"><strong>لم نجد أداة مطابقة</strong><p>جرّب كلمة أقصر أو اختر فئة أخرى.</p></div>}

        <p className="ai-tools-note">اختر الأداة بحسب المهمة، ثم تحقّق من كل معلومة ومرجع قبل استخدام النتيجة في واجب أو بحث أكاديمي.</p>
      </div>
    </section>

    <section className="ai-prompt-section" id="prompt-engineering">
      <div className="container-wide">
        <header className="ai-section-heading ai-section-heading-light">
          <div><span className="ai-section-number">02</span><span className="eyebrow">هندسة الأوامر</span></div>
          <h2>اكتب طلبك بتقنية TRFR</h2>
          <p>الأمر هو السؤال أو التعليمات التي تعطيها للأداة. كلما كان واضحًا ومنظمًا، أصبحت النتيجة أقرب إلى ما تحتاجه.</p>
        </header>
        <div className="trfr-grid">
          {trfrSteps.map((step, index) => <article className="trfr-card" key={`${step.letter}-${index}`}>
            <span className="trfr-letter">{step.letter}</span>
            <div><span className="trfr-index">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p><blockquote>{step.example}</blockquote></div>
          </article>)}
        </div>
        <div className="prompt-example">
          <div className="prompt-example-copy">
            <span className="eyebrow"><span className="eyebrow-line" />مثال جاهز لطلبة التأهيل</span>
            <h3>من فكرة عامة إلى طلب أكاديمي واضح</h3>
            <p>يمكنك نسخ المثال وتعديل المادة، السنة الدراسية، وطريقة العرض بما يناسبك.</p>
            <button type="button" onClick={copyPrompt} className={copied ? 'copied' : ''}>
              {copied ? 'تم نسخ الأمر' : 'نسخ الأمر'}
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
            </button>
          </div>
          <pre>{examplePrompt}</pre>
        </div>
      </div>
    </section>

    <section className="academic-integrity-section" id="academic-integrity">
      <div className="container-wide">
        <header className="ai-section-heading">
          <div><span className="ai-section-number">03</span><span className="eyebrow">استخدام مسؤول</span></div>
          <h2>النزاهة الأكاديمية قبل سرعة الإنجاز</h2>
          <p>استخدام الذكاء الاصطناعي لا يُعد انتحالًا تلقائيًا، لكنه يصبح مخالفة عندما تُخفى المصادر أو يُقدَّم عمل مولّد باعتباره عملًا شخصيًا خلافًا للتعليمات.</p>
        </header>

        <div className="integrity-layout">
          <div className="integrity-principle">
            <span>قاعدة مختصرة</span>
            <h3>استخدم الأداة لتفهم وتفكر، ثم تحقّق واكتب بأسلوبك.</h3>
            <ul>
              <li>راجع المعلومة مع المحاضرة والمصدر الأكاديمي المعتمد.</li>
              <li>افتح كل مرجع وتأكد أنه حقيقي ويدعم الفكرة المذكورة.</li>
              <li>اتبع تعليمات المدرّس والجامعة واذكر استخدام الأداة عند طلب ذلك.</li>
              <li>لا ترفع بيانات مرضى أو معلومات شخصية أو ملفات حساسة.</li>
            </ul>
          </div>
          <div className="risk-grid">
            {risks.map((risk, index) => <article className="risk-card" key={risk.title}>
              <span>0{index + 1}</span><div><small dir="ltr">{risk.english}</small><h3>{risk.title}</h3><p>{risk.text}</p></div>
            </article>)}
          </div>
        </div>

        <aside className="medical-ai-note">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3.5 7v5c0 4.8 3.4 8 8.5 9 5.1-1 8.5-4.2 8.5-9V7L12 3Z" /><path d="M9 12h6M12 9v6" /></svg>
          <div><strong>تنبيه لطلبة التخصصات الصحية</strong><p>المحتوى المولّد لا يُستخدم للتشخيص أو اتخاذ قرار علاجي. ارجع إلى المراجع الطبية المعتمدة وإشراف عضو هيئة التدريس أو المختص.</p></div>
        </aside>
      </div>
    </section>
  </main>;
}
