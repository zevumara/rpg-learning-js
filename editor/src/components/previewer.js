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
    this.scales = [1, 2, 3];
    this.indexFrame = 0;
    this.indexZoom = 0;
    this.pixi = null;
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
    const container = this.querySelector(".previewer");
    this.pixi = new PIXI.Application();
    await this.pixi.init({
      backgroundAlpha: 0,
    });
    container.appendChild(this.pixi.canvas);

    const texture = await PIXI.Assets.load("/test/$Alex.png");
    const character = new CharacterSprite(texture);
    this.pixi.stage.addChild(character);
    character.anchor.set(0.5);
    character.x = this.pixi.screen.width / 2;
    character.y = this.pixi.screen.height / 2;
    character.setDirection("left");

    // Mostrar un frame estático (por ejemplo, el segundo frame hacia arriba)
    character.setDirection("up");
    character.setFrame(1);

    // O volver a animar
    character.playAnimation("right");
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
        });
      })
    );
    this.register(
      this.signal.zoom.onChange((value) => {
        Batcher.run(() => {
          // console.log("zoom:", value);
        });
      })
    );
  }

  prevFrame() {
    if (this.active) {
      this.indexFrame =
        (this.indexFrame - 1 + this.frames[this.type].length) % this.frames[this.type].length;
      this.signal.frame.value = this.frames[this.type][this.indexFrame];
    }
  }

  nextFrame() {
    if (this.active) {
      this.indexFrame = (this.indexFrame + 1) % this.frames[this.type].length;
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
