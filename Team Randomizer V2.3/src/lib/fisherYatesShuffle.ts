/**
 * Fisher-Yates (Knuth) Shuffle Algorithm
 * Provides an unbiased random permutation of an array
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Divide names into N groups as evenly as possible
 * Extra members are distributed to the first groups
 */
export function divideIntoGroups(names: string[], numGroups: number): string[][] {
  const shuffled = fisherYatesShuffle(names);
  const groups: string[][] = Array.from({ length: numGroups }, () => []);
  
  shuffled.forEach((name, index) => {
    groups[index % numGroups].push(name);
  });
  
  return groups;
}
