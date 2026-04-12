// Fuzzy text matching for typed answers
// Handles: case, accents, typos, multiple valid answers (a / b)

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = []
  for (let i = 0; i <= b.length; i++) matrix[i] = [i]
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  return matrix[b.length][a.length]
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/\s+/g, ' ')
}

export type MatchResult = 'exact' | 'close' | 'wrong'

export function checkAnswer(input: string, correctAnswer: string): MatchResult {
  const normalInput = normalize(input)

  // Handle multiple valid answers separated by /
  const validAnswers = correctAnswer.split('/').map(a => normalize(a.trim()))

  // Check exact match (after normalization)
  for (const answer of validAnswers) {
    if (normalInput === answer) return 'exact'
  }

  // Check close match (small typos allowed)
  for (const answer of validAnswers) {
    const maxDistance = answer.length <= 3 ? 0 : answer.length <= 6 ? 1 : 2
    if (levenshtein(normalInput, answer) <= maxDistance) return 'close'
  }

  return 'wrong'
}

export function getHint(word: string, revealCount: number): string {
  const chars = word.split('')
  return chars
    .map((c, i) => (i < revealCount || c === ' ' ? c : '_'))
    .join(' ')
}

export function maskWordInSentence(sentence: string, word: string): { before: string; after: string } | null {
  // Find the word in the sentence (case-insensitive)
  const lower = sentence.toLowerCase()
  const wordLower = word.toLowerCase().split(' ')[0] // Use first word for multi-word entries

  const idx = lower.indexOf(wordLower)
  if (idx === -1) return null

  // Find word boundary
  let end = idx + wordLower.length
  while (end < sentence.length && sentence[end] !== ' ' && sentence[end] !== ',' && sentence[end] !== '.') {
    end++
  }

  return {
    before: sentence.slice(0, idx),
    after: sentence.slice(end),
  }
}
