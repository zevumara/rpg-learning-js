class CharacterSprite extends PIXI.AnimatedSprite {
  constructor(
    baseTexture,
    {
      frameWidth = 24,
      frameHeight = 24,
      directions = ["down", "left", "right", "up"],
      framesPerDirection = 3,
      animationSpeed = 0.15,
    } = {}
  ) {
    const animations = CharacterSprite._splitSheet(baseTexture, {
      frameWidth,
      frameHeight,
      directions,
      framesPerDirection,
    });

    super(animations.down);
    this.animations = animations;
    this.animationSpeed = animationSpeed;
    this.anchor.set(0.5);
    this.play();
  }

  static _splitSheet(baseTexture, { frameWidth, frameHeight, directions, framesPerDirection }) {
    const animations = {};
    for (let dir = 0; dir < directions.length; dir++) {
      const name = directions[dir];
      animations[name] = [];
      for (let frame = 0; frame < framesPerDirection; frame++) {
        const rect = new PIXI.Rectangle(
          frame * frameWidth,
          dir * frameHeight,
          frameWidth,
          frameHeight
        );
        animations[name].push(new PIXI.Texture(baseTexture, rect));
      }
    }
    return animations;
  }

  setDirection(dir) {
    if (!this.animations[dir]) return console.warn(`Dirección inválida: ${dir}`);
    this.textures = this.animations[dir];
    this.play();
  }

  setFrame(index) {
    this.gotoAndStop(index % this.textures.length);
  }

  playAnimation(dir) {
    this.setDirection(dir);
    this.play();
  }
}

function generateRpgMakerAtlas({
  name = "hero",
  frameWidth = 48,
  frameHeight = 48,
  directions = ["down", "left", "right", "up"],
  framesPerDirection = 3,
  imagePath,
}) {
  const frames = {};
  const animations = {};

  for (let dir = 0; dir < directions.length; dir++) {
    const directionName = directions[dir];
    const animFrames = [];

    for (let frame = 0; frame < framesPerDirection; frame++) {
      const frameName = `${name}_${directionName}_${frame}`;
      animFrames.push(frameName);

      frames[frameName] = {
        frame: {
          x: frame * frameWidth,
          y: dir * frameHeight,
          w: frameWidth,
          h: frameHeight,
        },
        sourceSize: { w: frameWidth, h: frameHeight },
        spriteSourceSize: { x: 0, y: 0, w: frameWidth, h: frameHeight },
      };
    }

    animations[directionName] = animFrames;
  }

  return {
    frames,
    animations,
    meta: {
      image: imagePath,
      format: "RGBA8888",
      size: { w: frameWidth * framesPerDirection, h: frameHeight * directions.length },
      scale: "1",
    },
  };
}
