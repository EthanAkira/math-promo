// AMC archive manifest.
//
// To add a year's materials:
//   1. Drop the files under public/amc/<level>/<year>/<variant>/ — e.g.
//      public/amc/10/2023/A/problems.pdf, .../solutions.pdf, .../answers.pdf
//      (AMC 8 has no A/B split, so use a single variant id like 'AMC8'.)
//   2. Add an entry below pointing at those paths (paths are relative to /public,
//      so the file above is referenced as '/amc/10/2023/A/problems.pdf').
//   3. Each variant's `files` object may include any of: problems, solutions,
//      answers — omit a key if that file isn't available yet.

function file(url, label) {
  return { url, label };
}

export const AMC_ARCHIVE = {
  8: [
    // { year: 2023, variants: [{ id: 'AMC8', label: 'AMC 8', files: {
    //   problems: file('/amc/8/2023/problems.pdf', '2023 AMC 8 문제지'),
    //   solutions: file('/amc/8/2023/solutions.pdf', '2023 AMC 8 해설지'),
    //   answers: file('/amc/8/2023/answers.pdf', '2023 AMC 8 정답지'),
    // } }] },
  ],
  10: [
    // { year: 2023, variants: [
    //   { id: 'A', label: 'AMC 10A', files: { problems: file('/amc/10/2023/A/problems.pdf', '2023 AMC 10A 문제지') } },
    //   { id: 'B', label: 'AMC 10B', files: { problems: file('/amc/10/2023/B/problems.pdf', '2023 AMC 10B 문제지') } },
    // ] },
  ],
  12: [],
};

export function fileKind(url) {
  const ext = url.split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'txt') return 'txt';
  return 'file';
}
