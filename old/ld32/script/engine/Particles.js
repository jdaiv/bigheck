
var Particles = function (size) {
  this.arr = [];
  this.total = size;
  for (var i = 0; i < size; i++) {
    this.arr.push(this.newParticle());
  }
};

Particles.prototype = {

  clear: function () {
    for (var i = 0; i < this.total; i++) {
      var p = this.arr[i];
      p.alive = false;
    }
  },

  step: function (dt) {
    for (var i = 0; i < this.total; i++) {
      var p = this.arr[i];
      if (p.alive) {
        p.life -= dt;
        p.size = p.life;
        p.velocity.y += 1000 * dt;

        if (p.position.y > Spoon.floor) {
          p.velocity.y *= -0.5;
          p.position.y = Spoon.floor - 2;
        }

        p.position.add(p.velocity.clone().mulS(dt));
        if (p.life < 0) {
          p.alive = false;
        }
      }
    }
  },

  render: function (layer, app) {
    for (var i = 0; i < this.total; i++) {
      var p = this.arr[i];
      if (p.alive) { 
        // console.log(p);
        var norm = p.velocity.clone().normalize();
        var rotation = Math.atan2(norm.y, norm.x);
        var mag = p.velocity.magnitude() / 1000 + 1;
        layer.stars(p.position.x, p.position.y, 0.5, 0.5, rotation, p.size * mag, p.size / mag)
             .fillStyle(p.color)
             .fillCircle(0, 0, 16);
        layer.restore();
      }
    }
  },

  p: function (pos, vel, color, life) {
    for (var i = 0; i < this.total; i++) {
      var p = this.arr[i];
      if (!p.alive) {
        p.position = pos;
        p.velocity = vel;
        p.color = color;
        p.life = life;
        p.alive = true;
        break;
      }
    }
  },

  burst: function (count, pos, minX, maxX, minY, maxY, color, life) {
    for (var i = 0; i < this.total; i++) {
      var p = this.arr[i];
      if (!p.alive) {
        p.position = pos.clone();
        p.velocity = new Vec2D.ArrayVector(getRandomInt(minX, maxX), getRandomInt(minY, maxY));
        p.color = color;
        p.life = life * Math.random();
        p.alive = true;
        count--;
      }
      if (count <= 0) {
        break;
      }
    }
  },

  newParticle: function () {
    return {
      position: new Vec2D.ArrayVector(0, 0),
      velocity: new Vec2D.ArrayVector(0, 0),
      color: "#ff0000",
      size: 1,
      alive: false,
      life: 0,
    };
  },
};