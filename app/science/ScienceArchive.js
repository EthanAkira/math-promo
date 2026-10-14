'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../language';
import { tr } from '../i18n';
import Board from '../board/Board';
import { contentOf } from './content';
import { SCIENCE_GRADES, SCIENCE_KINDS, SCIENCE_STRANDS, SCIENCE_UNITS, scienceCategory, unitById, unitsOfGrade } from './curriculum';

const ACCEPT = 'image/*,application/pdf,.zip,.docx,.pptx,.xlsx,.hwp';

// `grade` omitted → /science landing (grade cards). Otherwise the grade's unit browser + upload boards.
export default function ScienceArchive({ grade }) {
  const { language } = useLanguage();
  const ko = language === 'ko';
  const name = (o) => (ko ? o.ko : o.en);
  const units = grade ? unitsOfGrade(grade) : [];
  const [unitId, setUnitId] = useState(null);
  const [kind, setKind] = useState('tb');
  const [counts, setCounts] = useState({});

  // Deep link: /science/g3?unit=g3-forces-magnets&kind=wb
  useEffect(() => {
    if (!grade) return;
    const q = new URLSearchParams(window.location.search);
    const u = q.get('unit');
    if (u && units.some((x) => x.id === u)) setUnitId(u);
    if (q.get('kind') === 'wb') setKind('wb');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade]);

  useEffect(() => {
    if (!grade) return undefined;
    let cancelled = false;
    fetch(`/api/board/posts?prefix=science-g${grade}-`)
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((d) => {
        if (cancelled) return;
        const next = {};
        (d.posts || []).forEach((p) => { next[p.category] = (next[p.category] || 0) + 1; });
        setCounts(next);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [grade, unitId, kind]);

  const select = (id, k = kind) => {
    setUnitId(id);
    setKind(k);
    try { window.history.replaceState(null, '', `?unit=${id}&kind=${k}`); } catch {}
  };

  const movableOptions = useMemo(() => SCIENCE_UNITS.flatMap((u) => SCIENCE_KINDS.map((k) => ({
    value: scienceCategory(u.id, k.id),
    label: `G${u.grade} · ${name(u)} · ${ko ? k.ko.split(' ')[0] : k.en.split(' ')[0]}`,
  }))), [ko]); // eslint-disable-line react-hooks/exhaustive-deps

  const unit = unitId ? unitById(unitId) : null;
  const unitTotal = (id) => (counts[scienceCategory(id, 'tb')] || 0) + (counts[scienceCategory(id, 'wb')] || 0);

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
      <a href="/">{tr(language, 'home')}</a> / {grade ? <><a href="/science">{ko ? '과학' : 'Science'}</a> / G{grade}</> : (ko ? '과학' : 'Science')}
    </p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>🔬 {grade ? `${ko ? '국제학교 과학' : 'International School Science'} · Grade ${grade}` : (ko ? '국제학교 과학 (G1–G6)' : 'International School Science (G1–G6)')}</h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 20px', lineHeight: 1.7 }}>
      {ko ? 'NGSS·Cambridge·IB PYP 공통 범위를 기준으로 단원별 교과서와 워크북(학습지)을 정리합니다.' : 'Textbook and workbook materials organised by unit, following the common scope of NGSS, Cambridge and IB PYP.'}
    </p>

    <nav className="no-print" aria-label="science grades" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '0 0 28px' }}>
      {SCIENCE_GRADES.map((g) => {
        const active = g === Number(grade);
        return <a key={g} href={`/science/g${g}`} className={active ? 'button' : 'button button-secondary'} aria-current={active ? 'page' : undefined}>G{g}</a>;
      })}
    </nav>

    {!grade ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
      {SCIENCE_GRADES.map((g) => {
        const list = unitsOfGrade(g).filter((u) => u.strand !== 'misc');
        return <a key={g} href={`/science/g${g}`} style={{ display: 'block', padding: 16, border: '1px solid var(--paper-line)', borderRadius: 10, textDecoration: 'none', color: 'var(--ink)' }}>
          <div className="font-display" style={{ fontSize: 22 }}>Grade {g}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '4px 0 8px' }}>{ko ? `${list.length}개 단원` : `${list.length} units`}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{list.slice(0, 3).map(name).join(' · ')}…</div>
        </a>;
      })}
    </div> : <>
      {SCIENCE_STRANDS.map((s) => {
        const list = units.filter((u) => u.strand === s.id);
        if (!list.length) return null;
        return <section key={s.id} style={{ margin: '0 0 22px' }}>
          <h2 className="font-display" style={{ fontSize: 16, margin: '0 0 10px' }}>{s.icon} {name(s)}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10 }}>
            {list.map((u) => {
              const active = u.id === unitId;
              const total = unitTotal(u.id);
              return <div key={u.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><button type="button" onClick={() => select(u.id)} aria-pressed={active}
                style={{ textAlign: 'left', font: 'inherit', cursor: 'pointer', padding: 12, borderRadius: 10, color: 'var(--ink)', background: 'var(--paper, transparent)', border: active ? '2px solid var(--chalk-green)' : '1px solid var(--paper-line)' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{name(u)}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', margin: '4px 0', lineHeight: 1.5 }}>{u.topicsKo}</div>
                <div style={{ fontSize: 12, color: total ? 'var(--chalk-green)' : 'var(--ink-soft)' }}>
                  📘 {counts[scienceCategory(u.id, 'tb')] || 0} · 📝 {counts[scienceCategory(u.id, 'wb')] || 0}
                </div>
              </button>{contentOf(u.id) ? <a className="button button-secondary" style={{ textAlign: 'center', fontSize: 13 }} href={`/science/study?unit=${u.id}`}>📖 {ko ? '학습 내용 · 연습 학습지' : 'Notes & Worksheets'}</a> : null}</div>;
            })}
          </div>
        </section>;
      })}

      {unit ? <section id="science-board" style={{ marginTop: 28, paddingTop: 20, borderTop: '2px solid var(--ink)' }}>
        <h2 className="font-display" style={{ fontSize: 20, margin: '0 0 12px' }}>G{unit.grade} · {name(unit)}</h2>
        <div role="tablist" className="no-print" style={{ display: 'flex', gap: 8, margin: '0 0 16px', flexWrap: 'wrap' }}>
          {SCIENCE_KINDS.map((k) => <button key={k.id} type="button" role="tab" aria-selected={k.id === kind} onClick={() => select(unit.id, k.id)}
            className={k.id === kind ? 'button' : 'button button-secondary'}>{k.icon} {name(k)} ({counts[scienceCategory(unit.id, k.id)] || 0})</button>)}
        </div>
        <Board
          key={scienceCategory(unit.id, kind)}
          category={scienceCategory(unit.id, kind)}
          adminOnlyPost
          allowReply={false}
          staticPosts={[]}
          attachmentAccept={ACCEPT}
          attachmentLabelKey="formAttachment"
          composerTitleKey="boardCodingComposerTitle"
          movableOptions={movableOptions}
        />
      </section> : <p style={{ color: 'var(--ink-soft)' }}>{ko ? '단원을 선택하면 교과서·워크북 자료가 표시됩니다.' : 'Select a unit to see its textbook and workbook materials.'}</p>}
    </>}
  </>;
}
