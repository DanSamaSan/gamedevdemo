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

    //  Now let's create some ledges
    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");

    // The player and its settings
    this.player = this.physics.add.sprite(100, 450, "dude");

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    //Set gravity of this scene
    this.physics.world.gravity.y = 400;

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

    //  Some acorns to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    this.acorns = this.physics.add.group({
      key: "acorn",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.acorns.children.iterate(function(child) {
      //  Give each acorn a slightly different bounce
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    //  The score
    this.scoreText = this.add.text(16, 500, "Score: 0", {
      fontSize: "32px",
      fill: "#000"
    });

    //  Collide the player and the acorns with the platforms
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.acorns, platforms);

    //  Checks to see if the player overlaps with any of the acorns, if he does call the collectAcorn function
    this.physics.add.overlap(
      this.player,
      this.acorns,
      this.collectAcorn,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
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
      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

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
      //  A new batch of acorns to collect
      this.acorns.children.iterate(function(child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

    }
  }


}
