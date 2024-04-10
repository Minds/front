export const MAX_HASH_LENGTH = 8;

function dths(number: number, padding: number = 0): string {
  if (number < 0) {
    number = 0xffffffff + number + 1;
  }

  return number.toString(16).toLowerCase().padStart(padding, '0');
}

/**
 * Based on: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
export function stringHash(str: string) {
  let hash = 0;

  if (str.length > 0) {
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);

      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
  }

  return dths(hash, MAX_HASH_LENGTH);
}

export default function hashCode(str: string, precisionChunks: number = 4) {
  const paddedStr = str.padStart(precisionChunks, ' ');
  const chunkLength = Math.ceil(paddedStr.length / precisionChunks);

  const hashCode = [stringHash(paddedStr)];

  for (let i = 0; i < precisionChunks; i++) {
    hashCode.push(stringHash(paddedStr.substr(i * chunkLength, chunkLength)));
  }

  return hashCode.join('-');
}
