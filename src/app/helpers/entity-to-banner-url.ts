export default function entityToBannerUrl(
  entity: {
    guid: string;
    banner?: any;
    icontime?: any;
    carousels?: any[] | boolean;
  } | null,
  sizeOrTop: string | number = 'fat'
): string {
  if (!entity) {
    return '';
  }

  if (entity.carousels && entity.carousels[0]) {
    return entity.carousels[0].src + (entity.banner || entity.icontime);
  }

  return `fs/v1/banners/${entity.guid}/${sizeOrTop}/${entity.banner ||
    entity.icontime}`;
}
