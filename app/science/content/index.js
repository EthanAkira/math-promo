import { G1_CONTENT } from './g1';
import { G2_CONTENT } from './g2';
import { G3_CONTENT } from './g3';

// unitId -> { intro, lessons[] }. Units without an entry show the upload board only.
export const SCIENCE_CONTENT = { ...G1_CONTENT, ...G2_CONTENT, ...G3_CONTENT };

export const contentOf = (unitId) => SCIENCE_CONTENT[unitId] || null;
