
var EntityManager = function () {
  this.array = [];
  this.count = 0;
};

EntityManager.prototype = {
  reset: function () {
    this.array = [];
    this.count = 0;
  },

  add: function (ent) {
    this.array.push(ent);
    this.count++;
  },

  step: function (dt) {
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
};