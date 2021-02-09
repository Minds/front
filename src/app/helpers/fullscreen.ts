/**
 * Check if you are in fullscreen mode
 */
export default function isFullscreen(): boolean {
  if (
    !document['fullscreenElement'] &&
    !document['webkitFullscreenElement'] &&
    !document['mozFullScreenElement'] &&
    !document['msFullscreenElement']
  ) {
    return false;
  } else {
    return true;
  }
}

/**
 * Toggles fullscreen and returns the new fullscreen enabled state
 *
 * @param el the element you want to go into fullscreen mode
 */
export function toggleFullscreen(el: Element): boolean {
  // If fullscreen is not already enabled, enable it
  if (!isFullscreen()) {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el['webkitRequestFullscreen']) {
      el['webkitRequestFullscreen']();
    } else if (el['mozRequestFullScreen']) {
      el['mozRequestFullScreen']();
    } else if (el['msRequestFullscreen']) {
      el['msRequestFullscreen']();
    } else {
      console.error('The selected element cannot go into fullscreen mode');
      return false;
    }
    return true;
  } else {
    // If you're already in fullscreen, exit it
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document['webkitExitFullscreen']) {
      document['webkitExitFullscreen']();
    } else if (document['mozCancelFullScreen']) {
      document['mozCancelFullScreen']();
    } else if (document['msExitFullscreen']) {
      document['msExitFullscreen']();
    } else {
      console.error(
        'Your browser/document does not have exitFullscreen capabilities'
      );
      return true;
    }
    return false;
  }
}
