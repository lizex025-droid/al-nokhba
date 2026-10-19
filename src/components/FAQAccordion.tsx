'use client';

import { useState } from 'react';
import { faqs } from '@/lib/content';
import { PlusIcon } from './Icons';

export function FAQAccordion() { const [open, setOpen] = useState<number | null>(0); return <div className="faq-list">{faqs.map((item, i) => <div className={`faq-item ${open === i ? 'open' : ''}`} key={item.q}><button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}><span>{item.q}</span><PlusIcon className="faq-plus" /></button><div className="faq-answer"><p>{item.a}</p></div></div>)}</div>; }
