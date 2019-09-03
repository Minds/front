import normalizeUrn from './normalize-urn';

export default function getGuidFromUrn(urnOrGuid: string) {
  const urn = normalizeUrn(urnOrGuid).split(':');
  return urn[2] || null;
}
