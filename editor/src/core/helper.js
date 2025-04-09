function readFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.name.toLowerCase().endsWith(".rrcd")) {
      return reject("Archivo no válido.");
    }
    const read = new FileReader();
    read.onload = () => resolve(JSON.parse(read.result));
    read.onerror = () => reject(read.error);
    read.readAsText(file);
  });
}
