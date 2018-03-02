var Player = function () {
  Entity.call(this);
};

Player.prototype = Object.create(Entity.prototype);

Player.prototype.constructor = Player;

Player.prototype.init = function () {
  this.position.zero();
  this.velocity.zero();
  this.rotation = 0.0;

  this.width = 32;
  this.height = 64;
  this.radius = 16;

  this.hitbox = new Vec2D.ArrayVector();

  // console.log(this.spoon);

  this.grounded = false;
  this.facing = 1;
  this.canTurn = true;

  this.speed = 4000.0;
  this.maxSpeed = 500.0;
  this.friction = 80.0;
  this.gravity = 2000.0;
  this.jumpPower = 1000.0;

  this.movingLeft = false;
  this.movingRight = false;
  this.holdUp = false;
  this.holdDown = false;

  this.health = 3;
  this.alive = true;

  this.attacking = false;
  this.attackInfo = {
    timer: 0,
    frame: 0,
    type: 0,
    currentFrame: undefined,
    nextFrame: undefined,
    reset: keyframe(8, -30, Math.PI / 3, "inOutCubic", 0.1, false),
  }

  this.spoon = {
    position: new Vec2D.ArrayVector(this.attackInfo.reset.x, this.attackInfo.reset.y),
    rotation: this.attackInfo.reset.rotation,
    hitBox: new Vec2D.ArrayVector(0, 0),
  }

  this.hurt = false;
  this.hurtTimer = 0;
};

Player.prototype.move = function (dt) {

  var velocity = this.velocity;
  var position = this.position;
  var speed = this.speed * dt;
  var friction = this.friction * dt;
  var maxSpeed = this.maxSpeed;
  var canTurn = this.canTurn;

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

  // Y MOVEMENT

  var floor = Spoon.floor;    
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
  
};

Player.prototype.customStep = function (dt) {

  var position = this.position;

  if (position.x > 600) {
    position.x = 600;
  }
  if (position.x < -600) {
    position.x = -600;
  }

  this.rotation = Math.PI / 16 * (this.velocity.x / this.maxSpeed);

  this.doAttack(dt);
  this.doHurt(dt);

  this.hitbox = this.position.clone();
  this.hitbox.y -= 32;

  if (!this.hurt) {
    Spoon.enemyManager.checkAll(this.hitbox, this.radius, function (enemy) {
      if (enemy.stunned) return;
      Spoon.ply.damage(1, new Vec2D.ArrayVector(100, 100));
    });
  }
};

Player.prototype.doAttack = function (dt) {

  var s = this.spoon;
  var atk = this.attackInfo;

  if (this.attacking) {
    this.canTurn = false;
    atk.timer += dt;

    var type = atk.type;

    var t = atk.timer;
    var f = atk.frame;

    if (f == 0) {
      atk.currentFrame = atk.reset;
    } else {
      atk.currentFrame = ATTACKS[type][f - 1];
    }

    if (f < ATTACKS[type].length) {
      atk.nextFrame = ATTACKS[type][f];
    } else {
      atk.nextFrame = atk.reset;
    }

    var from = atk.currentFrame; 
    var to = atk.nextFrame;
    var d = to.duration;

    var method = to.easing;
    var ease = app.ease(t / d, method);
    s.position.x = lerp(from.x, to.x, ease);
    s.position.y = lerp(from.y, to.y, ease);
    s.rotation = lerp(from.rotation, to.rotation, ease);

    if (to.active) {
      this.calculateSpoon();
      var testPos = this.spoon.hitbox;

      Spoon.enemyManager.checkAll(testPos, 36, function (enemy) {

        if (enemy.hurt) return false;

        var ply = Spoon.ply;
        var atk = ply.attackInfo;
        var info = ATTACK_INFO[atk.type];
        var k = info.knockback;
        enemy.damage(info.damage, new Vec2D.ArrayVector(k[0] * ply.facing, k[1]));
        Spoon.camera.shake = 10;
        Spoon.timescale = 0.1;

        var combo = 1;
        if (!ply.grounded) {
          combo++;
        }
        if (!ply.grounded) {
          combo++;
        }

        Spoon.score.addCombo(combo);

        Spoon.score.addScore(info.damage);

      });
    }

    if (t >= d) {
      f++;
      if (f > ATTACKS[type].length) {
        this.attacking = false;
      }
      t -= d;

      atk.timer = t;
      atk.frame = f;
    }
  }
};

