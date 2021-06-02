
function Enemy (x, y) {
  this.position = new Vec2D.ArrayVector(x, y);
  this.velocity = new Vec2D.ArrayVector(0, 0);
  this.rotation = 0.0;

  this.gravity = 2000.0;
  this.grounded = false;
  this.facing = 1;

  this.health = 50;
  this.alive = true;

  this.scale = 1;
  this.scaleS = 1;
  this.attackTimer = 0;
  this.attacking = false;
  this.hurt = true;
  this.hurtTimer = 1;
  this.hurtFlash = false;
  this.stunned = true;
}

Enemy.prototype = {

  reset: function (x, y) {
    this.position.setAxes(x, y);
    this.velocity.zero();
    this.rotation = 0.0;

    this.grounded = false;
    this.facing = 1;

    this.health = 50;
    this.alive = true;

    this.scale = 1;
    this.scaleS = 1;
    this.attackTimer = 0;
    this.attacking = false;
    this.hurt = true;
    this.hurtTimer = 1;
    this.hurtFlash = false;
    this.stunned = true;
  },

  step: function (dt) {

    if (!this.alive) return false;

    var velocity = this.velocity;
    var position = this.position;

    var floor = ENGINE.floor;
    var gravity = this.gravity * dt;

    velocity.x += (0 - velocity.x) * (dt * (this.grounded ? 2 : 0.5));

    if (position.y < floor) {
      velocity.y += gravity;
      this.grounded = false;
    }
    if (position.y >= floor) {
      position.y = floor;
      if (this.health <= 0) {
        var sound = app.sound.play("enemy_death");
        // app.sound.setVolume(sound, 1.2);
        // app.sound.setPlaybackRate(sound, 0.5 + Math.random());
        ENGINE.particles.burst(100, this.position.clone().add(new Vec2D.ArrayVector(0, -32)), -velocity.x * 0.5 - 200, velocity.x + 200, 100, -400, "#cc1100", 2);
        ENGINE.combo.inc();
        ENGINE.combo.inc();
        ENGINE.combo.inc();
        ENGINE.combo.inc();
        this.alive = false;
      } else if (velocity.y > 1000) {
        velocity.y *= -0.65;
        position.y = floor - 10;
      } else {
        velocity.y = 0;
        this.grounded = true;
        this.hurt = false;
        this.stunned = false;
      }
    }

    position.add(velocity.clone().mulS(dt));

    if (position.x > 600) {
      velocity.x = -velocity.x;
      position.x = 600;
    }
    if (position.x < -600) {
      velocity.x = -velocity.x;
      position.x = -600;
    }

    if (!this.grounded) {
      if (this.stunned)
        this.rotation += 8 * dt;
    } else {
      this.rotation += (0 - this.rotation) * (10 * dt);
    }

    if (this.grounded) {
      if (PLAYER.position.x > position.x) {
        this.facing = -1;
      } else {
        this.facing = 1;
      }

      if (this.attackTimer > 0) {
        this.attackTimer -= dt;
      } else {
        this.attackTimer = getRandomInt(2, 4);
        velocity.y -= getRandomInt(350, 500);
        velocity.x = getRandomInt(200, 300) * -this.facing;
        position.y -= 2;
        this.scale = 1 + Math.random() / 2;
      }
    } else {
      if (this.attackTimer < 1) {
        this.attackTimer = 1;
      }
    }

    if (this.hurt) {
      this.hurtTimer -= dt;
      if (this.hurtTimer < 0) {
        this.hurt = false;
      }
      this.hurtFlash = !this.hurtFlash
    } else {
      this.hurtFlash = false;
    }

    this.scaleS = (this.scaleS * 0.95) + ((-this.scale + 1) * 0.1);
    this.scale += this.scaleS;
  },

  checkCollision: function (pos, radius) {
    if (!this.alive) return false;

    if (this.hurt) {
      return false;
    }
    var center = this.position.clone();
    center.y -= 32;
    if (center.distance(pos) < radius + 32) {
      return true;
    }
    return false;
  },

  damage: function (amt, dir) {
    if (!this.alive) return false;

    ENGINE.particles.burst(amt, this.position.clone().add(new Vec2D.ArrayVector(0, -32)), 0, dir.x, 0, dir.y, "#f00", 2);

    this.health -= amt;
    if (this.health < 0)
      this.health = 0;

    if (this.grounded)
      this.position.y -= 2;
    this.velocity = dir;
    this.hurt = true;
    this.hurtTimer = 0.5;
    this.stunned = true;
    this.scale = Math.random() * 2;

    var sound = app.sound.play("enemy_hurt0" + getRandomInt(1, 4));
    app.sound.setVolume(sound, 0.9 + Math.random() / 5);
    app.sound.setPlaybackRate(sound, 0.9 + Math.random() / 5);
  },

  render: function (layer, app) {
    if (!this.alive) return false;

    var pos = this.position;

    layer.stars(pos.x, pos.y - 32 * this.scale, 0.5, 0.5, this.rotation, this.facing * (2 - this.scale), this.scale);
    if (!this.hurtFlash) {
      layer.drawImage(app.images.angry_cupcake, 0, 0);
    } else {
      var red = cq(app.images.angry_cupcake).blend("#f00", "normal", 1.0);
      layer.drawImage(red.canvas, 0, 0);
    }


    layer.restore();

    layer.stars(pos.x, pos.y - 70, 0.5, 0.5, 0, 1);

    layer.drawImage(app.images.healthbar, 0, 0)
         .fillStyle("#700")
         .fillRect(0, 0, 56, 4)
         .fillStyle("#0c0")
         .fillRect(0, 0, 56 * (this.health / 50), 4); 

    layer.restore();
  }
}