
var Entity = function () {
  this.position = new Vec2D.ArrayVector(0, 0);
  this.velocity = new Vec2D.ArrayVector(0, 0);
  this.rotation = 0.0;

  this.width = 64;
  this.height = 64;
  this.radius = 32;
  this.sprite = undefined;
  this.color = "#00f";

  this.gravity = 2000.0;
  this.grounded = false;
  this.facing = 1;

  this.health = 1;
  this.alive = true;
}

Entity.prototype = {

  setPosition: function (x, y) {
    this.position.setAxes(x, y);
  },

  setVelocity: function (x, y) {
    this.velocity.setAxes(x, y);
  },

  init: function () {
    this.position.zero();
    this.velocity.zero();
    this.rotation = 0.0;

    this.health = 1;
    this.alive = true;
  },

  step: function (dt) {
    if (!this.alive) return false;
    
    this.move(dt);

    this.position.add(this.velocity.clone().mulS(dt));

    this.customStep(dt);
  },

  move: function (dt) {

  },

  customStep: function (dt) {

  },

  damage: function (amt, dir) {
    if (!this.alive) return false;

    if (dir === undefined) {
      dir = new Vec2D.ArrayVector(0, 0);
    }

    this.health -= amt;
    if (this.health < 0)
      this.health = 0;

    this.onDamage(amt, dir);
  },

  onDamage: function (amt, dir) {
    ENGINE.particles.burst(amt, this.position.clone().add(new Vec2D.ArrayVector(0, -this.height / 2)), 0, dir.x, 0, dir.y, this.color, 2);
  },

  checkCollision: function (pos, radius) {
    if (!this.alive) return false;

    var center = this.position.clone();
    center.y -= this.height / 2;

    if (center.distance(pos) < radius + this.radius) {
      return true;
    }
    return false;
  },

  render: function (layer, app) {
    if (!this.alive) return false;

    this.customRender(layer, app);
  },

  customRender: function (layer, app) {

  },

}