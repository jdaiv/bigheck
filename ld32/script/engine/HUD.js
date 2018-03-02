var HUD = function () {

}

HUD.prototype.render = function (layer, app) {

  layer.save();

  // Combo

  layer.align(1, 0);

  var amt = Spoon.score.combo;
  var scale = Spoon.score.visualScale;
  var xOffset = -30;
  var xPos = 660;
  var yPos = 5;
  var digitOne = Math.floor(amt % 10);
  var digitTwo = Math.floor(amt / 10);
  if (digitTwo > 9)
    digitTwo = digitTwo % 10;
  var digitThree = Math.floor(amt / 100);
  var clip = [0, 0, 64, 64];
  clip[0] = digitThree * 64;
  layer.drawRegion(app.images.combo_amt, clip, xPos + (xOffset * 4), yPos, scale);
  clip[0] = digitTwo * 64;
  layer.drawRegion(app.images.combo_amt, clip, xPos + (xOffset * 3), yPos, scale);
  clip[0] = digitOne * 64;
  layer.drawRegion(app.images.combo_amt, clip, xPos + (xOffset * 2), yPos, scale);
  clip[0] = 640;
  layer.drawRegion(app.images.combo_amt, clip, xPos + (xOffset * 1), yPos, scale);

  yPos += 64 * scale;
  xPos = 630;

  layer.drawImage(app.images.combo_meter, xPos, yPos)
       .fillStyle("#aa0000")
       .fillRect(xPos - 4, yPos + 4, 142 * (Spoon.score.comboTimer / Spoon.score.comboTimerMax), 16);

  // Score

  layer.align(0, 0);

  xPos = 5;
  xOffset = 40;
  yPos = 5;

  var numdigits = 8;

  for (var s = 0; s < numdigits; s++) {
    var digit;
    var amt = Spoon.score.score;
    if (s == 0) {
      digit = Math.floor(amt % 10);
    } else {
      digit = Math.floor(amt / Math.pow(10, s));
      if (digit > 9)
        digit = digit % 10;
    }

    clip[0] = digit * 64;
    layer.drawRegion(app.images.combo_amt, clip,
      xPos + (xOffset * (numdigits - s - 1)), yPos, scale);
  }

  layer.restore();

  // Health

  for (var h = 0; h < Spoon.ply.health; h++) {
    layer.stars(42 + h * 64, 438 + Math.sin(Spoon.elapsedTime * 4 + h) * 4, 0.5, 0.5, 0, 1)
         .drawImage(app.images.heart, 0, 0);
    layer.restore();
  }
}