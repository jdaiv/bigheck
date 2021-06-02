
var EnemyManager = function () {
  this.array = [];
  this.count = 0;
  this.timer = 0;
};

EnemyManager.prototype = {
  reset: function () {
    this.array = [];
    this.count = 0;
    this.timer = 0;
  },

  add: function (x, y) {
    var enemy;
    var eI;
    var found = false;
    for (var i = 0; i < this.count; i++) {
      if (!this.array[i].alive) {
        eI = i;
        found = true;
        break;
      }
    }

    switch (getRandomInt(0, 3)) {
      case 0:
      enemy = new Enemy();
      break;
      case 1:
      enemy = new DonutEnemy();
      break;
      case 2:
      enemy = new CookieEnemy();
      break;
    }
    enemy.init();
    enemy.setPosition(x, y);

    if (!found) {
      this.array.push(enemy);
      this.count++;
    } else {
      this.array[eI] = enemy;
    }
  },

  step: function (dt) {
    if (this.timer <= 0) {
      this.timer += 3.5 - (Spoon.elapsedTime / 40);
      if (this.timer < 1) {
        this.timer = 1;
      }
      this.add(getRandomInt(-500, 500), -400);
    } else {
      this.timer -= dt;
    }

    for (var i = 0; i < this.count; i++) {
      this.array[i].step(dt);
    }
  },

  render: function (layer, app) {
    for (var i = 0; i < this.count; i++) {
      var e = this.array[i];
      if (e.alive) {
        e.render(layer, app);
      }
    }
  },

  checkAll: function (pos, radius, callback) {
    for (var i = 0; i < this.count; i++) {
      if (this.array[i].checkCollision(pos, radius)) {
        callback(this.array[i]);
      }
    }
  },
};