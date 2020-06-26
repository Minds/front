export const deepDiff = (prev, curr) =>
  JSON.stringify(prev) === JSON.stringify(curr);
