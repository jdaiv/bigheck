var Score = function () {
  this.score = 0;
  this.delta = 0;
  this.extraLifeReq = 5000;

  this.visualScale = 1;

  this.combo = 0;
  this.comboTimer = 0;
  this.comboTimerMax = 0;

  this.addCombo(1);
};

Score.prototype = {

  addScore: function (amt) {
    this.score += amt * this.combo;
    this.delta += amt * this.combo;
    if (this.delta >= this.extraLifeReq) {
      this.delta -= this.extraLifeReq;
      this.extraLifeReq *= 2;
      Spoon.ply.health++; 
    }
  },

  addCombo: function (amt) {
    this.combo += amt;
    this.comboTimer = 20 - this.combo * 0.25;
    if (this.comboTimer < 4) {
      this.comboTimer = 4;
    }
    this.comboTimerMax = this.comboTimer;
    this.visualScale += 0.1;
  },

  step: function (dt) {
    if (this.comboTimer > 0) 
      this.comboTimer -= dt;
    else {
      Spoon.ply.damage(1, new Vec2D.ArrayVector(100, 100));
      this.combo /= 2;
      this.addCombo(1);
    }
    this.visualScale = lerp(this.visualScale, 1, dt * 10);
  },

  zero: function () {
    this.score = 0;
    this.delta = 0;
    this.extraLifeReq = 5000;
    this.combo = 0;
    this.addCombo(1);
  },

};