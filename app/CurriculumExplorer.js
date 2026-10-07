'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from './language';
import { sanitizePublicText } from './publicText';
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
  USA_STAGES,
  AUSTRALIA_STAGES,
  UK_STAGES,
  CANADA_STAGES,
  NEW_ZEALAND_STAGES,
  DOMAIN_STAGES,
} from './curriculumCatalog';

function availabilityForTopics(topics) {
  const realTopics = topics.filter((topic) => !topic.isHeader);
  if (realTopics.every((topic) => !topic.ready || topic.availability === 'planned')) return 'planned';
  if (realTopics.some((topic) => topic.availability === 'partial' || !topic.ready || topic.availability === 'planned')) return 'partial';
  return 'ready';
}

function availabilitySummary(topics, copy) {
  const status = availabilityForTopics(topics);
  if (status === 'planned') return copy.badges.planned;
  const realTopics = topics.filter((topic) => !topic.isHeader);
  const availableCount = realTopics.filter((topic) => topic.ready && topic.availability !== 'planned').length;
  if (status === 'partial') return `${availableCount}/${realTopics.length} · ${copy.badges.partial}`;
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
// same concept. Shown as a plain badge-link under the topic (not a toggle — that design was tried
// and rejected as needless complexity); the badge always points at the localized AMC variant
// (`&variant=1`), never the raw English archive.
// A topic can likewise carry `csat: { href }` — a matching CSAT(수능) unit in /csat/units, shown as
// its own badge-link the same way (both can appear together on one topic).
function TopicItem({ topic, copy }) {
  const displayLabel = sanitizePublicText(topic.label);
  if (topic.isHeader) {
    return (
      <div className="curriculum-topic-group-header">
        <span className="group-header-label">{displayLabel}</span>
      </div>
    );
  }

  const hasAmc = Boolean(topic.amc);
  const hasCsat = Boolean(topic.csat);

  const typeMatch = displayLabel.match(/^\[(기본|응용|실전 총괄|통합)\]\s*/);
  const typeTag = typeMatch ? typeMatch[1] : null;
  const cleanLabel = typeMatch ? displayLabel.slice(typeMatch[0].length) : displayLabel;

  const getTagClass = (tag) => {
    switch (tag) {
      case '기본': return 'type-basic';
      case '응용': return 'type-applied';
      case '실전 총괄': return 'type-exam';
      case '통합': return 'type-integrated';
      default: return '';
    }
  };

  return (
    <div className={`curriculum-topic-item ${typeTag ? getTagClass(typeTag) : ''}`.trim()}>
      {topic.ready ? (
        <a href={topic.href} className="topic-link">
          <div className="topic-link-main">
            <span className="topic-name">
              {typeTag && (
                <span className={`curriculum-type-badge ${getTagClass(typeTag)}`}>
                  {typeTag}
                </span>
              )}
              <span className="topic-text">{cleanLabel}</span>
            </span>
            {topic.meta && (
              <div className="topic-meta-badges">
                {topic.meta?.legacy && <span className="meta-badge legacy">{copy.labels.legacyName}: {topic.meta.legacy}</span>}
                {topic.meta?.revised2022 && <span className="meta-badge revised">{copy.labels.revised2022}: {topic.meta.revised2022}</span>}
                {topic.meta?.officialType && <span className="meta-badge official">{topic.meta.officialType}</span>}
                {topic.meta?.grade && <span className="meta-badge grade">{copy.labels.targetGrade}: {topic.meta.grade}</span>}
              </div>
            )}
          </div>
          <span className={`action-tag ${topic.availability || 'ready'}`}>{topicAvailabilityLabel(topic, copy)} →</span>
        </a>
      ) : (
        <div className="topic-disabled">
          <div className="topic-link-main">
            <span className="topic-name">
              {typeTag && (
                <span className={`curriculum-type-badge ${getTagClass(typeTag)}`}>
                  {typeTag}
                </span>
              )}
              <span className="topic-text">{cleanLabel}</span>
            </span>
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
        <a href={topic.amc.href} className="amc-inline-badge">
          <span>AMC 미국수학경시대회 스타일 문제로 연습하기</span>
          <span className="amc-inline-badge-cta">문제 풀기 →</span>
        </a>
      )}
      {hasCsat && (
        <a href={topic.csat.href} className="csat-inline-badge">
          <span>수능 기출문제로 응용 연습하기</span>
          <span className="csat-inline-badge-cta">문제 풀기 →</span>
        </a>
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
          <strong>{sanitizePublicText(stage.title)}</strong>
          <small>{sanitizePublicText(stage.subtitle)}</small>
        </span>
        <span className={`curriculum-count ${stageStatus}`}>{availabilitySummary(stage.topics, copy)}</span>
        <span className="sr-only">{copy.badges.open}</span>
      </summary>
      {stage.notice && (
        <div className="stage-mini-notice">
          <span>ℹ️</span> {sanitizePublicText(stage.notice)}
        </div>
      )}
      <div className="curriculum-topic-list">{stage.topics.map((topic) => <TopicItem key={topic.catalogId || topic.label} topic={topic} copy={copy} />)}</div>
    </details>
  );
}

// When a user picks a country-specific curriculum, default the site language to that
// country's language so problem/label text matches what they'd expect — they can still
// switch to any other language afterward via the language switcher at any time.
const COUNTRY_LANGUAGE = {
  japan: 'ja', taiwan: 'zh-TW', hongkong: 'zh-HK',
  singapore: 'en-SG', malaysia: 'en', vietnam: 'vi',
  india: 'en',
  usa: 'en', australia: 'en', uk: 'en', canada: 'en', newzealand: 'en',
};

export default function CurriculumExplorer() {
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState(() => (language === 'ko' ? 'korea' : 'courses'));
  const [krSubView, setKrSubView] = useState('grade'); // 'grade' | 'subject2022'
  const [otherCountry, setOtherCountry] = useState('japan'); // 'japan' | 'taiwan' | 'vietnam' | 'canada' | 'newzealand'

  // If user has not manually changed tab on first load, adjust to language default once
  useEffect(() => {
    // Direct links or specific country selections take priority
    const requestedTab = new URLSearchParams(window.location.search).get('curriculumTab');
    const validTabs = ['korea', 'courses', 'domains', 'usa', 'uk', 'australia', 'malaysia', 'singapore', 'hongkong', 'india', 'other'];
    const aliasMap = {
      eastasia: 'hongkong',
      southeastasia: 'singapore',
      southasia: 'india',
      englishspeaking: 'usa',
      japan: 'other',
      taiwan: 'other',
      vietnam: 'other',
      canada: 'other',
      newzealand: 'other',
    };
    if (requestedTab) {
      const target = aliasMap[requestedTab] || requestedTab;
      if (validTabs.includes(target)) {
        setActiveTab(target);
        if (['japan', 'taiwan', 'vietnam', 'canada', 'newzealand'].includes(requestedTab)) {
          setOtherCountry(requestedTab);
        }
        try { window.sessionStorage.setItem('math-curriculum-tab', target); } catch {}
        return;
      }
    }
    const userSelected = window.sessionStorage.getItem('math-curriculum-tab');
    if (userSelected && validTabs.includes(userSelected)) {
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
    if (tabId === 'korea') {
      setLanguage('ko');
    } else if (COUNTRY_LANGUAGE[tabId]) {
      setLanguage(COUNTRY_LANGUAGE[tabId]);
    } else if (tabId === 'other' && COUNTRY_LANGUAGE[otherCountry]) {
      setLanguage(COUNTRY_LANGUAGE[otherCountry]);
    }
  };

  const tabs = useMemo(
    () => [
      { id: 'korea', label: copy.mainTabs[0], help: copy.mainTabHelp[0] },
      { id: 'courses', label: copy.mainTabs[1], help: copy.mainTabHelp[1] },
      { id: 'domains', label: copy.mainTabs[2], help: copy.mainTabHelp[2] },
      { id: 'usa', label: copy.mainTabs[3] || (language === 'ko' ? '미국 교육과정' : 'United States'), help: copy.mainTabHelp[3] || 'Grade 1~12 / AP Calculus' },
      { id: 'uk', label: copy.mainTabs[4] || (language === 'ko' ? '영국 교육과정' : 'United Kingdom'), help: copy.mainTabHelp[4] || 'Key Stage 1~5 / GCSE / A-Level' },
      { id: 'australia', label: copy.mainTabs[5] || (language === 'ko' ? '호주 교육과정' : 'Australia'), help: copy.mainTabHelp[5] || 'Foundation~Year 12 / VCE / HSC' },
      { id: 'malaysia', label: copy.mainTabs[6] || (language === 'ko' ? '말레이시아 교육과정' : 'Malaysia'), help: copy.mainTabHelp[6] || 'Year 1~6 / Form 1~5 / SPM' },
      { id: 'singapore', label: copy.mainTabs[7] || (language === 'ko' ? '싱가포르 교육과정' : 'Singapore'), help: copy.mainTabHelp[7] || 'Primary 1~6 / Secondary / O-Level' },
      { id: 'hongkong', label: copy.mainTabs[8] || (language === 'ko' ? '홍콩 교육과정' : 'Hong Kong'), help: copy.mainTabHelp[8] || 'P1~P6 / S1~S6 / HKDSE' },
      { id: 'india', label: copy.mainTabs[9] || (language === 'ko' ? '인도 교육과정' : 'India'), help: copy.mainTabHelp[9] || 'CBSE Class 1~12' },
      { id: 'other', label: copy.mainTabs[10] || (language === 'ko' ? '기타 국가 교육과정' : 'Other Countries'), help: copy.mainTabHelp[10] || (language === 'ko' ? '일본 · 대만 · 베트남 · 캐나다 · 뉴질랜드' : 'Japan · Taiwan · Vietnam · Canada · New Zealand') },
    ],
    [copy, language]
  );

  const OTHER_COUNTRY_STAGES = {
    japan: JAPAN_STAGES,
    taiwan: TAIWAN_STAGES,
    vietnam: VIETNAM_STAGES,
    canada: CANADA_STAGES,
    newzealand: NEW_ZEALAND_STAGES,
  };
  const OTHER_COUNTRY_LABELS = {
    japan: copy.eastAsiaCountries?.japan || (language === 'ko' ? '일본 교육과정' : 'Japan Curriculum'),
    taiwan: copy.eastAsiaCountries?.taiwan || (language === 'ko' ? '대만 교육과정' : 'Taiwan Curriculum'),
    vietnam: copy.southeastAsiaCountries?.vietnam || (language === 'ko' ? '베트남 교육과정' : 'Vietnam Curriculum'),
    canada: copy.englishSpeakingCountries?.canada || (language === 'ko' ? '캐나다 교육과정' : 'Canada Curriculum'),
    newzealand: copy.englishSpeakingCountries?.newzealand || (language === 'ko' ? '뉴질랜드 교육과정' : 'New Zealand Curriculum'),
  };

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
            className={`${activeTab === tab.id ? 'active' : ''} ${tab.id === 'other' ? 'tab-other-countries' : ''}`.trim()}
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
                        <strong>{sanitizePublicText(stage.title)}</strong>
                        <small>{sanitizePublicText(stage.subtitle)}</small>
                      </span>
                      <span className={`curriculum-count ${stageStatus}`}>{availabilitySummary(stage.topics, copy)}</span>
                      <span className="sr-only">{copy.badges.open}</span>
                    </summary>

                    <div className="curriculum-topic-list">
                      {stage.topics.map((topic) => (
                        <div key={topic.label} className="curriculum-topic-item">
                          {topic.ready ? (
                            <a href={topic.href} className="topic-link">
                              <span className="topic-name">{sanitizePublicText(topic.label)}</span>
                              <span className={`action-tag ${topic.availability || 'ready'}`}>{topicAvailabilityLabel(topic, copy)} →</span>
                            </a>
                          ) : (
                            <div className="topic-disabled">
                              <span className="topic-name">{sanitizePublicText(topic.label)}</span>
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
                        <strong>{sanitizePublicText(stage.title)}</strong>
                        <small>{sanitizePublicText(stage.subtitle)}</small>
                      </span>
                      <span className={`curriculum-count ${stageStatus}`}>{availabilitySummary(stage.topics, copy)}</span>
                      <span className="sr-only">{copy.badges.open}</span>
                    </summary>

                    <div className="curriculum-topic-list">
                      {stage.topics.map((topic) => (
                        <div key={topic.label} className="curriculum-topic-item">
                          {topic.ready ? (
                            <a href={topic.href} className="topic-link">
                              <span className="topic-name">{sanitizePublicText(topic.label)}</span>
                              <span className={`action-tag ${topic.availability || 'ready'}`}>{topicAvailabilityLabel(topic, copy)} →</span>
                            </a>
                          ) : (
                            <div className="topic-disabled">
                              <span className="topic-name">{sanitizePublicText(topic.label)}</span>
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

        {/* USA */}
        {(activeTab === 'usa' || activeTab === 'englishspeaking') && (
          <div className="eastasia-curriculum-wrap">
            <div className="curriculum-notice-banner official">
              <span className="notice-icon">🇺🇸</span>
              <p>{copy.notices?.usaNotice || '미국(주별/Common Core) 및 Pre-Algebra ~ AP Calculus 단계에 맞춰 구성된 문제 은행입니다.'}</p>
            </div>
            <div className="curriculum-stage-grid">
              {USA_STAGES.map((stage, index) => renderStage(stage, copy, { openByDefault: index < 2 }))}
            </div>
          </div>
        )}

        {/* UK */}
        {activeTab === 'uk' && (
          <div className="eastasia-curriculum-wrap">
            <div className="curriculum-notice-banner official">
              <span className="notice-icon">🇬🇧</span>
              <p>{copy.notices?.ukNotice || '영국(National Curriculum) Key Stage 1~5 및 GCSE, A-Level 단계에 맞춰 구성된 문제 은행입니다.'}</p>
            </div>
            <div className="curriculum-stage-grid">
              {UK_STAGES.map((stage, index) => renderStage(stage, copy, { openByDefault: index < 2 }))}
            </div>
          </div>
        )}

        {/* Australia */}
        {activeTab === 'australia' && (
          <div className="eastasia-curriculum-wrap">
            <div className="curriculum-notice-banner official">
              <span className="notice-icon">🇦🇺</span>
              <p>{copy.notices?.australiaNotice || '호주(Australian Curriculum) Foundation~Year 12 및 주별 고등과정에 맞춰 구성된 문제 은행입니다.'}</p>
            </div>
            <div className="curriculum-stage-grid">
              {AUSTRALIA_STAGES.map((stage, index) => renderStage(stage, copy, { openByDefault: index < 2 }))}
            </div>
          </div>
        )}

        {/* Malaysia */}
        {activeTab === 'malaysia' && (
          <div className="eastasia-curriculum-wrap">
            <div className="curriculum-notice-banner official">
              <span className="notice-icon">🇲🇾</span>
              <p>{copy.notices?.malaysiaNotice || '말레이시아(KSSR / KSSM / SPM) 교육과정 단계에 맞춰 구성된 문제 은행입니다.'}</p>
            </div>
            <div className="curriculum-stage-grid">
              {MALAYSIA_STAGES.map((stage, index) => renderStage(stage, copy, { openByDefault: index < 2 }))}
            </div>
          </div>
        )}

        {/* Singapore */}
        {(activeTab === 'singapore' || activeTab === 'southeastasia') && (
          <div className="eastasia-curriculum-wrap">
            <div className="curriculum-notice-banner official">
              <span className="notice-icon">🇸🇬</span>
              <p>{copy.notices?.singaporeNotice || '싱가포르(MOE) Primary, Secondary, O-Level 단계에 맞춰 구성된 문제 은행입니다.'}</p>
            </div>
            <div className="curriculum-stage-grid">
              {SINGAPORE_STAGES.map((stage, index) => renderStage(stage, copy, { openByDefault: index < 2 }))}
            </div>
          </div>
        )}

        {/* Hong Kong */}
        {(activeTab === 'hongkong' || activeTab === 'eastasia') && (
          <div className="eastasia-curriculum-wrap">
            <div className="curriculum-notice-banner official">
              <span className="notice-icon">🇭🇰</span>
              <p>{copy.notices?.hongkongNotice || '홍콩(EDB) 초등 P1~P6, 중고등 S1~S6 및 HKDSE 단계에 맞춰 구성된 문제 은행입니다.'}</p>
            </div>
            <div className="curriculum-stage-grid">
              {HONGKONG_STAGES.map((stage, index) => renderStage(stage, copy, { openByDefault: index < 2 }))}
            </div>
          </div>
        )}

        {/* India */}
        {(activeTab === 'india' || activeTab === 'southasia') && (
          <div className="eastasia-curriculum-wrap">
            <div className="curriculum-notice-banner official">
              <span className="notice-icon">🇮🇳</span>
              <p>{copy.notices?.indiaNotice || '인도(CBSE) Class 1~12 단계에 맞춰 구성된 문제 은행입니다.'}</p>
            </div>
            <div className="curriculum-stage-grid">
              {INDIA_STAGES.map((stage, index) => renderStage(stage, copy, { openByDefault: index < 2 }))}
            </div>
          </div>
        )}

        {/* Other Countries: Japan, Taiwan, Vietnam, Canada, New Zealand */}
        {activeTab === 'other' && (
          <div className="eastasia-curriculum-wrap">
            <div className="curriculum-subview-bar">
              <div className="subview-toggle-group country-toggle-group" role="group" aria-label="기타 국가 교육과정 선택">
                {['japan', 'taiwan', 'vietnam', 'canada', 'newzealand'].map((country) => (
                  <button
                    type="button"
                    key={country}
                    className={`subview-btn ${otherCountry === country ? 'active' : ''}`}
                    onClick={() => { setOtherCountry(country); setLanguage(COUNTRY_LANGUAGE[country]); }}
                  >
                    <strong>{OTHER_COUNTRY_LABELS[country]}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="curriculum-notice-banner official">
              <span className="notice-icon">🌐</span>
              <p>{copy.notices?.otherNotice || '일본·대만·베트남·캐나다·뉴질랜드 교육과정의 실제 학년·과목 명칭에 맞춰 구성된 문제 은행입니다.'}</p>
            </div>

            <div className="curriculum-stage-grid">
              {(OTHER_COUNTRY_STAGES[otherCountry] || JAPAN_STAGES).map((stage, index) => renderStage(stage, copy, { openByDefault: index < 2 }))}
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
        .amc-inline-badge {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          align-self: stretch;
          margin: 4px 10px 8px;
          padding: 5px 10px;
          border-radius: 6px;
          background: #f3e8ff;
          color: #7e22ce;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.3;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .amc-inline-badge:hover {
          background: #e9d5ff;
        }
        .amc-inline-badge-cta {
          font-weight: 800;
          white-space: nowrap;
        }
        .csat-inline-badge {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          align-self: stretch;
          margin: 4px 10px 8px;
          padding: 5px 10px;
          border-radius: 6px;
          background: #fee2e2;
          color: #b91c1c;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.3;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .csat-inline-badge:hover {
          background: #fecaca;
        }
        .csat-inline-badge-cta {
          font-weight: 800;
          white-space: nowrap;
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
        .curriculum-topic-group-header {
          grid-column: 1 / -1;
          margin-top: 14px;
          margin-bottom: 4px;
          padding: 8px 12px;
          background: linear-gradient(90deg, #f1f5f9 0%, rgba(241, 245, 249, 0.3) 100%);
          border-left: 4px solid var(--chalk-green, #2f6e5c);
          border-radius: 4px;
        }
        .curriculum-topic-group-header:first-child {
          margin-top: 2px;
        }
        .group-header-label {
          font-size: 13px;
          font-weight: 800;
          color: var(--navy-deep, #1e293b);
          letter-spacing: -0.01em;
        }
        .curriculum-type-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 6px;
          margin-right: 6px;
          line-height: 1.2;
          white-space: nowrap;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .curriculum-type-badge.type-basic {
          background: #e0f2fe;
          color: #0369a1;
          border: 1px solid #bae6fd;
        }
        .curriculum-type-badge.type-applied {
          background: #fef3c7;
          color: #b45309;
          border: 1px solid #fde68a;
        }
        .curriculum-type-badge.type-exam {
          background: #ffe4e6;
          color: #be123c;
          border: 1px solid #fecdd3;
        }
        .curriculum-type-badge.type-integrated {
          background: #f3e8ff;
          color: #7e22ce;
          border: 1px solid #e9d5ff;
        }
        .topic-name {
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 2px;
        }
        .high-stage {
          border-color: #cbd5e1;
        }
        .professional-stage {
          border-style: dashed;
        }
        .curriculum-tabs :global(.tab-other-countries) {
          grid-column: span 2;
        }
        @media (max-width: 768px) {
          .curriculum-tabs {
            grid-template-columns: 1fr;
          }
          .curriculum-tabs :global(.tab-other-countries) {
            grid-column: auto;
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
