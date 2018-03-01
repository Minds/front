export default function mediaProxyUrl(url, size = 1920) {
  if (!url || url.indexOf('http') !== 0) {
    return url;
  }

  const encodedUrl = encodeURIComponent(url);

  return `${window.Minds.cdn_url}api/v2/media/proxy?size=${size}&src=${encodedUrl}`;
}
