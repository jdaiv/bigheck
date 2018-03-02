var CookieEnemy = function () {
  Enemy.call(this);
};

CookieEnemy.prototype = Object.create(Enemy.prototype); 

CookieEnemy.prototype.init = function () {
  Enemy.prototype.init.call(this);
  this.health = 35;
  this.maxHealth = 35;
  this.offset = {x: 0, y: 0};
}

CookieEnemy.prototype.doAttack = function (dt) {
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
      if (this.attackTimer < 1.5) {
        this.scale -= 0.1;
        this.offset.x = getRandomInt(-10,11) * (1.5 - this.attackTimer);
        this.offset.y = getRandomInt(-10,11) * (1.5 - this.attackTimer);
      }
    } else {
      this.alive = false;

      var sound = app.sound.play("enemy_death");
      app.sound.setVolume(sound, 1.2);
      app.sound.setPlaybackRate(sound, 0.5 + Math.random());
      Spoon.particles.burst(100, p.clone().add(new Vec2D.ArrayVector(0, -32)), -v.x * 0.5 - 200, v.x + 200, 100, -400, this.deadColor, 2);

      for (var i = 0; i < 4; i++) {
        var chip = new ChocChip();
        chip.position = p.clone();
        chip.position.y -= 32;
        chip.setVelocity(getRandomInt(-1000, 1001), getRandomInt(-200, -400));
        Spoon.entityManager.add(chip);
      }
    }
  } else {
    if (this.attackTimer < 2) {
      this.attackTimer = 2;
    }
  }
};

CookieEnemy.prototype.customRender = function (layer, app) {
  var pos = this.position;
  var offset = this.offset;

  layer.stars(pos.x + offset.x, pos.y - 32 * this.scale + offset.y, 0.5, 0.5, this.rotation, this.facing * (2 - this.scale), this.scale);
  if (!this.hurtFlash) {
    layer.drawImage(app.images.cookie, 0, 0);
  } else {
    var red = cq(app.images.cookie).blend("#f00", "normal", 1.0);
    layer.drawImage(red.canvas, 0, 0);
  }

  layer.restore();

  this.drawHealthBar(layer, app);
};