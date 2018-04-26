export default function base64ToBlob(encodedString: string): Blob {
  const byteString = atob(encodedString);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const byteArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([ arrayBuffer ]);
}
