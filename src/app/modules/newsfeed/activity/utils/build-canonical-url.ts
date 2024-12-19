import { ActivityEntity } from '../activity.service';

const buildCanonicalUrl = (
  siteUrl: string,
  entity: ActivityEntity,
  full: boolean
): string => {
  let guid = entity.entity_guid || entity.guid;
  // use the entity guid for media quotes
  if (entity.remind_object && entity.entity_guid) {
    guid = entity.guid;
  }
  const prefix = full ? siteUrl : '/';
  return `${prefix}newsfeed/${guid}`;
};

export default buildCanonicalUrl;
