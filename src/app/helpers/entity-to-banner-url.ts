export default function entityToBannerUrl(
  entity: { guid: string; banner?: any; icontime?: any } | null,
  sizeOrTop: string | number = 'fat'
): string {
  if (!entity) {
    return '';
  }
  return '';
}
