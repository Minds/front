import { ActivityEntity } from '../modules/newsfeed/activity/activity.service';

/**
 * Prepares an image activity's auto_caption to be used for SEO purposes
 * by removing the nsfw prompt response
 * (i.e. the second prompt response in the list of three)
 *
 * If index is provided, prepare the caption for the
 * specified image in a multi image post
 */
export default function getMetaAutoCaption(
  activity: ActivityEntity,
  index = 0
): string {
  if (!activity.auto_caption) {
    return;
  }

  const responsesPerImage = 3;
  const startingIndex = 0 + index * responsesPerImage;
  let captionsArray = activity.auto_caption.split(';');

  // Get rid of extraneous responses
  // (e.g. for other images in a multi-image post)
  captionsArray.splice(startingIndex, startingIndex + 3);

  // Remove the second ai prompt response
  if (captionsArray[1]) {
    captionsArray.splice(1, 1);
  }

  return captionsArray.toString().trim();
}
