import { decodeHwpPua } from './utils/hwpPuaDecoder';

/**
 * Removes source-brand annotations from text that is rendered to learners
 * and decodes any HWP/KICE PUA characters into standard readable math glyphs.
 * Internal catalog IDs are intentionally left unchanged for URL and saved-data compatibility.
 */
/**
 * Removes commercial textbook/brand names from text rendered to learners
 * (e.g. 짱중요한유형, 짱쉬운, 기본정석, 실력정석, 마플, RPM, 쎈 등)
 * and transforms them into authentic CSAT past exam and academic evaluation labels.
 * Also decodes any HWP/KICE PUA characters into standard readable math glyphs.
 */
export function sanitizePublicText(value) {
  if (value === null || value === undefined) return value;

  let text = decodeHwpPua(String(value));

  // 1. Remove bracketed textbook prefixes in question/explanation text
  text = text.replace(/\[\s*(?:기본정석|실력정석|정석|짱중요한유형|짱중요한|짱쉬운|마플|쎈|RPM)[^\]]*\]\s*/g, '');
  text = text.replace(/\*\*\s*\[\s*(?:기본정석|실력정석|정석|짱중요한유형|짱중요한|짱쉬운|마플|쎈|RPM)[^\]]*\]\s*\*\*\s*/g, '');

  // 2. Transform textbook-based sourceLabels into official past exam information
  text = text.replace(/짱중요한유형\s*(?:수학[ⅠⅡI12]|미적분[ⅠⅡ12]|확률과\s*통계|기하와\s*벡터)?\s*/g, '수능·평가원 기출 핵심유형 ');
  text = text.replace(/짱중요한\s*(?:유형)?\s*/g, '수능·평가원 기출 ');
  text = text.replace(/짱쉬운\s*(?:고[123]\s*)?(?:수학(?:\([상하]\))?|미적분[12]?|기하와\s*벡터)?\s*/g, '평가원·학력평가 기출 ');
  text = text.replace(/(?:기본정석|실력정석)\s*(?:수[12]|수학[12ⅠⅡ]|미적분[ⅠⅡ12]?|기하와\s*벡터|적분과\s*통계)?\s*/g, '수능·평가원 기출 유형 ');
  text = text.replace(/마플\s*(?:수능기출)?\s*/g, '수능·평가원 기출 ');

  // 3. Remove standalone brand names and parenthesized brand tags
  text = text.replace(/\s*[（(]\s*(?:RPM|짱쉬운|짱중요한|마더텅|자이스토리|쎈|블랙라벨)\b[^）)]*[）)]/gi, '');
  text = text.replace(/\[\s*(?:RPM|기본문제\s*\(짱쉬운\s*유형별\)|짱쉬운\s*유형별)\s*\]/gi, '[기출 기본]');
  text = text.replace(/\b(?:RPM|쎈|블랙라벨|마더텅|자이스토리)\b/gi, '');

  // 4. Clean extra spaces and punctuation artifacts
  return text
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

