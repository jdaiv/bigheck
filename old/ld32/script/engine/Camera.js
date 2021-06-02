var Camera = function () {
  this.realPosition = new Vec2D.ArrayVector(0, 0);
  this.position = new Vec2D.ArrayVector(0, 0);
  this.zoom = 1.0;
  this.shake = 0.0;
  this.decay = 20;
};

Camera.prototype.constructor = Camera;

Camera.prototype = {

  reset : function () {
    this.realPosition.zero();
    this.position.zero();
    this.zoom = 1.0;
    this.shake = 0.0;
    this.decay = 20;
  },
    
  step: function (dt) {

    var ply = Spoon.ply;
    var targetPos = ply.position.clone(); 
    var minX = targetPos.x;
    var maxX = targetPos.x;
    var minY = targetPos.y;
    var maxY = targetPos.y;

    for (var i = 0; i < Spoon.enemyManager.count; i++) {
      var e = Spoon.enemyManager.array[i];
      if (!e.alive) continue;
      
      if (e.position.x > maxX) 
        maxX = e.position.x;

      if (e.position.x < minX)
        minX = e.position.x;

      if (e.position.y > maxY) 
        maxY = e.position.y;

      if (e.position.y < minY)
        minY = e.position.y;
    }

    targetPos.x = (minX + maxX) / 2;
    targetPos.y = (minY + maxY) / 2; //  + (PLAYER.grounded ? -150 : 0)

    var zoomTarget = 1 - (ply.position.distance(targetPos) / 320 * 0.3);
    if (zoomTarget < 0.2)
      zoomTarget = 0.2;
    this.zoom += (zoomTarget - this.zoom) * dt * 4;

    targetPos.mulS(-1);
    targetPos.mulS(this.zoom);

    this.realPosition.x += (targetPos.x - this.realPosition.x) * dt * 4;
    this.realPosition.y += (targetPos.y - this.realPosition.y) * dt * 4;

    this.position = this.realPosition.clone();

    var shake = this.shake;

    if (shake > 0) {
      var offset = new Vec2D.ArrayVector((Math.random() * shake) - (shake / 2), (Math.random() * shake) - (shake / 2));
      this.position.add(offset);
      this.shake -= this.decay * dt * 4;
      if (this.shake < 0) {
        this.shake = 0;
      }
    }

  },
};