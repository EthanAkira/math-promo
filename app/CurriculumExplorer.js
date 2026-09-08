'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from './language';
import {
  CURRICULUM_COPY,
  KOREAN_GRADE_STAGES,
  KOREAN_2022_SUBJECT_STAGES,
  INTERNATIONAL_COURSE_STAGES,
  JAPAN_STAGES,
  TAIWAN_STAGES,
  HONGKONG_STAGES,
  SINGAPORE_STAGES,
  MALAYSIA_STAGES,
  VIETNAM_STAGES,
  INDIA_STAGES,
  DOMAIN_STAGES,
} from './curriculumCatalog';

function availabilityForTopics(topics) {
  if (topics.every((topic) => !topic.ready || topic.availability === 'planned')) return 'planned';
  if (topics.some((topic) => topic.availability === 'partial' || !topic.ready || topic.availability === 'planned')) return 'partial';
  return 'ready';
}

function availabilitySummary(topics, copy) {
  const status = availabilityForTopics(topics);
  if (status === 'planned') return copy.badges.planned;
  const availableCount = topics.filter((topic) => topic.ready && topic.availability !== 'planned').length;
  if (status === 'partial') return `${availableCount}/${topics.length} · ${copy.badges.partial}`;
  return `${availableCount} · ${copy.badges.ready}`;
}

function topicAvailabilityLabel(topic, copy) {
  if (!topic.ready || topic.availability === 'planned') return copy.badges.planned;
  return topic.availability === 'partial' ? copy.badges.partial : copy.badges.ready;
}

// Shared by both Korean sub-views (기존 학년별 분류 and 2022 개정 과목별 분류) — the two only differ
// in which meta badges a topic happens to carry (legacy/revised2022/officialType vs legacy/grade),
// and by International Courses/수학 영역별, which never set meta at all.
//
// A topic can optionally carry `amc: { href }` — a matching AMC(미국수학경시대회) unit covering the
// same concept. Rather than listing it as a separate row (confusing — user explicitly rejected that:
// "같은 단원 안에 토글로"), the toggle below swaps THIS topic's own link/badge in place between the
// regular practice generator and the AMC unit, so the topic stays a single row either way.
function TopicItem({ topic, copy }) {
  const [showAmc, setShowAmc] = useState(false);
  const hasAmc = Boolean(topic.amc);
  const amcActive = hasAmc && showAmc;
  const activeHref = amcActive ? topic.amc.href : topic.href;

  return (
    <div className="curriculum-topic-item">
      {topic.ready ? (
        <a href={activeHref} className="topic-link">
          <div className="topic-link-main">
            <span className="topic-name">{topic.label}</span>
            {(topic.meta || amcActive) && (
              <div className="topic-meta-badges">
                {topic.meta?.legacy && <span className="meta-badge legacy">{copy.labels.legacyName}: {topic.meta.legacy}</span>}
                {topic.meta?.revised2022 && <span className="meta-badge revised">{copy.labels.revised2022}: {topic.meta.revised2022}</span>}
                {topic.meta?.officialType && <span className="meta-badge official">{topic.meta.officialType}</span>}
                {topic.meta?.grade && <span className="meta-badge grade">{copy.labels.targetGrade}: {topic.meta.grade}</span>}
                {amcActive && <span className="meta-badge amc-source">AMC · 미국수학경시대회</span>}
              </div>
            )}
          </div>
          <span className={`action-tag ${topic.availability || 'ready'}`}>{topicAvailabilityLabel(topic, copy)} →</span>
        </a>
      ) : (
        <div className="topic-disabled">
          <div className="topic-link-main">
            <span className="topic-name">{topic.label}</span>
            {topic.meta && topic.meta.grade && (
              <div className="topic-meta-badges">
                <span className="meta-badge grade">{copy.labels.targetGrade}: {topic.meta.grade}</span>
              </div>
            )}
          </div>
          <small className="planned-tag">{copy.badges.planned}</small>
        </div>
      )}
      {hasAmc && (
        <button
          type="button"
          className={`amc-toggle-btn${amcActive ? ' on' : ''}`}
          onClick={() => setShowAmc((value) => !value)}
          aria-pressed={amcActive}
        >
          <span className="amc-toggle-dot" />
          AMC 문제 {amcActive ? '끄기' : '보기'}
        </button>
      )}
    </div>
  );
}

