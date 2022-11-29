/**
 * Determine the activity's media content type
 *
 * When isolateBlogs is false, it will return
 * 'rich-embed' for both minds blogs and
 * external links.
 *
 * When collapseReminds is true, it returns the content type of the reminded post
 *
 */
export default function getActivityContentType(
  entity: any,
  isolateBlogs: boolean = false,
  collapseReminds: boolean = false
): 'image' | 'video' | 'rich-embed' | 'status' | 'remind' | 'quote' | 'blog' {
  const e = entity;

  if (
    e.subtype &&
    e.subtype === 'remind' &&
    !collapseReminds &&
    !e.remind_object
  ) {
    return 'remind';
  }
  if (e.remind_object) {
    return 'quote';
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
