export type FileType = 'image' | 'video' | 'audio';

export default function getFileType(file: File): FileType | null {
  return /image\/.+/.test(file.type)
    ? 'image'
    : /audio\/.+/.test(file.type)
      ? 'audio'
      : /video\/.+/.test(file.type)
        ? 'video'
        : null;
}
