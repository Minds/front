export type FileType = 'image' | 'video';

export default function getFileType(file: File): FileType | null {
  return /image\/.+/.test(file.type)
    ? 'image'
    : /video\/.+/.test(file.type)
      ? 'video'
      : null;
}
