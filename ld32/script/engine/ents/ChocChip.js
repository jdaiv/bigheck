var ChocChip = function () {
  Entity.call(this);
  this.radius = 8;
};

ChocChip.prototype = Object.create(Entity.prototype); 

ChocChip.prototype.move = function (dt) {
  this.velocity.y += 500 * dt;
}

ChocChip.prototype.customStep = function (dt) {
  var position = this.position;

  if (position.x > 600) {
    this.alive = false;
  }
  if (position.x < -600) {
    this.alive = false;
  }
  if (position.y > Spoon.floor) {
    this.alive = false;
  }

  if (this.checkCollision(Spoon.ply.hitbox, Spoon.ply.radius)) {
    if (Spoon.ply.hurt) return false;
    Spoon.ply.damage(1, new Vec2D.ArrayVector(100, 100));
    this.alive = false;
  }

  this.rotation += (Math.PI / 4) * dt;
}

ChocChip.prototype.customRender = function (layer, app) {
  var pos = this.position;

  layer.stars(pos.x, pos.y, 0.5, 0.5, this.rotation, 2);
  layer.drawImage(app.images.chip, 0, 0);
  layer.restore();
};