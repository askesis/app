function encodeImageFileAsURL(file: File, callback: (res: string) => void) {
  const reader = new FileReader();

  reader.onloadend = function () {
    if (typeof reader.result === 'string') {
      callback(reader.result.toString());
    }
  }

  reader.readAsDataURL(file);
}

export default encodeImageFileAsURL