class Character extends PIXI.AnimatedSprite {
  constructor(animations) {
    super(animations.down);
    this.animations = animations;
    this.animationSpeed = 0.1;
    this.anchor.set(0.5);
    this.play();
  }

  setState(state) {
    if (!this.animations[state]) return console.error(`Animación no encontrada: ${state}`);
    this.textures = this.animations[state];
    this.play();
  }

  setFrame(index) {
    this.gotoAndStop(index % this.textures.length);
  }

  static async fromSpriteSheet({
    texture,
    frameWidth = 24,
    frameHeight = 24,
    states = [],
    framesPerState = 3,
    name = "spr",
    pingpong = false,
  }) {
    const atlasData = Character._generateAtlas({
      texture,
      frameWidth,
      frameHeight,
      states,
      framesPerState,
      name,
      pingpong,
    });
    texture.baseTexture.scaleMode = "nearest";
    const spritesheet = new PIXI.Spritesheet(texture, atlasData);
    await spritesheet.parse();

    return new Character(spritesheet.animations);
  }

  static _generateAtlas({
    texture,
    frameWidth,
    frameHeight,
    states,
    framesPerState,
    name,
    pingpong = false,
  }) {
    const frames = {};
    const animations = {};

    for (let state = 0; state < states.length; state++) {
      const stateName = states[state];
      const baseFrameNames = [];

      for (let frame = 0; frame < framesPerState; frame++) {
        const frameName = `${name}_${stateName}_${frame}`;
        baseFrameNames.push(frameName);

        frames[frameName] = {
          frame: {
            x: frame * frameWidth,
            y: state * frameHeight,
            w: frameWidth,
            h: frameHeight,
          },
          sourceSize: { w: frameWidth, h: frameHeight },
          spriteSourceSize: { x: 0, y: 0, w: frameWidth, h: frameHeight },
        };
      }

      animations[stateName] = pingpong
        ? [baseFrameNames[0], baseFrameNames[1], baseFrameNames[2], baseFrameNames[1]]
        : baseFrameNames;
    }

    return {
      frames,
      animations,
      meta: {
        texture,
        format: "RGBA8888",
        size: { w: frameWidth * framesPerState, h: frameHeight * states.length },
        scale: "1",
      },
    };
  }
}
