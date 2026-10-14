'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../language';
import { tr } from '../i18n';
import Board from '../board/Board';
import { MIDDLE_GRADES, MIDDLE_KINDS, MIDDLE_STRANDS, MIDDLE_UNITS, middleCategory, middleUnitById, middleUnitsOfGrade } from './middleCurriculum';

const ACCEPT = 'image/*,application/pdf,.zip,.docx,.pptx,.xlsx,.hwp';

// `grade` omitted -> /science/middle landing (G7–G9 cards). Otherwise the grade's unit browser with
// textbook / workbook upload boards. No study notes yet — this is the structural shell only.
export default function MiddleScienceArchive({ grade }) {
  const { language } = useLanguage();
  const ko = language === 'ko';
  const name = (o) => (ko ? o.ko : o.en);
  const units = grade ? middleUnitsOfGrade(grade) : [];
  const [unitId, setUnitId] = useState(null);
  const [kind, setKind] = useState('tb');
  const [counts, setCounts] = useState({});

  // Deep link: /science/middle/g8?unit=g8-periodic-table&kind=wb
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
    try { document.getElementById('middle-board')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
  };

  const movableOptions = useMemo(() => MIDDLE_UNITS.flatMap((u) => MIDDLE_KINDS.map((k) => ({
    value: middleCategory(u.id, k.id),
    label: `G${u.grade} · ${name(u)} · ${ko ? k.ko.split(' ')[0] : k.en.split(' ')[0]}`,
  }))), [ko]); // eslint-disable-line react-hooks/exhaustive-deps

  const unit = unitId ? middleUnitById(unitId) : null;
  const uploads = (id, k) => counts[middleCategory(id, k)] || 0;

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
      <a href="/">{tr(language, 'home')}</a> / <a href="/science">{ko ? '과학' : 'Science'}</a> / {grade ? <><a href="/science/middle">{ko ? '중학교' : 'Middle School'}</a> / G{grade}</> : (ko ? '중학교' : 'Middle School')}
    </p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>
      🔬 {grade ? `${ko ? '국제학교 중학교 과학' : 'International Middle School Science'} · Grade ${grade}` : (ko ? '국제학교 중학교 과학 (G7–G9)' : 'International Middle School Science (G7–G9)')}
    </h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 20px', lineHeight: 1.7 }}>
      {ko
        ? 'Cambridge Lower Secondary(Stage 7–9) 구조를 기준으로 생물·화학·물리·지구우주·탐구 영역별 교과서와 워크북 자료를 정리합니다. 학습 내용과 연습 학습지는 순차적으로 추가됩니다.'
        : 'Textbook and workbook materials organised by Biology, Chemistry, Physics, Earth & Space and enquiry skills, following the Cambridge Lower Secondary (Stage 7–9) structure. Study notes and worksheets will be added step by step.'}
    </p>

    <nav className="no-print" aria-label="middle school grades" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '0 0 12px' }}>
      <a href="/science" className="button button-secondary">{ko ? '← 초등 G1–G6' : '← Primary G1–G6'}</a>
      {MIDDLE_GRADES.map((g) => {
        const active = g === Number(grade);
        return <a key={g} href={`/science/middle/g${g}`} className={active ? 'button' : 'button button-secondary'} aria-current={active ? 'page' : undefined}>G{g}</a>;
      })}
    </nav>
    <p className="no-print" style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: '0 0 26px' }}>
      {ko ? 'G7 · G8 · G9 = Cambridge Lower Secondary Stage 7 · 8 · 9 (만 11–14세, IB MYP 1–3 / 미국 중학교 과정에 해당).' : 'G7 · G8 · G9 = Cambridge Lower Secondary Stage 7 · 8 · 9 (ages 11–14; comparable to IB MYP 1–3 and US middle school).'}
    </p>

    {!grade ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
      {MIDDLE_GRADES.map((g) => {
        const list = middleUnitsOfGrade(g).filter((u) => u.strand !== 'misc');
        return <a key={g} href={`/science/middle/g${g}`} style={{ display: 'block', padding: 18, border: '1px solid var(--paper-line)', borderRadius: 12, textDecoration: 'none', color: 'var(--ink)' }}>
          <div className="font-display" style={{ fontSize: 24 }}>Grade {g}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: '2px 0 10px' }}>Stage {g} · {ko ? `${list.length}개 단원` : `${list.length} units`}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {MIDDLE_STRANDS.filter((s) => s.id !== 'misc').map((s) => {
              const n = list.filter((u) => u.strand === s.id).length;
              return n ? <span key={s.id} style={{ fontSize: 11.5, padding: '2px 8px', border: '1px solid var(--paper-line)', borderRadius: 999 }}>{s.icon} {name(s)} {n}</span> : null;
            })}
          </div>
        </a>;
      })}
    </div> : <>
      {MIDDLE_STRANDS.map((s) => {
        const list = units.filter((u) => u.strand === s.id);
        if (!list.length) return null;
        return <section key={s.id} style={{ margin: '0 0 24px' }}>
          <h2 className="font-display" style={{ fontSize: 16, margin: '0 0 10px' }}>{s.icon} {name(s)}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10 }}>
            {list.map((u) => {
              const active = u.id === unitId;
              return <button key={u.id} type="button" onClick={() => select(u.id)} aria-pressed={active}
                style={{ textAlign: 'left', font: 'inherit', cursor: 'pointer', padding: 12, borderRadius: 10, color: 'var(--ink)', background: 'var(--paper, transparent)', border: active ? '2px solid var(--chalk-green)' : '1px solid var(--paper-line)' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{name(u)}</div>
                {ko ? null : <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{u.ko}</div>}
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', margin: '4px 0', lineHeight: 1.5 }}>{u.topicsKo}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span title={ko ? '업로드된 교과서 자료' : 'Uploaded textbook files'}>📘 {uploads(u.id, 'tb')}</span>
                  <span title={ko ? '업로드된 워크북 자료' : 'Uploaded workbook files'}>📝 {uploads(u.id, 'wb')}</span>
                  {u.strand === 'misc' ? null : <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-soft)', border: '1px dashed var(--paper-line)', borderRadius: 999, padding: '1px 8px' }}>{ko ? '학습 내용 준비 중' : 'Notes coming soon'}</span>}
                </div>
              </button>;
            })}
          </div>
        </section>;
      })}

      {unit ? <section id="middle-board" style={{ marginTop: 28, paddingTop: 20, borderTop: '2px solid var(--ink)' }}>
        <h2 className="font-display" style={{ fontSize: 20, margin: '0 0 12px' }}>G{unit.grade} · {name(unit)}</h2>
        <div role="tablist" className="no-print" style={{ display: 'flex', gap: 8, margin: '0 0 16px', flexWrap: 'wrap' }}>
          {MIDDLE_KINDS.map((k) => <button key={k.id} type="button" role="tab" aria-selected={k.id === kind} onClick={() => select(unit.id, k.id)}
            className={k.id === kind ? 'button' : 'button button-secondary'}>{k.icon} {name(k)} ({uploads(unit.id, k.id)})</button>)}
        </div>
        <Board
          key={middleCategory(unit.id, kind)}
          category={middleCategory(unit.id, kind)}
          adminOnlyPost
          allowReply={false}
          staticPosts={[]}
          attachmentAccept={ACCEPT}
          attachmentLabelKey="formAttachment"
          composerTitleKey="boardCodingComposerTitle"
          movableOptions={movableOptions}
        />
      </section> : <p style={{ color: 'var(--ink-soft)' }}>{ko ? '단원을 선택하면 교과서·워크북 자료실이 표시됩니다.' : 'Select a unit to open its textbook and workbook shelf.'}</p>}
    </>}
  </>;
}
