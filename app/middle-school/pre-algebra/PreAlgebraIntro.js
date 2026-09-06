'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../../language';
import { tr } from '../../i18n';
import { preAlgebraCopy, preAlgebraProfileLabel } from './localization';
import { findPreAlgebraProfile } from './catalog';

// Mirrors the generic-title/tag-soup complaint: this used to always show the same fixed
// "Pre-Algebra · Algebra 1-2 · Precalculus" title and the same 7 tags regardless of which
// profile the user actually navigated to (from a curriculum-explorer deep link or otherwise),
// which read as either a mislabeled subject or a meaningless hashtag list. Now it reflects the
// one profile actually selected via the ?profile= URL param, matching PreAlgebraGenerator.js.
export default function PreAlgebraIntro() {
  const { language } = useLanguage();
  const copy = preAlgebraCopy(language);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setProfileId(findPreAlgebraProfile(params.get('profile')).id);
  }, []);

  const profile = findPreAlgebraProfile(profileId);
  const profileLabel = preAlgebraProfileLabel(profile, language);
  const profileDescription = language === 'ko' ? profile.description : profile.descriptionEn;

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
      <a href="/">{tr(language, 'home')}</a> / <a href="/curriculum">{copy.breadcrumb}</a> / {profileLabel}
    </p>
    <h1 className="font-display" style={{ fontSize: 28, margin: '0 0 8px' }}>
      {language === 'ko' ? `${profileLabel} 문제 생성기` : `${profileLabel} Worksheet Generator`}
    </h1>
    {profileDescription ? (
      <p className="no-print" style={{ fontSize: 14, color: 'var(--ink-soft)', margin: '0 0 24px' }}>{profileDescription}</p>
    ) : null}
  </>;
}
