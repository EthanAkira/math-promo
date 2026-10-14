// Item constructors for science worksheets. `answer` is always the exact string shown to the student
// (for mc/fb) or a boolean (tf); sa/dr carry a `model` answer for self-check.
export const mc = (q, choices, answer) => ({ kind: 'mc', q, choices, answer });
export const fb = (q, answer, bank) => ({ kind: 'fb', q, answer, bank });
export const tf = (q, answer) => ({ kind: 'tf', q, answer });
export const sa = (q, model) => ({ kind: 'sa', q, model });
export const dr = (q, model) => ({ kind: 'dr', q, model });
// Cloze passage (workbook-style): wrap each answer in [brackets]; the word box is built from them.
export const cz = (q, text) => ({ kind: 'cz', q, text });
