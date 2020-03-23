export const createUrlRegex = (): RegExp => {
  return /https?:\/\/([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\s\b]*)?#?([^\s\b]*)?\b/iu;
};
