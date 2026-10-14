import { G1_CONTENT } from './g1';
import { G2_CONTENT } from './g2';
import { G3_CONTENT } from './g3';
import { G4_CONTENT } from './g4';
import { G5_CONTENT } from './g5';
import { G6_CONTENT } from './g6';
import { G1_MORE } from './g1_more';
import { G3_MORE } from './g3_more';
import { G4_MORE } from './g4_more';
import { G5_MORE, G6_MORE } from './g5g6_more';

// unitId -> { intro, lessons[] }. Units without an entry show the upload board only.
// *_MORE files fill the topics that none of the owned textbooks covered (written from NGSS /
// Cambridge Primary scope, original wording).
export const SCIENCE_CONTENT = {
  ...G1_CONTENT, ...G2_CONTENT, ...G3_CONTENT, ...G4_CONTENT, ...G5_CONTENT, ...G6_CONTENT,
  ...G1_MORE, ...G3_MORE, ...G4_MORE, ...G5_MORE, ...G6_MORE,
};

export const contentOf = (unitId) => SCIENCE_CONTENT[unitId] || null;
