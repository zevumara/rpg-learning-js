class PreviewerComponent extends Component {
  constructor() {
    super();
    this.active = false;
    this.type = null;
    this.frames = {
      character: ["Up", "Right", "Down", "Left"],
      battler: ["Attack", "Idle", "Win", "Lose"],
      face: ["Normal", "Happy", "Angry", "Boring"],
    };
    this.scales = [2, 3, 4, 5, 6, 7, 8];
    this.indexFrame = 2;
    this.indexZoom = 3;
    this.pixi = null;
    this.composition = null;
    this.layers = [];
  }

  onLoad() {
    this.type = this.getAttribute("type");
    this.setSignal({
      frame: this.frames[this.type][this.indexFrame],
      zoom: this.scales[this.indexZoom],
    });
    this.querySelector(".type").textContent = `${this.type}: `;
    this.querySelector(".previewer").addEventListener("click", (event) => {
      if (UI.editing.value !== this.type) {
        UI.editing.value = this.type;
      }
    });
  }

  onReady() {
    this.setupPIXI();
  }

  async setupPIXI() {
    this.pixi = new PIXI.Application();
    await this.pixi.init({ backgroundAlpha: 0 });
    this.composition = new PIXI.Container();

    const container = this.querySelector(".previewer");
    container.appendChild(this.pixi.canvas);

    const texture = await PIXI.Assets.load("/test/$Alex.png");
    const layerBody = await Sprite.fromSpriteSheet({
      texture: texture,
      frameWidth: 24,
      frameHeight: 24,
      states: ["down", "left", "right", "up"],
      framesPerState: 3,
      name: "char",
      pingpong: true,
    });
    this.layers.push(layerBody);
    this.composition.addChild(layerBody);
    this.composition.scale.set(5);
    this.composition.position.set(this.pixi.screen.width / 2, this.pixi.screen.height / 2);
    this.composition.pivot.set(0, 4);
    this.pixi.stage.addChild(this.composition);
    container.classList.add("loaded");
  }

  effects() {
    this.register(
      UI.editing.onChange((value) => {
        Batcher.run(() => {
          if (value === this.type) {
            this.querySelector(".previewer").classList.add("active");
            this.active = true;
          } else {
            this.querySelector(".previewer").classList.remove("active");
            this.active = false;
          }
        });
      })
    );
    this.register(
      this.signal.frame.onChange((value) => {
        Batcher.run(() => {
          this.querySelector(".name").textContent = value;
          for (const layer of this.layers) {
            layer.setState(value.toLowerCase());
          }
        });
      })
    );
    this.register(
      this.signal.zoom.onChange((value) => {
        Batcher.run(() => {
          this.composition?.scale.set(value);
        });
      })
    );
  }

  prevFrame() {
    if (this.active) {
      this.indexFrame = (this.indexFrame + 1) % this.frames[this.type].length;
      this.signal.frame.value = this.frames[this.type][this.indexFrame];
    }
  }

  nextFrame() {
    if (this.active) {
      this.indexFrame =
        (this.indexFrame - 1 + this.frames[this.type].length) % this.frames[this.type].length;
      this.signal.frame.value = this.frames[this.type][this.indexFrame];
    }
  }

  zoomIn() {
    if (this.active && this.indexZoom + 1 < this.scales.length) {
      this.indexZoom++;
      this.signal.zoom.value = this.scales[this.indexZoom];
    }
  }

  zoomOut() {
    if (this.active) {
      if (this.active && this.indexZoom - 1 >= 0) {
        this.indexZoom--;
        this.signal.zoom.value = this.scales[this.indexZoom];
      }
    }
  }

  render() {
    return html`
      <div class="previewer">
        <ul class="controls">
          <li class="frame"><span class="type"></span> <span class="name"></span></li>
          <li class="button" @click="prevFrame">
            <svg width="32" height="32" viewBox="0 0 256 256">
              <path
                d="M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z"
              />
            </svg>
          </li>
          <li class="button" @click="nextFrame">
            <svg width="32" height="32" viewBox="0 0 256 256">
              <path
                d="m181.66 133.66l-80 80a8 8 0 0 1-11.32-11.32L164.69 128L90.34 53.66a8 8 0 0 1 11.32-11.32l80 80a8 8 0 0 1 0 11.32"
              />
            </svg>
          </li>
          <li class="button" @click="zoomIn">
            <svg width="32" height="32" viewBox="0 0 256 256">
              <path
                d="M224 128a8 8 0 0 1-8 8h-80v80a8 8 0 0 1-16 0v-80H40a8 8 0 0 1 0-16h80V40a8 8 0 0 1 16 0v80h80a8 8 0 0 1 8 8"
              />
            </svg>
          </li>
          <li class="button" @click="zoomOut">
            <svg width="32" height="32" viewBox="0 0 256 256">
              <path d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8" />
            </svg>
          </li>
        </ul>
      </div>
    `;
  }
}

customElements.define("previewer-component", PreviewerComponent);