Player.prototype.doHurt = function (dt) {
  if (this.hurt) {
    this.hurtTimer -= dt;
    if (this.hurtTimer < 0) {
      this.hurt = false;
    }
    this.hurtFlash = !this.hurtFlash
  } else {
    this.hurtFlash = false;
  }
};

Player.prototype.calculateSpoon = function () {
  var s = this.spoon;
  s.hitbox = this.position.clone();

  var edgeOffset = new Vec2D.ArrayVector(0, -95);
  edgeOffset.rotate(s.rotation * this.facing);

  var baseOffset = new Vec2D.ArrayVector(s.position.x * this.facing, s.position.y);
  baseOffset.add(edgeOffset);
  baseOffset.rotate(this.rotation);

  s.hitbox.add(baseOffset);
};

Player.prototype.jump = function () {
  if (this.grounded) {
    // console.log("JUMP!");
    this.position.y -= 1;
    this.velocity.y = -this.jumpPower;
    this.grounded = false;
    var sound = app.sound.play("jump");
    app.sound.setVolume(sound, 0.5);
    app.sound.setPlaybackRate(sound, 0.75 + Math.random() / 2);
  }
};

Player.prototype.attack = function () {
  if (!this.attacking) {
    var atk = this.attackInfo;
    this.attacking = true;
    atk.timer = 0;
    atk.frame = 0;
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
    atk.type = type;
  }
};

Player.prototype.onDamage = function (amt, dir) {

  if (this.hurt) return false;

  if (this.health <= 0) {
    this.alive = false;

    var sound = app.sound.play("player_death");
    app.sound.setVolume(sound, 1.2);
    app.sound.setPlaybackRate(sound, 0.5 + Math.random());
    Spoon.particles.burst(100, this.position.clone().add(new Vec2D.ArrayVector(0, -32)), -1000, 1000, -1000, 1000, "#eee", 4);
    Spoon.particles.burst(100, this.position.clone().add(new Vec2D.ArrayVector(0, -32)), -1000, 1000, -1000, 1000, "#eef", 4);
    Spoon.particles.burst(100, this.position.clone().add(new Vec2D.ArrayVector(0, -32)), -1000, 1000, -1000, 1000, "#dde", 4);

    Spoon.timescale = 0.01;
    Spoon.slowmo = true;
    Spoon.gameover = true;
    Spoon.camera.shake = 50;

    return true;
  }

  if (this.grounded)
    this.position.y -= 2;
  this.velocity = dir;
  this.hurt = true;
  this.hurtTimer = 0.8;
  this.stunned = true;
  this.stunTimer = 0.2;

  // ENGINE.timescale = 0.2;
  // ENGINE.camera.shake = 20;
  // ENGINE.combo.zero();

  app.sound.play("player_hurt");
};

Player.prototype.customRender = function (layer, app) {

  var pos = this.position;
  var s = this.spoon;
  var f = this.facing;

  if (!this.hurtFlash) {
    layer.stars(pos.x, pos.y, 0.5, 1, this.rotation, f, 1);
    layer.drawImage(((!this.grounded || this.hurt) ? app.images.hand_jump : app.images.hand), 0, 0);
    layer.stars(s.position.x, s.position.y, 0.5, 1, s.rotation, 1);
    layer.drawImage(app.images.spoon, 0, 0);
    layer.restore();
    layer.restore();
  }

  // layer.stars(this.spoonHitArea.x, this.spoonHitArea.y, 0.5, 0.5, 0, 1);
  // layer.fillStyle("#f00");
  // layer.fillCircle(0, 0, 24);
  // layer.restore();

};
