import { G1_CONTENT } from './g1';
import { G2_CONTENT } from './g2';

// unitId -> { intro, lessons[] }. Units without an entry show the upload board only.
export const SCIENCE_CONTENT = { ...G1_CONTENT, ...G2_CONTENT };

export const contentOf = (unitId) => SCIENCE_CONTENT[unitId] || null;
