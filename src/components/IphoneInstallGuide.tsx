'use client';

import { useEffect, useRef, useState } from 'react';

export function IphoneInstallGuide({ imageUrl, device = 'الآيفون', actionLabel = 'عرض طريقة الإضافة' }: { imageUrl: string; device?: string; actionLabel?: string }) {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onEscape);
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    return () => {
      window.removeEventListener('keydown', onEscape);
      document.body.style.overflow = priorOverflow;
      trigger.current?.focus();
    };
  }, [open]);

  return <>
    <button ref={trigger} type="button" className="install-choice-action" onClick={() => setOpen(true)}>
      {actionLabel} <span aria-hidden="true">←</span>
    </button>
    {open && (
      <div className="iphone-guide-backdrop" onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}>
        <div className="iphone-guide-frame" role="dialog" aria-modal="true" aria-label={`طريقة تثبيت rehab ju على ${device}`}>
          <div className="iphone-guide-toolbar">
            <strong>طريقة تثبيت rehab ju على {device}</strong>
            <button ref={closeButton} type="button" onClick={() => setOpen(false)} aria-label="إغلاق الصورة">×</button>
          </div>
          <div className="iphone-guide-scroll">
            <img src={imageUrl} alt={`دليل تثبيت rehab ju على ${device}`} decoding="async" />
          </div>
        </div>
      </div>
    )}
  </>;
}
