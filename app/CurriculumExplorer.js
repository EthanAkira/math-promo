'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from './language';
import {
  CURRICULUM_COPY,
  KOREAN_GRADE_STAGES,
  KOREAN_2022_SUBJECT_STAGES,
  INTERNATIONAL_COURSE_STAGES,
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

export default function CurriculumExplorer() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState(() => (language === 'ko' ? 'korea' : 'courses'));
  const [krSubView, setKrSubView] = useState('grade'); // 'grade' | 'subject2022'

  // If user has not manually changed tab on first load, adjust to language default once
  useEffect(() => {
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
    ],
    [copy]
  );

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
        {activeTab === 'korea' && (
          <div className="korean-curriculum-wrap">
            {/* Sub-view Switcher for Korean Curriculum */}
            <div className="curriculum-subview-bar">
              <div className="subview-toggle-group" role="group" aria-label="한국 교육과정 보기 방식">
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

            {/* View A: 학년별 보기 (기존 분류 기반 기본 탐색) */}
            {krSubView === 'grade' && (
              <div className="grade-view-container">
                {/* High School Alert Notice */}
                <div className="curriculum-notice-banner">
                  <span className="notice-icon">💡</span>
                  <p>{copy.notices.gradeLegacyNotice}</p>
                </div>

                <div className="school-level-list">
                  {koreanSchoolGroups.map((group) => {
                    const groupTopics = group.stages.flatMap((stage) => stage.topics);
                    const groupStatus = availabilityForTopics(groupTopics);
                    return (
                      <details className={`school-level-group ${group.id}-group`} key={group.id} open={group.id === 'high'}>
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
                            {group.stages.map((stage) => {
                              const stageStatus = availabilityForTopics(stage.topics);
                              const isHigh = stage.level === 'high';
                              return (
                                <details className={`curriculum-stage ${isHigh ? 'high-stage' : ''}`} key={stage.id}>
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

                                  <div className="curriculum-topic-list">
                                    {stage.topics.map((topic) => (
                                      <div key={topic.catalogId || topic.label} className="curriculum-topic-item">
                                        {topic.ready ? (
                                          <a href={topic.href} className="topic-link">
                                            <div className="topic-link-main">
                                              <span className="topic-name">{topic.label}</span>
                                              {topic.meta && (
                                                <div className="topic-meta-badges">
                                                  {topic.meta.revised2022 && (
                                                    <span className="meta-badge revised">
                                                      {copy.labels.revised2022}: {topic.meta.revised2022}
                                                    </span>
                                                  )}
                                                  {topic.meta.officialType && (
                                                    <span className="meta-badge official">{topic.meta.officialType}</span>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                            <span className={`action-tag ${topic.availability || 'ready'}`}>
                                              {topicAvailabilityLabel(topic, copy)} →
                                            </span>
                                          </a>
                                        ) : (
                                          <div className="topic-disabled">
                                            <div className="topic-link-main">
                                              <span className="topic-name">{topic.label}</span>
                                            </div>
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
                      </details>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View B: 2022 개정 과목별 보기 (공식 구분별 탐색) */}
            {krSubView === 'subject2022' && (
              <div className="subject2022-view-container">
                <div className="curriculum-notice-banner official">
                  <span className="notice-icon">📋</span>
                  <p>{copy.notices.subject2022Notice}</p>
                </div>

                <div className="curriculum-stage-grid">
                  {KOREAN_2022_SUBJECT_STAGES.map((stage, index) => {
                    const stageStatus = availabilityForTopics(stage.topics);
                    const isProfessional = stage.officialType === 'professional';
                    return (
                      <details className={`curriculum-stage subject-stage ${isProfessional ? 'professional-stage' : ''}`} key={stage.id} open={index < 3}>
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
                                  <div className="topic-link-main">
                                    <span className="topic-name">{topic.label}</span>
                                    {topic.meta && (
                                      <div className="topic-meta-badges">
                                        {topic.meta.legacy && (
                                          <span className="meta-badge legacy">
                                            {copy.labels.legacyName}: {topic.meta.legacy}
                                          </span>
                                        )}
                                        {topic.meta.grade && (
                                          <span className="meta-badge grade">
                                            {copy.labels.targetGrade}: {topic.meta.grade}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <span className={`action-tag ${topic.availability || 'ready'}`}>
                                    {topicAvailabilityLabel(topic, copy)} →
                                  </span>
                                </a>
                              ) : (
                                <div className="topic-disabled">
                                  <div className="topic-link-main">
                                    <span className="topic-name">{topic.label}</span>
                                    {topic.meta && topic.meta.grade && (
                                      <div className="topic-meta-badges">
                                        <span className="meta-badge grade">
                                          {copy.labels.targetGrade}: {topic.meta.grade}
                                        </span>
                                      </div>
                                    )}
                                  </div>
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
