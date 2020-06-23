/**
 * Determine the activity's media content type
 */
export default function getActivityContentType(
  entity
): 'image' | 'video' | 'rich-embed' | 'status' | 'remind' {
  const e = entity;
  if (e.remind_object) {
    return 'remind';
  }
  if (e.custom_type && e.custom_type === 'video') {
    return 'video';
  }
  if (e.custom_type && e.custom_type === 'batch') {
    return 'image';
  }
  if (e.perma_url) {
    return 'rich-embed';
  }

  return 'status';
}
