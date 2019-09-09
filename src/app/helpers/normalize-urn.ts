export default function normalizeUrn(urnOrGuid: string) {
  if (!isNaN(<any>urnOrGuid)) {
    urnOrGuid = `urn:entity:${urnOrGuid}`;
  } else if (urnOrGuid.indexOf('urn:') !== 0) {
    console.warn(`Invalid URN: ${urnOrGuid}`);
  }

  return urnOrGuid;
}
