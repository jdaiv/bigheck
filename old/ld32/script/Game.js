ENGINE.Game = { 
  
  create: function () {
    this.init();
  },

  init: function () {
    Spoon.init();
    Spoon.score = new Score();
    Spoon.camera = new Camera();
    Spoon.enemyManager = new EnemyManager();
    Spoon.entityManager = new EntityManager();
    Spoon.particles = new Particles(1000);
    Spoon.hud = new HUD();
    Spoon.ply = new Player();
    Spoon.ply.init();
  },

  reset: function () {
    Spoon.init();
    Spoon.score.zero();
    Spoon.camera.reset();
    Spoon.particles.clear();
    Spoon.enemyManager.reset();
    Spoon.entityManager.reset();
    Spoon.ply.init();
  },

  playmusic: function () {
    try {
      var battleMusic = app.music.play("battle", true);
      app.music.fadeIn(Spoon.music);
      this.music = true;
    } catch (e) {
      this.music = false;
    }
  },

  step: function (dt) {

    if (!this.music) this.playmusic();

    var scaled_dt = dt * Spoon.timescale;

    if (!Spoon.gameover) {

      Spoon.elapsedTime += scaled_dt;
      Spoon.score.step(scaled_dt);
      Spoon.enemyManager.step(scaled_dt);
      Spoon.entityManager.step(scaled_dt);
      Spoon.ply.step(scaled_dt);
    }

    Spoon.camera.step(scaled_dt);
    Spoon.particles.step(scaled_dt);
    Spoon.smoothTimescale(scaled_dt);
  },

  render: function () {

    var app = this.app;
    var layer = this.app.layer;

    var camera = Spoon.camera;

    // layer.clear("#222");
    layer.save();

    layer.stars(
      app.center.x + (camera.position.x * 0.1),
      app.center.y + (camera.position.y * 0.1),
      0.5, 0.5, 0, camera.zoom + 2);
    layer.drawImage(app.images.bg01, 0, 0);
    layer.restore();

    layer.stars(
      app.center.x + (camera.position.x * 0.15),
      app.center.y + (camera.position.y * 0.4),
      0.5, 0.5, 0, camera.zoom * 1.5);
    layer.drawImage(app.images.bg02, 0, 0);
    layer.restore();

    layer.stars(
      app.center.x - (camera.position.x * 0.2),
      app.center.y - (camera.position.y * 0.2),
      0.5, 0.5, 0, camera.zoom + 3);
    layer.a(0.75);
    layer.drawImage(app.images.bg01, 0, 0);
    layer.ra();
    layer.restore();

    layer.stars(
      app.center.x + (camera.position.x * 0.5),
      app.center.y - (camera.position.y * 0.5),
      0.5, 0.5, 0, camera.zoom * 1.6); 
    layer.drawImage(app.images.bg03, 0, 0);
    layer.restore();

    layer.stars(
      app.center.x - (camera.position.x * 0.2),
      app.center.y - (camera.position.y * 0.2),
      0.5, 0.5, 0, camera.zoom + 3);
    layer.a(0.9);
    layer.drawImage(app.images.bg01, 0, 0);
    layer.ra();
    layer.restore();

    // layer.stars(
    //   app.center.x + (camera.position.x * 0.1),
    //   app.center.y + (camera.position.y * 0.1),
    //   0.5, 0.5, 0, camera.zoom + 2);
    // layer.drawImage(app.images.bg04, 0, 0);
    // layer.restore();

    // Camera Offset
    layer.stars(
      app.center.x + camera.position.x,
      app.center.y + camera.position.y,
      0.5, 0.5, 0, camera.zoom);

    // Particles
    Spoon.particles.render(layer, app);

    // Enemy
    Spoon.enemyManager.render(layer, app);

    // Player
    Spoon.ply.render(layer, app);

    // Entites
    Spoon.entityManager.render(layer, app);

    // Floor + Walls
    layer.align(0.5, 0.5);

    layer.drawImage(app.images.fg, 0, 0);

    layer.restore();

    var shake = camera.position.clone().subtract(camera.realPosition);

    layer.stars(
      app.center.x + shake.x,
      app.center.y + shake.y,
      0.5, 0.5, 0, 1);

    if (Spoon.gameover) {
      layer.drawImage(app.images.gameover, 0, 0);
    }

    layer.restore();

    Spoon.hud.render(layer, app);

    // Fix loader
    layer.align(0, 0);

  },

  keydown: function (event) {
    var ply = Spoon.ply;

    if (event.key == "left") {
      ply.movingLeft = true;
    }
    else if (event.key == "right") {
      ply.movingRight = true;
    }
    else if (event.key == "up") {
      ply.holdUp = true;
    }
    else if (event.key == "down") {
      ply.holdDown = true;
    }
    else if (event.key == "z") {
      ply.jump();
    }
    else if (event.key == "x") {
      ply.attack();
    }
    else if (event.key == "r") {
      app.setState(ENGINE.Game);
      this.reset();
    }
    else if (event.key == "q") {
      app.setState(ENGINE.Menu);
    }
    else if (event.key == "shift") {
      Spoon.slowmo = true;
    }
  },

  keyup: function (event) {
    var ply = Spoon.ply;

    if (event.key == "left") {
      ply.movingLeft = false;
    }
    else if (event.key == "right") {
      ply.movingRight = false;
    }
    else if (event.key == "up") {
      ply.holdUp = false;
    }
    else if (event.key == "down") {
      ply.holdDown = false;
    }

    else if (event.key == "shift") {
      Spoon.slowmo = false;
    }
  }

};
