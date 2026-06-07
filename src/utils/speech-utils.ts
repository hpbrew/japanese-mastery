export function normalizeSpeechText(value: string) {
  return value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    // .replace(/[^\p{ L }\p{ N }\s]/gu, '')
    .trim()
    .toLowerCase();
}

export function levenshteinDistance(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j += 1) {
    if (matrix[0] && matrix[0][j]) {
      matrix[0][j] = j
    }
  }

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + substitutionCost,
      );
    }
  }

  return matrix[a.length][b.length];
}

export function similarityScore(a: string, b: string) {
  const normalizedA = normalizeSpeechText(a);
  const normalizedB = normalizeSpeechText(b);

  if (!normalizedA || !normalizedB) {
    return 0;
  }

  const distance = levenshteinDistance(normalizedA, normalizedB);
  if (typeof distance === 'undefined') {
    return 0;
  }
  return 1 - distance / Math.max(normalizedA.length, normalizedB.length);
}
