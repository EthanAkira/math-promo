import { SiteFooter, SiteHeader } from '../../components';
import { CURRICULUM_ENGINE_AUDIT } from '../../curriculumEngineAudit';
import { assertCurriculumSeedValidation } from '../../curriculumValidation';
import CurriculumEvidenceAdmin from './CurriculumEvidenceAdmin';

export const metadata = {
  title: '교육과정 문제군 증거 관리 | 매일 배움 연구소',
  robots: { index: false, follow: false },
};

export default function CurriculumEvidenceAdminPage() {
  const validation = assertCurriculumSeedValidation(100);
  const validationSummary = {
    status: validation.status,
    seedCountPerSubject: validation.seedCountPerSubject,
    subjectCount: validation.subjectCount,
    passedSubjectCount: validation.passedSubjectCount,
    failedSubjectCount: validation.failedSubjectCount,
    generatedCount: validation.generatedCount,
  };
  const engineSummary = {
    profileCount: CURRICULUM_ENGINE_AUDIT.profiles.length,
    preAlgebraUnits: CURRICULUM_ENGINE_AUDIT.engines['pre-algebra'].length,
    geometryUnits: CURRICULUM_ENGINE_AUDIT.engines['basic-figures'].length,
    hiddenDrafts: CURRICULUM_ENGINE_AUDIT.disconnectedDrafts.length,
  };
  return <><SiteHeader /><main style={{ maxWidth: 980, margin: '0 auto', padding: '40px 20px 64px' }}><CurriculumEvidenceAdmin validationSummary={validationSummary} engineSummary={engineSummary} /></main><SiteFooter /></>;
}
