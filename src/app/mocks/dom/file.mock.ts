export default function fileMock(type = 'image/jpg'): File {
  const blob = new Blob([''], { type });
  blob['lastModifiedDate'] = '';
  blob['name'] = type.replace(/\//g, '.');

  return blob as File;
}
