
class Game {
  constructor (game) {
    // When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game      //  a reference to the currently running game (Phaser.Game)
    this.add       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera    //  a reference to the game camera (Phaser.Camera)
    this.cache     //  the game cache (Phaser.Cache)
    this.input     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load      //  for preloading assets (Phaser.Loader)
    this.math      //  lots of useful common math operations (Phaser.Math)
    this.sound     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage     //  the game stage (Phaser.Stage)
    this.time      //  the clock (Phaser.Time)
    this.tweens    //  the tween manager (Phaser.TweenManager)
    this.state     //  the state manager (Phaser.StateManager)
    this.world     //  the game world (Phaser.World)
    this.particles //  the particle manager (Phaser.Particles)
    this.physics   //  the physics manager (Phaser.Physics)
    this.rnd       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    // You can use any of these from any function within this State.
    // But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    this.analog = null
    this.arrow = null
    this.ball = null

    this.catchFlag = false
    this.launchVelocity = 0
  }

  create () {
    // Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    this.physics.startSystem(Phaser.Physics.ARCADE)

    // set global gravity
    this.physics.arcade.gravity.y = 200
    this.stage.backgroundColor = '#0072bc'

    let graphics = this.add.graphics(0, 0)
    graphics.beginFill(0x049e0c)
    graphics.drawRect(195, 450, 10, 250) // <-- the green rectangle

    this.analog = this.add.sprite(200, 450, 'analog') // <-- fusia.png

    this.physics.enable(this.analog, Phaser.Physics.ARCADE)

    this.analog.body.allowGravity = false
    this.analog.width = 8
    this.analog.rotation = 220
    this.analog.alpha = 0
    this.analog.anchor.setTo(0.5, 0.0)

    this.arrow = this.add.sprite(200, 450, 'arrow') // <--- longarrow2.png

    this.physics.enable(this.arrow, Phaser.Physics.ARCADE)

    this.arrow.anchor.setTo(0.1, 0.5)
    this.arrow.body.moves = false
    this.arrow.body.allowGravity = false
    this.arrow.alpha = 0

    this.ball = this.add.sprite(100, 400, 'pangball')
    this.physics.enable(this.ball, Phaser.Physics.ARCADE)
    this.ball.anchor.setTo(0.5, 0.5)
    this.ball.body.collideWorldBounds = true
    this.ball.body.bounce.setTo(0.9, 0.9)

    // Enable input.
    this.ball.inputEnabled = true
    this.ball.input.start(0, true)
    this.ball.events.onInputDown.add(() => {  // set
      this.ball.body.moves = false
      this.ball.body.velocity.setTo(0, 0)
      this.ball.body.allowGravity = false
      this.catchFlag = true
    })
    this.ball.events.onInputUp.add(() => {  // launch
      this.catchFlag = false

      this.ball.body.moves = true
      this.arrow.alpha = 0
      this.analog.alpha = 0
      let Xvector = (this.arrow.x - this.ball.x) * 3
      let Yvector = (this.arrow.y - this.ball.y) * 3
      this.ball.body.allowGravity = true
      this.ball.body.velocity.setTo(Xvector, Yvector)
    })
  }

  update () {
    // Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    this.arrow.rotation = this.physics.arcade.angleBetween(this.arrow, this.ball)

    if (this.catchFlag === true) {
        //  Track the ball sprite to the mouse
      this.ball.x = this.input.activePointer.worldX
      this.ball.y = this.input.activePointer.worldY

      this.arrow.alpha = 1
      this.analog.alpha = 0.5
      this.analog.rotation = this.arrow.rotation - 3.14 / 2
      this.analog.height = this.physics.arcade.distanceToPointer(this.arrow)
      this.launchVelocity = this.analog.height
    }
  }

  render () {

  }

  quitGame (pointer) {
    // Here you should destroy anything you no longer need.
    // Stop music, delete sprites, purge caches, free resources, all that good stuff.

    // Then let's go back to the main menu.
    this.state.start('MainMenu')
  }
}
