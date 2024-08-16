/** Error strings and regex to be ignored by Sentry. */
export const SENTRY_IGNORED_ERRORS: Array<string | RegExp> = [
  /request was interrupted by a call to/i,
  /executing a cancelled action/i,
  /AbortError: The fetching process for the media resource/i,
  /AbortError: The operation was aborted./i,
  /AbortError: The play\(\) request was interrupted by a new load request./i,
  /NotAllowedError: play\(\) can only be initiated by a user gesture./i,
  /Recognizer.noMatchError/i,
  'RangeError',
];
