var Enemy = function () {
  Entity.call(this);
};

Enemy.prototype = Object.create(Entity.prototype); 

Enemy.prototype.constructor = Enemy;

Enemy.prototype.init = function () {
  this.position.zero();
  this.velocity.zero();
  this.rotation = 0.0;

  this.color = "#ff8daa";
  this.deadColor = "#ff1c1c";

  this.grounded = false;
  this.facing = 1;

  this.health = 50;
  this.maxHealth = 50;
  this.alive = true;

  this.scale = 1;
  this.scaleS = 1;
  this.attackTimer = 0;
  this.attacking = false;
  this.hurt = true;
  this.hurtTimer = 1;
  this.hurtFlash = false;
  this.stunned = true;
};

Enemy.prototype.move = function (dt) {
  var velocity = this.velocity;
  var position = this.position;

  var floor = Spoon.floor;
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
      app.sound.setVolume(sound, 1.2);
      app.sound.setPlaybackRate(sound, 0.5 + Math.random());
      Spoon.particles.burst(100, this.position.clone().add(new Vec2D.ArrayVector(0, -32)), -velocity.x * 0.5 - 200, velocity.x + 200, 100, -400, this.deadColor, 2);
      Spoon.score.addCombo(4)
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
};

Enemy.prototype.customStep = function (dt) {
  this.clampX();
  this.addRotation(dt);
  this.calcScale(dt);
  this.doAttack(dt);
  this.doHurt(dt);
};


Enemy.prototype.clampX = function () {
  var p = this.position;
  var v = this.velocity;

  if (p.x > 600) {
    v.x = -v.x;
    p.x = 600;
  }
  if (p.x < -600) {
    v.x = -v.x;
    p.x = -600;
  }
};

Enemy.prototype.addRotation = function (dt) {
  if (!this.grounded) {
    if (this.stunned)
      this.rotation += 8 * dt;
  } else {
    this.rotation += (0 - this.rotation) * (10 * dt);
  }
};

Enemy.prototype.calcScale = function (dt) {
  this.scaleS = (this.scaleS * 0.95) + ((-this.scale + 1) * 0.1);
  this.scale += this.scaleS;
};

Enemy.prototype.doAttack = function (dt) {
  var p = this.position;
  var v = this.velocity;

  if (this.grounded) {
    if (Spoon.ply.position.x > p.x) {
      this.facing = -1;
    } else {
      this.facing = 1;
    }

    if (this.attackTimer > 0) {
      this.attackTimer -= dt;
    } else {
      this.attackTimer = getRandomInt(2, 4);
      v.y -= getRandomInt(350, 500);
      v.x = getRandomInt(200, 300) * -this.facing;
      p.y -= 2;
      this.scale = 1 + Math.random() / 2;
    }
  } else {
    if (this.attackTimer < 1) {
      this.attackTimer = 1;
    }
  }
};

Enemy.prototype.doHurt = function (dt) {
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

Enemy.prototype.onDamage = function (amt, dir) {
  Spoon.particles.burst(amt, this.position.clone().add(new Vec2D.ArrayVector(0, -this.height / 2)), 0, dir.x, 0, dir.y, this.color, 2);

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
};

Enemy.prototype.customRender = function (layer, app) {
  var pos = this.position;

  layer.stars(pos.x, pos.y - 32 * this.scale, 0.5, 0.5, this.rotation, this.facing * (2 - this.scale), this.scale);
  if (!this.hurtFlash) {
    layer.drawImage(app.images.angry_cupcake, 0, 0);
  } else {
    var red = cq(app.images.angry_cupcake).blend("#f00", "normal", 1.0);
    layer.drawImage(red.canvas, 0, 0);
  }

  layer.restore();

  this.drawHealthBar(layer, app);
};

Enemy.prototype.drawHealthBar = function (layer, app) {
  var pos = this.position;

  layer.stars(pos.x, pos.y - this.height - 16, 0.5, 0.5, 0, 1);

  layer.drawImage(app.images.healthbar, 0, 0)
       .fillStyle("#700")
       .fillRect(0, 0, 56, 4)
       .fillStyle("#0c0")
       .fillRect(0, 0, 56 * (this.health / this.maxHealth), 4); 

  layer.restore();
}