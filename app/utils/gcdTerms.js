// Worksheet expressions are authored in Korean ("최대공약수(12, 18)"). For every other language show the
// terminology used in US / international-school math instead: GCF (not "gcd") and LCM.
export function localizeGcdTerms(text, language) {
  if (typeof text !== 'string' || language === 'ko') return text;
  return text.replace(/최대공약수/g, 'GCF').replace(/최소공배수/g, 'LCM');
}
