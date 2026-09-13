import React from 'react';

export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export function HighlightText({ text, query }: { text: string; query: string }) {
  if (!text) return null;
  if (!query || !query.trim()) return <>{text}</>;

  const terms: string[] = [];
  const exactMatches = query.match(/"([^"]+)"/g);
  let workingQuery = query;

  if (exactMatches) {
    exactMatches.forEach(m => {
      const inner = m.replace(/"/g, '').trim();
      if (inner) terms.push(inner);
      workingQuery = workingQuery.replace(m, ' ');
    });
  }

  workingQuery.split(/\s+/).forEach(word => {
    if (!word) return;
    if (word.startsWith('-')) return;
    if (word.startsWith('#')) {
      const tagWord = word.slice(1).trim();
      if (tagWord) terms.push(tagWord);
    } else {
      terms.push(word);
    }
  });

  if (terms.length === 0) return <>{text}</>;

  const escapedPattern = terms
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const splitRegex = new RegExp(`(${escapedPattern})`, 'gi');
  const matchRegex = new RegExp(`^(${escapedPattern})$`, 'i');

  const parts = text.split(splitRegex);

  return (
    <>
      {parts.map((part, i) => (
        matchRegex.test(part) ? (
          <mark key={i} className="bg-emerald-100 text-emerald-900 rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      ))}
    </>
  );
}
