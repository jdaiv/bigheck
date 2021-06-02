ENGINE.Menu = {

  time: 0,
  screen: 0,
  gotoX: 0,
  gotoY: 0,
  helpScreen: 0,
  soundVolume: 1,
  musicVolume: 1,
  optionsS: false,

  create: function () {

    var sV = localStorage.getItem("soundVolume");
    if (sV == null) {
      localStorage.setItem("soundVolume", 0.5);
      this.soundVolume = 0.5;
    } else {
      this.soundVolume = Number(sV);
    }

    var mV = localStorage.getItem("musicVolume");
    if (mV == null) {
      localStorage.setItem("musicVolume", 0.5);
      this.musicVolume = 0.5;
    } else {
      this.musicVolume = Number(mV);
    }

    app.sound.setMaster(sV);
    app.music.setMaster(mV);

    this.music = app.music.play("menu_music", true);

  },

  updateVolumes: function () {
    localStorage.setItem("soundVolume", this.soundVolume);
    app.sound.setMaster(this.soundVolume);
    localStorage.setItem("musicVolume", this.musicVolume);
    app.music.setMaster(this.musicVolume);
  },

  step: function (dt) {
    this.time += dt;
    this.gotoX += ((this.screen * -640) - this.gotoX) * dt * 6;
    this.gotoY += ((this.helpScreen * 480) - this.gotoY) * dt * 6;
  },

  render: function () {

    var app = this.app;
    var layer = this.app.layer;

    layer.clear("#222"); 
    layer.save();

    var scale = 1.2 + (Math.sin(this.time * 2) / 20);
    layer.stars(app.center.x, app.center.y, 0.5, 0.5, 0, scale);
    layer.drawImage(app.images.menubg, 0, 0);
    layer.restore();
    
    layer.stars(this.gotoX, 0, 0, 0, 0, 1);
    layer.drawImage(app.images.startscreen, 0, 0);
    layer.drawImage(app.images.help, 640, 0);
    layer.drawImage(app.images.help01, 640, -this.gotoY);
    layer.drawImage(app.images.help02, 640, 480 - this.gotoY);
    layer.drawImage(app.images.help03, 640, 960 - this.gotoY);
    layer.drawImage(app.images.options, 1280, 0);
    layer.drawImage(app.images.options02, 1280, 0);

    function drawText(v, x, y) {
      var clip = [0, 0, 64, 64];
      for (var s = 0; s < 3; s++) {
        var digit;
        if (s == 0) {
          digit = Math.floor(v % 10);
        } else {
          digit = Math.floor(v / Math.pow(10, s));
          if (digit > 9)
            digit = digit % 10;
        }

        clip[0] = digit * 64;
        layer.drawRegion(app.images.combo_amt, clip,
          x + 10 - (s * 40), y, 1);
      }
    }

    drawText(Math.ceil(this.soundVolume * 100), 1280 + app.center.x, 112);
    drawText(Math.ceil(this.musicVolume * 100), 1280 + app.center.x, 256);

    var select = this.optionsS ? 256 : 112;
    layer.drawImage(app.images.optionsselector, 1280 + app.center.x - 128, select);

    layer.restore();

    layer.restore();

    // Fix loader
    layer.align(0, 0);

  },

  keydown: function (event) {
    var s = this.screen;
    if (event.key == "right") {
      if (s == 2) {
        if (this.optionsS) {
          this.musicVolume += 0.05;
          if (this.musicVolume > 1) {
            this.musicVolume = 1;
          }
        } else {
          this.soundVolume += 0.05;
          if (this.soundVolume > 1) {
            this.soundVolume = 1;
          }
        }
        this.updateVolumes();
        app.playSound("menu");
      }
    }
    else if (event.key == "left") {
      if (s == 2) {
        if (this.optionsS) {
          this.musicVolume -= 0.05;
          if (this.musicVolume < 0) {
            this.musicVolume = 0;
          }
        } else {
          this.soundVolume -= 0.05;
          if (this.soundVolume < 0) {
            this.soundVolume = 0;
          }
        }
        this.updateVolumes();
        app.playSound("menu");
      }
    }
    else if (event.key == "down") {
      if (s == 1) {
       this.helpScreen++;
        if (this.helpScreen > 2) {
          this.helpScreen = 0;
        }
        app.playSound("menu");
      } else if (s == 2) {
        app.playSound("menu");
        this.optionsS = !this.optionsS;
      }
    }
    else if (event.key == "up") {
      if (s == 1) {
        this.helpScreen--;
        if (this.helpScreen < 0) {
          this.helpScreen = 2;
        }
        app.playSound("menu");
      } else if (s == 2) {
        app.playSound("menu");
        this.optionsS = !this.optionsS;
      }
    }
    else if (event.key == "s") {
      this.app.setState(ENGINE.Game);
      app.music.stop(this.music);
    }
    else if (event.key == "h") {
      this.screen = 1;
      app.playSound("menu");
    }
    else if (event.key == "o") {
      this.screen = 2;
      app.playSound("menu");
    }
  },

  keyup: function (event) {
  }

};
