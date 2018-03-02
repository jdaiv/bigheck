
// center of char is bottom center.
// size: 32x64

var PLAYER = {

  // ---
  position: new Vec2D.ArrayVector(0, 0),
  velocity: new Vec2D.ArrayVector(0, 0),
  rotation: 0.0,
  spoonPos: new Vec2D.ArrayVector(0, 0),
  spoonRot: 0.0,
  spoonHitArea: new Vec2D.ArrayVector(0, 0),

  // variables
  speed: 4000.0,
  maxSpeed: 500.0,
  friction: 80.0,
  gravity: 2000.0,
  jumpPower: 1000.0,
  health: 3.0,
  alive: true,

  // input
  movingLeft: false,
  movingRight: false,
  holdUp: false,
  holdDown: false,
  grounded: false,
  facing: 1,

  // attacks
  attackTimer: 0,
  attackFrame: 0,
  attackType: 0,
  attacking: false,
  canTurn: true,
  resetPos: keyframe(8, -30, Math.PI / 3, "inOutCubic", 0.1),
  currentFrame: undefined,
  nextFrame: undefined,

  // damage
  hurt: false,
  hurtTimer: 0,
  hurtFlash: false,
  stunned: false,
  stunTimer: 0,

  create: function () {
    this.position.zero();
    this.velocity.zero(); 
    this.spoonPos.setAxes(this.resetPos.x, this.resetPos.y);

    this.rotation = 0;
    this.spoonRot = this.resetPos.rotation;

    this.attacking = false;
    this.canTurn = true;

    this.health = 3;
    this.alive = true;
  },

  step: function (dt) {

    if (!this.alive) return false;

    if (this.hurt) {
      this.hurtTimer -= dt;
      if (this.hurtTimer < 0) {
        this.hurt = false;
      }
      this.hurtFlash = !this.hurtFlash
    } else {
      this.hurtFlash = false;
    }

    if (this.stunned) {
      this.stunTimer -= dt;
      if (this.stunTimer < 0) {
        this.stunned = false;
      }
    }

    var velocity = this.velocity;
    var position = this.position;
    var speed = this.speed * dt;
    var friction = this.friction * dt;
    var maxSpeed = this.maxSpeed;
    var canTurn = this.canTurn;

    // X MOVEMENT

    if (this.movingRight) {
      velocity.x += speed;
      if (canTurn)
        this.facing = 1;
    } else if (this.movingLeft) {
      velocity.x -= speed;
      if (canTurn) 
        this.facing = -1;
    } else {
      if (velocity.x > 50) {
        velocity.x -= speed;
      } else if (velocity.x < -50) {
        velocity.x += speed;
      } else {
        velocity.x = 0;
      }
    }

    if (velocity.x > maxSpeed) {
      velocity.x = maxSpeed;
    } else if (velocity.x < -maxSpeed) {
      velocity.x = -maxSpeed;
    }

    if (position.x > 600) {
      position.x = 600;
    }
    if (position.x < -600) {
      position.x = -600;
    }

    // Y MOVEMENT

    var floor = ENGINE.floor;    
    var gravity = this.gravity * dt;

    if (position.y < floor) {
      velocity.y += gravity;
      this.grounded = false;
      this.canTurn = false;
    }
    if (position.y >= floor) {
      velocity.y = 0;
      position.y = floor;
      this.grounded = true;
      if (!this.attacking)
        this.canTurn = true;
    }

    position.add(velocity.clone().mulS(dt));

    // JUNK BELOW

    this.rotation = Math.PI / 16 * (velocity.x / maxSpeed);

    // ATTACK
    if (this.attacking) {
      this.canTurn = false;
      this.attackTimer += dt;

      var type = this.attackType;

      var t = this.attackTimer;
      var f = this.attackFrame;

      if (f == 0) {
        this.currentFrame = this.resetPos;
      } else {
        this.currentFrame = ATTACKS[type][f - 1];
      }

      if (f < ATTACKS[type].length) {
        this.nextFrame = ATTACKS[type][f];
      } else {
        this.nextFrame = this.resetPos;
      }

      var from = this.currentFrame; 
      var to = this.nextFrame;

      var d = to.duration;

      var method = to.easing;
      var ease = app.ease(t / d, method);
      this.spoonPos.x = lerp(from.x, to.x, ease);
      this.spoonPos.y = lerp(from.y, to.y, ease);
      this.spoonRot = lerp(from.rotation, to.rotation, ease);

      if (to.active) {
        this.calculateSpoon();
        var testPos = this.spoonHitArea;

        ENGINE.checkCollisionWithEnemies(testPos, 32, function (enemy) {
          var k = ATTACK_INFO[PLAYER.attackType].knockback;
          enemy.damage(ATTACK_INFO[PLAYER.attackType].damage, new Vec2D.ArrayVector(k[0] * PLAYER.facing, k[1]));
          ENGINE.camera.shake = 10;
          ENGINE.timescale = 0.1;

          ENGINE.combo.inc();
          if (!PLAYER.grounded) {
            ENGINE.combo.inc();
          }
          if (!enemy.grounded) {
            ENGINE.combo.inc();
          }

          ENGINE.addScore(ATTACK_INFO[PLAYER.attackType].damage * ENGINE.combo.amt);
        });
      }

      if (t >= d) {
        f++;
        if (f > ATTACKS[type].length) {
          this.attacking = false;
        }
        t -= d;

        this.attackTimer = t;
        this.attackFrame = f;
      }
    }

    var hitTestPos = position.clone();
    hitTestPos.y -= 32;

    ENGINE.checkCollisionWithEnemies(hitTestPos, 16, function (enemy) {
      if (enemy.stunned) return;
      PLAYER.damage(1, new Vec2D.ArrayVector(100, 100));
    });
  },

  calculateSpoon: function () {
    var sPos = this.spoonPos;
    this.spoonHitArea = this.position.clone();
    var edgeOffset = new Vec2D.ArrayVector(0, -105);
    edgeOffset.rotate(this.spoonRot * this.facing);
    var baseOffset = new Vec2D.ArrayVector(sPos.x * this.facing, sPos.y);
    baseOffset.add(edgeOffset);
    baseOffset.rotate(this.rotation);
    this.spoonHitArea.add(baseOffset);
  },

  jump: function () {
    if (this.grounded) {
      console.log("JUMP!");
      this.position.y -= 1;
      this.velocity.y = -this.jumpPower;
      this.grounded = false;
      var sound = app.sound.play("jump");
      app.sound.setVolume(sound, 0.5);
      app.sound.setPlaybackRate(sound, 0.75 + Math.random() / 2);
    }
  },

  attack: function () {
    if (!this.attacking || this.nextFrame === this.resetPos) {
      this.attacking = true;
      this.attackTimer = 0;
      this.attackFrame = 0;
      var type = 0;
      if (this.grounded) {
        if (this.holdDown) {
          type = 2;
        } else if (this.holdUp) {
          type = 2;
        } else {
          type = 1;
        }
      } else {
        if (this.holdDown) {
          type = 3;
        } else if (this.holdUp) {
          type = 4;
        } else {
          if (this.facing > 0 && this.movingLeft) {
            type = 5;
          } else if (this.facing < 0 && this.movingRight) {
            type = 5;
          } else {
            type = 0;
          }
        }
      }
      this.attackType = type;
    } else {
      // this.attackFrame = 1;
    }
  },

  damage: function (amt, dir) {
    if (!this.alive) return false;
    if (this.hurt) return false;

    this.health -= amt;

    if (this.health <= 0) {
      this.alive = false;

      var sound = app.sound.play("player_death");
      // app.sound.setVolume(sound, 1.2);
      // app.sound.setPlaybackRate(sound, 0.5 + Math.random());
      ENGINE.particles.burst(100, this.position.clone().add(new Vec2D.ArrayVector(0, -32)), -1000, 1000, -1000, 1000, "#0af", 4);
      ENGINE.particles.burst(100, this.position.clone().add(new Vec2D.ArrayVector(0, -32)), -1000, 1000, -1000, 1000, "#024", 4);
      ENGINE.particles.burst(100, this.position.clone().add(new Vec2D.ArrayVector(0, -32)), -1000, 1000, -1000, 1000, "#05d", 4);

      ENGINE.timescale = 0.01;
      ENGINE.Game.slowmo = true;
      ENGINE.gameover = true;
      ENGINE.camera.shake = 50;

      return true;
    }

    if (this.grounded)
      this.position.y -= 2;
    this.velocity = dir;
    this.hurt = true;
    this.hurtTimer = 0.8;
    this.stunned = true;
    this.stunTimer = 0.2;

    ENGINE.timescale = 0.2;
    ENGINE.camera.shake = 20;
    // ENGINE.combo.zero();

    app.sound.play("player_hurt");
  },

  render: function (layer, app) {
    if (!this.alive) return false;
    var pos = this.position;
    var sPos = this.spoonPos;
    var f = this.facing;

    if (!this.hurtFlash) {
      layer.stars(pos.x, pos.y, 0.5, 1, this.rotation, 1);
      layer.fillStyle("#0af");
      layer.fillRect(0, 0, 32, 64);
      layer.stars(sPos.x * this.facing, sPos.y, 0.5, 1, this.spoonRot * this.facing, 1);
      layer.drawImage(app.images.spoon, 0, 0);
      layer.restore();
      layer.restore();
    }

    // layer.stars(this.spoonHitArea.x, this.spoonHitArea.y, 0.5, 0.5, 0, 1);
    // layer.fillStyle("#f00");
    // layer.fillCircle(0, 0, 24);
    // layer.restore();
  },

};