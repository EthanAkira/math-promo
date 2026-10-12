// Some applied engines return `choices: [{ value, label, labelEn }]` without `kind`. The algebra,
// coordinate-plane and proportion sheets only draw options for kind === 'choice' with choicesKo / choicesEn
// string lists, so such problems used to show a bare question with no options.
export function asChoiceKind(item) {
  if (!item || item.kind || !Array.isArray(item.choices) || !item.choices.length) return item;
  return {
    ...item,
    kind: 'choice',
    choicesKo: item.choices.map((c) => c.label),
    choicesEn: item.choices.map((c) => c.labelEn || c.label),
  };
}
