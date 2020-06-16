export default function parseHashtagsFromString(value: string): Array<string> {
  const tags = [];
  const regex = /(^|\s||)#(\w+)/gim;
  let match;
  while ((match = regex.exec(value) !== null)) {
    tags.push(match);
  }

  return tags;
}
