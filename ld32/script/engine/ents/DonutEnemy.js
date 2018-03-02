var DonutEnemy = function () {
  Enemy.call(this);
};

DonutEnemy.prototype = Object.create(Enemy.prototype); 

DonutEnemy.prototype.init = function () {
  Enemy.prototype.init.call(this);
  this.attackWindup = false;
  this.health = 35;
  this.maxHealth = 35;
}

DonutEnemy.prototype.addRotation = function (dt) {
  if (!this.grounded) {
    if (this.stunned)
      this.rotation += 8 * dt;
  } else {
    this.rotation += this.velocity.x * (dt / 8);
  }

  if (this.rotation > Math.PI * 2) {
    this.rotation -= Math.PI * 2;
  } else if (this.rotation < 0) {
    this.rotation += Math.PI * 2;
  }
};

DonutEnemy.prototype.doAttack = function (dt) {
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
      if (!this.attackWindup) {
        v.y = -getRandomInt(350, 500);
        p.y -= 2;
        this.scale = 1 + Math.random() / 2;
        this.attackWindup = true;
      } else {
        v.x = getRandomInt(600, 1000) * -this.facing;
        this.attackTimer = getRandomInt(2, 4);
        this.attackWindup = false;
      }
    }
  } else {
    if (this.attackTimer < 1) {
      this.attackTimer = 1;
    }
  }
};

DonutEnemy.prototype.customRender = function (layer, app) {
  var pos = this.position;

  layer.stars(pos.x, pos.y - 32 * this.scale, 0.5, 0.5, this.rotation, (2 - this.scale), this.scale);
  if (!this.hurtFlash) {
    layer.drawImage(app.images.donut, 0, 0);
  } else {
    var red = cq(app.images.donut).blend("#f00", "normal", 1.0);
    layer.drawImage(red.canvas, 0, 0);
  }

  layer.restore();

  this.drawHealthBar(layer, app);
};