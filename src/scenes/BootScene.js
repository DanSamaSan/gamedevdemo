/*globals Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("sky", "./assets/sprites/sky.png");
    this.load.image("ground", "./assets/sprites/platform.png");
    this.load.image("acorn", "./assets/sprites/acorn.png");
    this.load.spritesheet("dude", "./assets/sprites/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
    //Add change scene event listeners
    ChangeScene.addSceneEventListeners(this);

    this.player;
    this.acorns;
    var platforms;
    this.cursors;
    this.score = 0;
    this.gameOver = false;
    this.scoreText;

    //  A simple background for our game
    this.add.image(400, 300, "sky");

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms
      .create(400, 568, "ground")
      .setScale(2)
      .refreshBody();

    // The player and its settings
    this.player = this.physics.add.sprite(400, 510, "dude");

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    //Set gravity of this scene
    this.physics.world.gravity.y = 300;

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    //  random acorn to collect
    this.acorns = this.physics.add.group({
      key: "acorn",
      setXY: { x: Phaser.Math.Between(12, 700), y: 0 }
    });

    //  The score
    this.scoreText = this.add.text(16, 500, "Score: 0", {
      fontSize: "32px",
      fill: "#000"
    });

    //  Collide the player and the acorns with the platforms
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.acorns, platforms, this.acornFall, null, this);

    //  Checks to see if the player overlaps with any of the acorns, if he does call the collectAcorn function
    this.physics.add.overlap(
      this.player,
      this.acorns,
      this.collectAcorn,
      null,
      this
    );

  }

  update() {
    if (this.gameOver) {
      this.scene.start('GameOverScene', { score: this.score });
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  collectAcorn(player, acorn) {
    acorn.disableBody(true, true);

    //  Add and update the score
    this.score += 1;
    this.scoreText.setText("Score: " + this.score);

    if (this.acorns.countActive(true) === 0) {
      // A new batch of acorns to collect
      this.acorns.children.iterate(function(child) {
        child.enableBody(true, Phaser.Math.Between(12, 700), 0, true, true);
      });
    }
  }

  acornFall(acorn, platform){
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.play("turn");
    this.gameOver = true;
  }
}
