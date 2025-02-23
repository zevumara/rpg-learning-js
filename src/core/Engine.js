class Engine {
  static async initialize() {
    console.log("Motor iniciado");
    Graphics.initialize();
    SceneManager.initialize();
  }
}

// SceneManager.js - Manejo de escenas
class SceneManager {
  static initialize() {
    console.log("SceneManager iniciado");
    this.currentScene = null;
  }

  static changeScene(newScene) {
    if (this.currentScene) {
      this.currentScene.destroy();
    }
    this.currentScene = new newScene();
  }
}

window.onload = () => {
  Engine.initialize();
};

class Graphics {
  static initialize() {
    console.log("Gráficos iniciados");
    this._width = 800;
    this._height = 600;
    this._defaultScale = 1;
    this._realScale = 1;
    this._canvas = null;
    this._fpsCounter = null;
    this._app = null;
    this._tickHandler = null;
    this.frameCount = 0;
    this._createAllElements();
    this._createPixiApp();
  }

  static _createAllElements() {}

  static _updateCanvas() {
    this._canvas.width = this._width;
    this._canvas.height = this._height;
    this._canvas.style.zIndex = 11;
    this._centerElement(this._canvas);
  }

  static _centerElement(element) {
    const width = element.width * this._realScale;
    const height = element.height * this._realScale;
    element.style.position = "absolute";
    element.style.margin = "auto";
    element.style.top = 0;
    element.style.left = 0;
    element.style.right = 0;
    element.style.bottom = 0;
    element.style.width = width + "px";
    element.style.height = height + "px";
  }

  static async _createPixiApp() {
    try {
      this._app = new PIXI.Application();
      await this._app.init({
        autoStart: false,
        sharedTicker: true,
        background: "#1099bb",
      });
      document.body.appendChild(this._app.canvas);
      this._canvas = this._app.canvas;
      this._updateCanvas();
    } catch (e) {
      console.error(e);
      this._app = null;
    }
  }

  static resize(width, height) {
    this._width = width;
    this._height = height;
  }
}
