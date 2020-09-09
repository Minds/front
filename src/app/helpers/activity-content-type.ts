/**
 * Determine the activity's media content type
 *
 * When isolateBlogs is false, it will return
 * 'rich-embed' for both minds blogs and
 * external links.
 */
export default function getActivityContentType(
  entity: any,
  isolateBlogs: boolean = false
): 'image' | 'video' | 'rich-embed' | 'status' | 'remind' | 'blog' {
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
    if (isolateBlogs && (e.entity_guid || e.subtype === 'blog')) {
      return 'blog';
    }
    return 'rich-embed';
  }

  return 'status';
}
