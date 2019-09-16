/*global Phaser*/
import * as ChangeScene from './ChangeScene.js';
export default class GameOverScene extends Phaser.Scene {
  constructor () {
    super('GameOverScene');
  }

  init (data) {
    // Initialization code goes here
    this.score = data.score;
  }

  preload () {
    // Preload assets
    this.load.image('logo', './assets/logo.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    //Create the scene
    var text = this.add.text(this.centerX - 20, this.centerY, 'Game Over');
    var score = this.add.text(this.centerX - 20, this.centerY + 25, this.score);
  }

  update (time, delta) {
    // Update the scene
  }
}
