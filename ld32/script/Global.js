
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function keyframe (x, y, rotation, easing, duration, active) {
  return {
    x: x,
    y: y,
    rotation: rotation,
    easing: easing,
    duration: duration,
    active: active,
  };
}

function lerp (v1, v2, time) {
  return (1 - time) * v1 + time * v2;
}

var Spoon = {

  init: function () {
    this.timescale = 1;
    this.slowmo = false;
    this.slowmoValue = 0.2;
    this.floor = 208;
    this.elapsedTime = 0;
    this.gameover = false;
  },

  smoothTimescale: function (dt) {
    var targetTimescale = this.slowmo ? 0.2 : 1
    this.timescale += (targetTimescale - this.timescale) * dt * 4;
  },

};