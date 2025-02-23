const filesToLoad = ["src/core/pixi.js", "src/core/Engine.js"];

class Main {
  constructor() {
    this.xhrSucceeded = false;
    this.loadedFiles = 0;
    this.error = null;
  }

  run() {
    this.showLoadingSpinner();
    this.testXhr();
    this.hookNwjsClose();
    this.loadFiles();
  }

  showLoadingSpinner() {
    const loadingSpinner = document.createElement("div");
    const loadingSpinnerImage = document.createElement("div");
    loadingSpinner.id = "loadingSpinner";
    loadingSpinnerImage.id = "loadingSpinnerImage";
    loadingSpinner.appendChild(loadingSpinnerImage);
    document.body.appendChild(loadingSpinner);
  }

  eraseLoadingSpinner() {
    const loadingSpinner = document.getElementById("loadingSpinner");
    if (loadingSpinner) {
      document.body.removeChild(loadingSpinner);
    }
  }

  testXhr() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", document.currentScript.src);
    xhr.onload = () => (this.xhrSucceeded = true);
    xhr.send();
  }

  hookNwjsClose() {
    if (typeof nw === "object") {
      nw.Window.get().on("close", () => nw.App.quit());
    }
  }

  loadFiles() {
    for (const url of filesToLoad) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      script.async = false;
      script.defer = true;
      script.onload = this.onFileLoad.bind(this);
      script.onerror = this.onFileError.bind(this);
      script._url = url;
      document.body.appendChild(script);
    }
    this.totalFiles = filesToLoad.length;
    window.addEventListener("load", this.onWindowLoad.bind(this));
    window.addEventListener("error", this.onWindowError.bind(this));
  }

  onFileLoad() {
    if (++this.loadedFiles === this.totalFiles) {
      console.warn("All files are loaded. Loading plugins...");
    }
  }

  onFileError(e) {
    this.printError("Failed to load", e.target._url);
  }

  printError(name, message) {
    this.eraseLoadingSpinner();
    if (!document.getElementById("errorPrinter")) {
      const errorPrinter = document.createElement("div");
      errorPrinter.id = "errorPrinter";
      errorPrinter.innerHTML = this.makeErrorHtml(name, message);
      document.body.appendChild(errorPrinter);
    }
  }

  makeErrorHtml(name, message) {
    const nameDiv = document.createElement("div");
    const messageDiv = document.createElement("div");
    nameDiv.id = "errorName";
    messageDiv.id = "errorMessage";
    nameDiv.innerHTML = name;
    messageDiv.innerHTML = message;
    return nameDiv.outerHTML + messageDiv.outerHTML;
  }

  onWindowLoad() {
    if (!this.xhrSucceeded) {
      const message = "Your browser does not allow to read local files.";
      this.printError("Error", message);
    } else if (this.error) {
      this.printError(this.error.name, this.error.message);
    }
  }

  onWindowError(event) {
    if (!this.error) {
      this.error = event.error;
    }
  }
}

const main = new Main();
main.run();