function renderStage(stage, copy, { openByDefault = false, extraClassName = '' } = {}) {
  const stageStatus = availabilityForTopics(stage.topics);
  return (
    <details className={`curriculum-stage ${extraClassName}`.trim()} key={stage.id} open={openByDefault}>
      <summary>
        <span>
          <strong>{stage.title}</strong>
          <small>{stage.subtitle}</small>
        </span>
        <span className={`curriculum-count ${stageStatus}`}>{availabilitySummary(stage.topics, copy)}</span>
        <span className="sr-only">{copy.badges.open}</span>
      </summary>
      {stage.notice && (
        <div className="stage-mini-notice">
          <span>ℹ️</span> {stage.notice}
        </div>
      )}
      <div className="curriculum-topic-list">{stage.topics.map((topic) => <TopicItem key={topic.catalogId || topic.label} topic={topic} copy={copy} />)}</div>
    </details>
  );
}

export default function CurriculumExplorer() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState(() => (language === 'ko' ? 'korea' : 'courses'));
  const [krSubView, setKrSubView] = useState('grade'); // 'grade' | 'subject2022'
  const [eastAsiaCountry, setEastAsiaCountry] = useState('japan'); // 'japan' | 'taiwan' | 'hongkong'
  const [southeastAsiaCountry, setSoutheastAsiaCountry] = useState('singapore'); // 'singapore' | 'malaysia' | 'vietnam'
  const [southAsiaCountry, setSouthAsiaCountry] = useState('india'); // 'india'

  // If user has not manually changed tab on first load, adjust to language default once
  useEffect(() => {
    // A direct link (e.g. the top-nav "동아시아 교육과정" item) takes priority over both
    // sessionStorage and the language default, so it reliably lands on the right tab.
    const requestedTab = new URLSearchParams(window.location.search).get('curriculumTab');
    if (requestedTab && ['korea', 'courses', 'domains', 'eastasia', 'southeastasia', 'southasia'].includes(requestedTab)) {
      setActiveTab(requestedTab);
      try { window.sessionStorage.setItem('math-curriculum-tab', requestedTab); } catch {}
      return;
    }
    const userSelected = window.sessionStorage.getItem('math-curriculum-tab');
    if (userSelected) {
      setActiveTab(userSelected);
    } else if (language === 'ko') {
      setActiveTab('korea');
    } else {
      setActiveTab('courses');
    }
  }, []); // Run once on mount

  const copy = CURRICULUM_COPY[language] || CURRICULUM_COPY.en;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    try {
      window.sessionStorage.setItem('math-curriculum-tab', tabId);
    } catch {}
  };

  const tabs = useMemo(
    () => [
      { id: 'korea', label: copy.mainTabs[0], help: copy.mainTabHelp[0] },
      { id: 'courses', label: copy.mainTabs[1], help: copy.mainTabHelp[1] },
      { id: 'domains', label: copy.mainTabs[2], help: copy.mainTabHelp[2] },
      { id: 'eastasia', label: copy.mainTabs[3], help: copy.mainTabHelp[3] },
      { id: 'southeastasia', label: copy.mainTabs[4], help: copy.mainTabHelp[4] },
      { id: 'southasia', label: copy.mainTabs[5], help: copy.mainTabHelp[5] },
    ],
    [copy]
  );

  const EAST_ASIA_STAGES = { japan: JAPAN_STAGES, taiwan: TAIWAN_STAGES, hongkong: HONGKONG_STAGES };
  const SOUTHEAST_ASIA_STAGES = { singapore: SINGAPORE_STAGES, malaysia: MALAYSIA_STAGES, vietnam: VIETNAM_STAGES };
  const SOUTH_ASIA_STAGES = { india: INDIA_STAGES };

  const koreanSchoolGroups = useMemo(
    () => [
      {
        id: 'elementary',
        title: copy.schoolLevels.elementary,
        subtitle: language === 'ko' ? '초1–초6' : 'Grades 1–6',
        stages: KOREAN_GRADE_STAGES.filter((stage) => stage.level === 'elementary'),
      },
      {
        id: 'middle',
        title: copy.schoolLevels.middle,
        subtitle: language === 'ko' ? '중1–중3' : 'Grades 7–9',
        stages: KOREAN_GRADE_STAGES.filter((stage) => stage.level === 'middle'),
      },
      {
        id: 'high',
        title: copy.schoolLevels.high,
        subtitle: language === 'ko' ? '고1–고3 · 기존 분류' : 'Grades 10–12 · Classic course names',
        stages: KOREAN_GRADE_STAGES.filter((stage) => stage.level === 'high'),
      },
    ],
    [copy, language]
  );

  return (
    <section className="curriculum-explorer" aria-labelledby="curriculum-title">
      <div className="curriculum-heading">
        <p className="font-mono">{copy.eyebrow}</p>
        <h2 id="curriculum-title" className="font-display">
          {copy.title}
        </h2>
        <p>{copy.description}</p>
      </div>

      {/* Top 3 Main Tabs */}
      <div className="curriculum-tabs" role="tablist" aria-label={copy.title}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`curriculum-panel-${tab.id}`}
            id={`curriculum-tab-${tab.id}`}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => handleTabChange(tab.id)}
          >
            <strong>{tab.label}</strong>
            <span>{tab.help}</span>
          </button>
        ))}
      </div>

      {/* Main Tab Panel */}
      <div
        className="curriculum-panel"
        id={`curriculum-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`curriculum-tab-${activeTab}`}
      >
        {/* Tab 1: 한국 교육과정 */}
        {/* The 학년별/2022개정 과목별 toggle only ever meant something for high school — 2022 개정
            "과목" names (수학Ⅰ·수학Ⅱ·확률과통계·미적분·기하 등) don't exist as a classification for
            elementary/middle grades, which just have one 수학 course per grade either way. It used
            to be a page-wide switch that replaced the ENTIRE Korean view, so choosing "2022개정
            과목별 보기" made the elementary/middle sections vanish even though nothing was wrong —
            they just have no 2022-subject equivalent to show. The toggle now lives inside the high
            school group only; elementary and middle always render via the 학년별 stage data. */}
        {activeTab === 'korea' && (
          <div className="korean-curriculum-wrap">
            <div className="school-level-list">
              {koreanSchoolGroups.map((group) => {
                if (group.id !== 'high') {
                  const groupTopics = group.stages.flatMap((stage) => stage.topics);
                  const groupStatus = availabilityForTopics(groupTopics);
                  return (
                    <details className={`school-level-group ${group.id}-group`} key={group.id}>
                      <summary>
                        <span>
                          <strong>{group.title}</strong>
                          <small>{group.subtitle}</small>
                        </span>
                        <span className={`curriculum-count ${groupStatus}`}>{availabilitySummary(groupTopics, copy)}</span>
                        <span className="sr-only">{copy.badges.open}</span>
                      </summary>
                      <div className="school-level-content">
                        <div className="curriculum-stage-grid">
                          {group.stages.map((stage) => renderStage(stage, copy))}
                        </div>
                      </div>
                    </details>
                  );
                }

                // High school group: carries the 학년별(기존분류)/2022개정 과목별 toggle, scoped to
                // itself so switching it never touches elementary/middle above.
                const activeTopics = krSubView === 'subject2022'
                  ? KOREAN_2022_SUBJECT_STAGES.flatMap((stage) => stage.topics)
                  : group.stages.flatMap((stage) => stage.topics);
                const groupStatus = availabilityForTopics(activeTopics);
                return (
                  <details className="school-level-group high-group" key={group.id} open>
                    <summary>
                      <span>
                        <strong>{group.title}</strong>
                        <small>{group.subtitle}</small>
                      </span>
                      <span className={`curriculum-count ${groupStatus}`}>{availabilitySummary(activeTopics, copy)}</span>
                      <span className="sr-only">{copy.badges.open}</span>
                    </summary>
                    <div className="school-level-content">
                      <div className="curriculum-subview-bar">
                        <div className="subview-toggle-group" role="group" aria-label="한국 고등학교 교육과정 보기 방식">
                          <button
                            type="button"
                            className={`subview-btn ${krSubView === 'grade' ? 'active' : ''}`}
                            onClick={() => setKrSubView('grade')}
                          >
                            <span className="subview-icon">🏫</span>
                            <strong>{copy.subViews.byGrade}</strong>
                          </button>
                          <button
                            type="button"
                            className={`subview-btn ${krSubView === 'subject2022' ? 'active' : ''}`}
                            onClick={() => setKrSubView('subject2022')}
                          >
                            <span className="subview-icon">📘</span>
                            <strong>{copy.subViews.bySubject2022}</strong>
                          </button>
                        </div>
                      </div>

                      {krSubView === 'grade' ? (
                        <>
                          <div className="curriculum-notice-banner">
                            <span className="notice-icon">💡</span>
                            <p>{copy.notices.gradeLegacyNotice}</p>
                          </div>
                          <div className="curriculum-stage-grid">
                            {group.stages.map((stage) => renderStage(stage, copy, { extraClassName: 'high-stage' }))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="curriculum-notice-banner official">
                            <span className="notice-icon">📋</span>
                            <p>{copy.notices.subject2022Notice}</p>
                          </div>
                          <div className="curriculum-stage-grid">
                            {KOREAN_2022_SUBJECT_STAGES.map((stage, index) => renderStage(stage, copy, {
                              openByDefault: index < 3,
                              extraClassName: `subject-stage ${stage.officialType === 'professional' ? 'professional-stage' : ''}`,
                            }))}
                          </div>
                        </>
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: 국제학교 과정 */}
        {activeTab === 'courses' && (
          <div className="international-curriculum-wrap">
            <div className="curriculum-notice-banner intl">
              <span className="notice-icon">🌐</span>
              <p>{copy.notices.intlNotice}</p>
            </div>

            <div className="curriculum-stage-grid">
              {INTERNATIONAL_COURSE_STAGES.map((stage, index) => {
                const stageStatus = availabilityForTopics(stage.topics);
                return (
                  <details className="curriculum-stage" key={stage.id} open={index < 3}>
                    <summary>
                      <span>
                        <strong>{stage.title}</strong>
                        <small>{stage.subtitle}</small>
                      </span>
                      <span className={`curriculum-count ${stageStatus}`}>{availabilitySummary(stage.topics, copy)}</span>
                      <span className="sr-only">{copy.badges.open}</span>
                    </summary>

                    <div className="curriculum-topic-list">
                      {stage.topics.map((topic) => (
                        <div key={topic.label} className="curriculum-topic-item">
                          {topic.ready ? (
                            <a href={topic.href} className="topic-link">
                              <span className="topic-name">{topic.label}</span>
                              <span className={`action-tag ${topic.availability || 'ready'}`}>{topicAvailabilityLabel(topic, copy)} →</span>
                            </a>
                          ) : (
                            <div className="topic-disabled">
                              <span className="topic-name">{topic.label}</span>
                              <small className="planned-tag">{copy.badges.planned}</small>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: 수학 영역별 */}
        {activeTab === 'domains' && (
          <div className="domains-curriculum-wrap">
            <div className="curriculum-notice-banner domain">
              <span className="notice-icon">📐</span>
              <p>{copy.notices.domainNotice}</p>
            </div>

            <div className="curriculum-stage-grid">
              {DOMAIN_STAGES.map((stage, index) => {
                const stageStatus = availabilityForTopics(stage.topics);
                return (
                  <details className="curriculum-stage" key={stage.id} open={index < 2}>
                    <summary>
                      <span>
                        <strong>{stage.title}</strong>
                        <small>{stage.subtitle}</small>
                      </span>
                      <span className={`curriculum-count ${stageStatus}`}>{availabilitySummary(stage.topics, copy)}</span>
                      <span className="sr-only">{copy.badges.open}</span>
                    </summary>

                    <div className="curriculum-topic-list">
                      {stage.topics.map((topic) => (
                        <div key={topic.label} className="curriculum-topic-item">
                          {topic.ready ? (
                            <a href={topic.href} className="topic-link">
                              <span className="topic-name">{topic.label}</span>
                              <span className={`action-tag ${topic.availability || 'ready'}`}>{topicAvailabilityLabel(topic, copy)} →</span>
                            </a>
                          ) : (
                            <div className="topic-disabled">
                              <span className="topic-name">{topic.label}</span>
                              <small className="planned-tag">{copy.badges.planned}</small>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: 동아시아 교육과정 (일본·대만·홍콩) */}
        {activeTab === 'eastasia' && (
          <div className="eastasia-curriculum-wrap">
            <div className="curriculum-subview-bar">
              <div className="subview-toggle-group country-toggle-group" role="group" aria-label="동아시아 교육과정 국가 선택">
                {['japan', 'taiwan', 'hongkong'].map((country) => (
                  <button
                    type="button"
                    key={country}
                    className={`subview-btn ${eastAsiaCountry === country ? 'active' : ''}`}
                    onClick={() => setEastAsiaCountry(country)}
                  >
                    <strong>{copy.eastAsiaCountries[country]}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="curriculum-notice-banner official">
              <span className="notice-icon">🌏</span>
              <p>{copy.notices.eastAsiaNotice}</p>
            </div>

            <div className="curriculum-stage-grid">
              {EAST_ASIA_STAGES[eastAsiaCountry].map((stage, index) => renderStage(stage, copy, { openByDefault: index < 2 }))}
            </div>
          </div>
        )}

        {/* Tab 5: 동남아시아 교육과정 (싱가포르·말레이시아·베트남) */}
        {activeTab === 'southeastasia' && (
          <div className="eastasia-curriculum-wrap">
            <div className="curriculum-subview-bar">
              <div className="subview-toggle-group country-toggle-group" role="group" aria-label="동남아시아 교육과정 국가 선택">
                {['singapore', 'malaysia', 'vietnam'].map((country) => (
                  <button
                    type="button"
                    key={country}
                    className={`subview-btn ${southeastAsiaCountry === country ? 'active' : ''}`}
                    onClick={() => setSoutheastAsiaCountry(country)}
                  >
                    <strong>{copy.southeastAsiaCountries[country]}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="curriculum-notice-banner official">
              <span className="notice-icon">🌏</span>
              <p>{copy.notices.southeastAsiaNotice}</p>
            </div>

            <div className="curriculum-stage-grid">
              {SOUTHEAST_ASIA_STAGES[southeastAsiaCountry].map((stage, index) => renderStage(stage, copy, { openByDefault: index < 2 }))}
            </div>
          </div>
        )}

        {/* Tab 6: 남아시아 교육과정 (인도) */}
        {activeTab === 'southasia' && (
          <div className="eastasia-curriculum-wrap">
            <div className="curriculum-subview-bar">
              <div className="subview-toggle-group country-toggle-group" role="group" aria-label="남아시아 교육과정 국가 선택">
                {['india'].map((country) => (
                  <button
                    type="button"
                    key={country}
                    className={`subview-btn ${southAsiaCountry === country ? 'active' : ''}`}
                    onClick={() => setSouthAsiaCountry(country)}
                  >
                    <strong>{copy.southAsiaCountries[country]}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="curriculum-notice-banner official">
              <span className="notice-icon">🌏</span>
              <p>{copy.notices.southAsiaNotice}</p>
            </div>

            <div className="curriculum-stage-grid">
              {SOUTH_ASIA_STAGES[southAsiaCountry].map((stage, index) => renderStage(stage, copy, { openByDefault: index < 2 }))}
            </div>
          </div>
        )}

        <p className="curriculum-note">{copy.notices.bottomNote}</p>
      </div>

      <style jsx>{`
        .curriculum-subview-bar {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 14px;
          padding-bottom: 12px;
          border-bottom: 1px dashed var(--paper-line);
        }
        .subview-toggle-group {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 6px;
          background: var(--paper);
          padding: 4px;
          border-radius: 10px;
          border: 1px solid var(--paper-line);
        }
        .subview-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: none;
          background: transparent;
          color: var(--ink-soft);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .subview-btn:hover {
          color: var(--ink);
          background: rgba(255, 255, 255, 0.6);
        }
        .subview-btn.active {
          color: #fff;
          background: var(--chalk-green);
          box-shadow: 0 2px 6px rgba(47, 110, 92, 0.25);
        }
        .subview-icon {
          font-size: 14px;
        }
        .curriculum-notice-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 14px;
          margin-bottom: 14px;
          border-radius: 9px;
          background: #fff8eb;
          border: 1px solid #fed7aa;
          color: #9a3412;
          font-size: 12px;
          line-height: 1.5;
        }
        .curriculum-notice-banner.official {
          background: #f0fdf4;
          border-color: #bbf7d0;
          color: #166534;
        }
        .curriculum-notice-banner.intl {
          background: #f0f9ff;
          border-color: #bae6fd;
          color: #0369a1;
        }
        .curriculum-notice-banner.domain {
          background: #fdf4ff;
          border-color: #f5d0fe;
          color: #86198f;
        }
        .curriculum-notice-banner p {
          margin: 0;
          font-weight: 500;
        }
        .school-level-list {
          display: grid;
          gap: 12px;
        }
        .school-level-group {
          overflow: hidden;
          border: 1px solid var(--paper-line);
          border-radius: 13px;
          background: rgba(255, 254, 251, 0.72);
        }
        .school-level-group > summary {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 12px;
          min-height: 68px;
          padding: 13px 46px 13px 16px;
          cursor: pointer;
          list-style: none;
        }
        .school-level-group > summary::-webkit-details-marker {
          display: none;
        }
        .school-level-group > summary::after {
          content: '+';
          position: absolute;
          right: 16px;
          top: 50%;
          margin-top: -12px;
          color: var(--chalk-green);
          font-size: 22px;
          line-height: 24px;
        }
        .school-level-group[open] > summary::after {
          content: '−';
        }
        .school-level-group > summary strong,
        .school-level-group > summary small {
          display: block;
        }
        .school-level-group > summary strong {
          font-size: 17px;
        }
        .school-level-group > summary small {
          margin-top: 2px;
          color: var(--ink-soft);
          font-size: 11px;
        }
        .school-level-content {
          padding: 12px;
          border-top: 1px solid var(--paper-line);
          background: var(--paper);
        }
        .high-group {
          border-color: #a7c7bb;
          box-shadow: 0 5px 16px rgba(47, 110, 92, 0.07);
        }
        .curriculum-count.partial {
          color: #9a5b13;
          background: #fff4d6;
        }
        .curriculum-count.planned {
          color: #64748b;
          background: #e2e8f0;
        }
        .stage-mini-notice {
          padding: 6px 12px;
          font-size: 11px;
          color: #854d0e;
          background: #fefce8;
          border-bottom: 1px dashed #fef08a;
          line-height: 1.4;
        }
        .topic-link-main {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }
        .topic-name {
          line-height: 1.35;
          word-break: keep-all;
        }
        .topic-meta-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .meta-badge {
          display: inline-block;
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          line-height: 1.3;
        }
        .meta-badge.revised {
          background: #e0f2fe;
          color: #0369a1;
        }
        .meta-badge.official {
          background: #fef3c7;
          color: #92400e;
        }
        .meta-badge.legacy {
          background: #f1f5f9;
          color: #475569;
        }
        .meta-badge.grade {
          background: #fae8ff;
          color: #86198f;
        }
        .meta-badge.amc-source {
          background: #dbeafe;
          color: #1d4ed8;
        }
        .amc-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          align-self: flex-start;
          margin: 4px 10px 8px;
          padding: 4px 10px 4px 8px;
          border: 1px solid #bfdbfe;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .amc-toggle-btn:hover {
          background: #dbeafe;
        }
        .amc-toggle-btn.on {
          background: #1d4ed8;
          border-color: #1d4ed8;
          color: #fff;
        }
        .amc-toggle-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.55;
        }
        .amc-toggle-btn.on .amc-toggle-dot {
          opacity: 1;
        }
        .action-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--chalk-green);
          white-space: nowrap;
          margin-left: 6px;
        }
        .action-tag.partial {
          color: #9a5b13;
        }
        .topic-link:hover .action-tag {
          color: #fff;
        }
        .topic-disabled {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          min-height: 42px;
          padding: 9px 10px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--ink-soft);
          background: var(--paper);
          opacity: 0.72;
        }
        .planned-tag {
          font-size: 10px;
          color: #64748b;
          background: #e2e8f0;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .high-stage {
          border-color: #cbd5e1;
        }
        .professional-stage {
          border-style: dashed;
        }
        @media (max-width: 768px) {
          .curriculum-tabs {
            grid-template-columns: 1fr;
          }
          .curriculum-tabs button {
            min-height: 60px;
          }
          .curriculum-stage-grid {
            grid-template-columns: 1fr;
          }
          .subview-toggle-group {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          .subview-toggle-group.country-toggle-group {
            grid-template-columns: repeat(3, 1fr);
          }
          .subview-btn {
            justify-content: center;
            padding: 8px 8px;
            font-size: 12px;
          }
        }
      `}</style>
    </section>
  );
}
