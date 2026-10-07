'use client';

import { SiteHeader, SiteFooter, TutorProfileDisclosure } from '../components';
import { useLanguage } from '../language';

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <>
      <SiteHeader />
      <main className="main-content-wrap about-page-wrap">
        {/* Breadcrumb */}
        <nav className="about-breadcrumb font-mono" aria-label="Breadcrumb">
          <a href="/">홈 (Home)</a>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">ILLUMIA LAB 소개</span>
        </nav>

        {/* Hero Section of About Page */}
        <section className="about-hero-card">
          <div className="about-hero-badge font-mono">
            ✦ ILLUMIA LAB BRAND STORY & PHILOSOPHY ✦
          </div>
          <h1 className="about-hero-title font-cinzel">
            ILLUMIA LAB
          </h1>
          <div className="about-hero-slogan-en font-cormorant">
            Learn. Understand. Illuminate.
          </div>
          <p className="about-hero-slogan-ko font-display">
            배우고, 이해하고, 스스로 밝혀 나가다.
          </p>
          <p className="about-hero-lead">
            배움을 통해 생각을 밝히고, 이해와 지혜를 넘어 스스로 깨닫는 곳.<br />
            <strong>ILLUMIA LAB</strong>은 단순 암기보다 탐구, 이해, 발견을 최우선으로 삼는 배움의 실험실입니다.
          </p>
        </section>

        {/* Section 1: 이름의 의미와 작명 배경 */}
        <section id="name" className="academic-section-card about-block">
          <div className="section-title-wrap">
            <span className="section-kicker font-mono">BRAND ORIGIN & ETYMOLOGY</span>
            <h2 className="section-main-title font-display">이름의 배경과 의미</h2>
            <p className="section-sub-desc">
              빛(Light)과 실험실(Laboratory)의 만남: 현대적 배움의 지향점
            </p>
          </div>

          <div className="about-name-grid">
            <div className="about-name-panel illumia-panel">
              <div className="panel-badge font-mono">ILLUMIA</div>
              <h3 className="panel-title font-cinzel">빛, 비춤, 그리고 깨우침</h3>
              <p className="panel-text">
                <strong>ILLUMIA</strong>는 다음 세 가지 라틴어 단어의 본질적인 의미에서 영감을 받아 만든 <strong>현대적인 브랜드명</strong>입니다. (※ 고전 라틴어 단어 자체로 존재하는 것이 아니라, 깊은 어원적 상징성을 계승한 명칭입니다.)
              </p>
              <ul className="latin-roots-list">
                <li>
                  <strong className="font-cormorant">lumen</strong>
                  <span className="root-mean">빛 (Light) — 어둠을 가르고 모습을 드러내는 근원</span>
                </li>
                <li>
                  <strong className="font-cormorant">illuminare</strong>
                  <span className="root-mean">비추다, 밝히다 (To Illuminate) — 숨겨진 원리에 빛을 드리우는 행위</span>
                </li>
                <li>
                  <strong className="font-cormorant">illuminatio</strong>
                  <span className="root-mean">밝힘, 비춤, 깨우침 (Illumination) — 총체적인 이해와 통찰에 도달한 상태</span>
                </li>
              </ul>
              <div className="panel-quote font-display">
                “배움은 보이지 않던 것을 보이게 하고, 이해하지 못했던 것을 이해하게 합니다. ILLUMIA의 ‘빛’은 바로 그 순간을 상징합니다.”
              </div>
            </div>

            <div id="lab" className="about-name-panel lab-panel">
              <div className="panel-badge font-mono">LAB</div>
              <h3 className="panel-title font-cinzel">배움의 실험실 (Laboratory)</h3>
              <p className="panel-text">
                <strong>LAB</strong>은 Laboratory의 의미를 현대 교육으로 확장한 것입니다. 교사의 일방적인 강의를 수동적으로 받아적는 교실이 아니라, 학생이 직접 질문을 품고, 가설을 세우고, 다양한 풀이와 시도로 검증하는 <strong>‘배움의 실험실’</strong>입니다.
              </p>
              <div className="lab-action-matrix">
                <div className="action-pill">
                  <span className="pill-dot">✦</span>
                  <strong>Experiment</strong>
                  <span>실험하고 시도하기</span>
                </div>
                <div className="action-pill">
                  <span className="pill-dot">✦</span>
                  <strong>Explore</strong>
                  <span>원리를 깊이 탐구하기</span>
                </div>
                <div className="action-pill">
                  <span className="pill-dot">✦</span>
                  <strong>Discover</strong>
                  <span>스스로 규칙을 발견하기</span>
                </div>
                <div className="action-pill">
                  <span className="pill-dot">✦</span>
                  <strong>Create</strong>
                  <span>새로운 해법을 창조하기</span>
                </div>
              </div>
              <p className="panel-text-sub">
                우리는 학생이 시행착오를 두려워하지 않고, “왜 이 공식이 성립하는가?”를 스스로 파고들 때 비로소 진정한 지적 도약이 일어난다고 믿습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: 6단계 학습 철학 체계 */}
        <section id="philosophy" className="academic-section-card about-block">
          <div className="section-title-wrap">
            <span className="section-kicker font-mono">THE 6-STAGE SPECTRUM</span>
            <h2 className="section-main-title font-display">6단계 학습 철학 체계</h2>
            <p className="section-sub-desc">
              Learning → Knowledge → Intelligence → Discernment → Wisdom → Illumination
            </p>
          </div>

          <div className="spectrum-cards-stack">
            <div className="spectrum-card">
              <div className="spectrum-step-num font-cinzel">01</div>
              <div className="spectrum-content">
                <div className="spectrum-heading-group">
                  <h3 className="spectrum-title font-display">배움 (Learning)</h3>
                  <span className="spectrum-sub font-mono">호기심과 질문의 태동</span>
                </div>
                <p className="spectrum-detail">
                  모르는 것을 부끄러워하지 않고 인정하며, 현상에 대해 진지하게 의문을 품는 첫걸음입니다. 지적 호기심과 좋은 질문이야말로 모든 학문의 출발점입니다.
                </p>
              </div>
            </div>

            <div className="spectrum-card">
              <div className="spectrum-step-num font-cinzel">02</div>
              <div className="spectrum-content">
                <div className="spectrum-heading-group">
                  <h3 className="spectrum-title font-display">지식 (Knowledge)</h3>
                  <span className="spectrum-sub font-mono">원리와 개념의 구조화</span>
                </div>
                <p className="spectrum-detail">
                  질문을 통해 발견한 규칙과 사실들을 논리적으로 정리하여 머릿속에 체계화합니다. 흩어진 정보가 아닌, 서로 결합할 수 있는 튼튼한 지식의 뼈대를 세웁니다.
                </p>
              </div>
            </div>

            <div className="spectrum-card">
              <div className="spectrum-step-num font-cinzel">03</div>
              <div className="spectrum-content">
                <div className="spectrum-heading-group">
                  <h3 className="spectrum-title font-display">지성 (Intelligence)</h3>
                  <span className="spectrum-sub font-mono">개념 간의 유연한 연결과 추론</span>
                </div>
                <p className="spectrum-detail">
                  단일 단원에 갇히지 않고 대수와 기하, 수학과 코딩의 원리를 자유롭게 교차시키며 유연하게 사고하는 능력입니다. 새로운 낯선 문제를 만나도 가설을 세워 접근합니다.
                </p>
              </div>
            </div>

            <div className="spectrum-card">
              <div className="spectrum-step-num font-cinzel">04</div>
              <div className="spectrum-content">
                <div className="spectrum-heading-group">
                  <h3 className="spectrum-title font-display">분별 (Discernment)</h3>
                  <span className="spectrum-sub font-mono">핵심과 본질을 꿰뚫는 안목</span>
                </div>
                <p className="spectrum-detail">
                  문제의 복잡한 서술이나 겉모습에 휘둘리지 않고, 본질적인 수학적 구조와 결정적 조건을 날카롭게 가려내는 안목입니다. 사소한 것과 중대한 것을 분별합니다.
                </p>
              </div>
            </div>

            <div className="spectrum-card">
              <div className="spectrum-step-num font-cinzel">05</div>
              <div className="spectrum-content">
                <div className="spectrum-heading-group">
                  <h3 className="spectrum-title font-display">지혜 (Wisdom)</h3>
                  <span className="spectrum-sub font-mono">복합 난제를 돌파하는 종합적 힘</span>
                </div>
                <p className="spectrum-detail">
                  단순한 문제 풀이 기교를 넘어, 다양한 조건 속에서 최선의 해결 경로를 침착하게 찾아내는 통합적 역량입니다. 배움이 학생의 내적 자산으로 체화된 상태입니다.
                </p>
              </div>
            </div>

            <div className="spectrum-card illumination-card">
              <div className="spectrum-step-num font-cinzel">06</div>
              <div className="spectrum-content">
                <div className="spectrum-heading-group">
                  <h3 className="spectrum-title font-display">깨달음 (Illumination)</h3>
                  <span className="spectrum-sub font-mono">빛처럼 환히 밝아지는 최고의 순간</span>
                </div>
                <p className="spectrum-detail">
                  마침내 문제의 모든 인과관계가 한눈에 들어오고, 보이지 않던 원리가 눈앞에 찬란하게 밝혀지는 순간입니다. 이 깨달음의 기쁨이 평생 공부를 이끄는 내적 동력이 됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: 언어와 철학적 영감 (Sanskrit & Latin Roots) */}
        <section id="etymology" className="academic-section-card about-block">
          <div className="section-title-wrap">
            <span className="section-kicker font-mono">PHILOSOPHICAL INSPIRATIONS</span>
            <h2 className="section-main-title font-display">언어와 철학적 영감</h2>
            <p className="section-sub-desc">
              고대 동서양의 지혜가 전하는 배움과 인식의 깊이
            </p>
          </div>

          <p className="etymology-intro">
            ILLUMIA LAB은 동서양의 유구한 철학적 전통에서 배움이 심화되는 단계를 관찰했습니다. 아래 개념들은 고정된 하나의 절대 교리가 아니라, <strong>배움이 깊어지는 과정을 다각도로 조망하기 위한 풍부한 철학적 영감</strong>으로 소개합니다.
          </p>

          <div className="etymology-columns-grid">
            {/* Sanskrit Roots */}
            <div className="etymology-col">
              <div className="col-header">
                <span className="col-badge font-mono">EASTERN TRADITION</span>
                <h3 className="col-title font-display">산스크리트(Sanskrit) 철학적 개념</h3>
              </div>
              <div className="concept-list">
                <div className="concept-item">
                  <strong className="concept-term font-cinzel">Vidyā (비디야)</strong>
                  <p className="concept-desc">배움과 학문 — 앎을 향한 첫 번째 탐구</p>
                </div>
                <div className="concept-item">
                  <strong className="concept-term font-cinzel">Jñāna (즈냐나)</strong>
                  <p className="concept-desc">지식과 앎 — 체계적으로 확인된 이해</p>
                </div>
                <div className="concept-item">
                  <strong className="concept-term font-cinzel">Medhā (메다)</strong>
                  <p className="concept-desc">지적 수용력 — 새로운 이치를 능동적으로 받아들이는 역량</p>
                </div>
                <div className="concept-item">
                  <strong className="concept-term font-cinzel">Buddhi (붓디)</strong>
                  <p className="concept-desc">추론과 지성 — 논리적으로 판별하고 사유하는 고차 지적 힘</p>
                </div>
                <div className="concept-item">
                  <strong className="concept-term font-cinzel">Viveka (비베카)</strong>
                  <p className="concept-desc">분별 — 영원한 것과 덧없는 것, 본질과 껍데기를 가려내는 안목</p>
                </div>
                <div className="concept-item">
                  <strong className="concept-term font-cinzel">Prajñā (프라즈냐)</strong>
                  <p className="concept-desc">지혜와 통찰 — 온전한 섭리를 직관하는 고차원의 지혜</p>
                </div>
                <div className="concept-item highlight-item">
                  <strong className="concept-term font-cinzel">Bodhi (보디)</strong>
                  <p className="concept-desc">깨달음과 각성 — 무명의 어둠을 걷어내고 밝아진 순수한 깨달음</p>
                </div>
              </div>
            </div>

            {/* Latin Roots */}
            <div className="etymology-col">
              <div className="col-header">
                <span className="col-badge font-mono">WESTERN TRADITION</span>
                <h3 className="col-title font-display">라틴어(Latin) 학술적 개념</h3>
              </div>
              <div className="concept-list">
                <div className="concept-item">
                  <strong className="concept-term font-cinzel">Scientia</strong>
                  <p className="concept-desc">지식과 앎 — 경험과 증명을 거쳐 검증된 과학적 체계</p>
                </div>
                <div className="concept-item">
                  <strong className="concept-term font-cinzel">Ingenium</strong>
                  <p className="concept-desc">지적 재능과 창의력 — 타고난 호기심과 기민한 착상</p>
                </div>
                <div className="concept-item">
                  <strong className="concept-term font-cinzel">Intellectus</strong>
                  <p className="concept-desc">이해와 지성 — 복잡한 사물의 원리를 파악하는 지성</p>
                </div>
                <div className="concept-item">
                  <strong className="concept-term font-cinzel">Discretio</strong>
                  <p className="concept-desc">분별과 식별 — 거짓과 참, 조건의 차이를 정확히 구분하는 힘</p>
                </div>
                <div className="concept-item">
                  <strong className="concept-term font-cinzel">Sapientia</strong>
                  <p className="concept-desc">지혜 — 학문과 올바른 판단이 조화를 이룬 고귀한 앎</p>
                </div>
                <div className="concept-item highlight-item">
                  <strong className="concept-term font-cinzel">Illuminatio</strong>
                  <p className="concept-desc">밝힘과 깨우침 — 사유의 정점에서 마침내 비치는 진리의 빛</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: 르네 데카르트의 방법서설 4대 규칙 */}
        <section className="academic-section-card about-block">
          <div className="section-title-wrap">
            <span className="section-kicker font-mono">MATHEMATICAL METHOD</span>
            <h2 className="section-main-title font-display">데카르트의 4대 사유 규칙</h2>
            <p className="section-sub-desc">
              René Descartes: Discours de la méthode (1637) — 수학적 문제 해결의 기초
            </p>
          </div>

          <div className="descartes-rules-grid">
            <div className="rule-card">
              <div className="rule-card-header">
                <span className="rule-roman font-cinzel">I</span>
                <h4 className="rule-name">명증성의 규칙 (Evidence)</h4>
              </div>
              <p className="rule-desc">
                명백하게 참이라고 확인한 것 외에는 어떠한 것도 결코 참으로 받아들이지 않는다. 속단과 편견을 철저히 배제한다.
              </p>
            </div>

            <div className="rule-card">
              <div className="rule-card-header">
                <span className="rule-roman font-cinzel">II</span>
                <h4 className="rule-name">분할의 규칙 (Division)</h4>
              </div>
              <p className="rule-desc">
                검토해야 할 난제를 가능한 한 많은 부분, 문제를 해결하는 데 필요한 작은 단위로 쪼개어 단순화한다.
              </p>
            </div>

            <div className="rule-card">
              <div className="rule-card-header">
                <span className="rule-roman font-cinzel">III</span>
                <h4 className="rule-name">종합의 규칙 (Synthesis)</h4>
              </div>
              <p className="rule-desc">
                가장 단순하고 알기 쉬운 대상부터 시작하여 단계적으로 차례차례 가장 복잡한 문제의 인식에까지 도달한다.
              </p>
            </div>

            <div className="rule-card">
              <div className="rule-card-header">
                <span className="rule-roman font-cinzel">IV</span>
                <h4 className="rule-name">열거의 규칙 (Enumeration)</h4>
              </div>
              <p className="rule-desc">
                아무것도 빠뜨리지 않았다는 확신이 들 때까지 모든 조건과 풀이 과정을 완벽하게 재점검하고 검증한다.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: 튜터 프로필 */}
        <section id="tutor" className="about-block" style={{ marginTop: 40 }}>
          <TutorProfileDisclosure />
        </section>

        {/* Closing Action */}
        <div className="about-closing-action">
          <a href="/#learning-areas" className="about-start-btn">
            <span>🚀 ILLUMIA LAB 학습 영역 둘러보기</span>
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
