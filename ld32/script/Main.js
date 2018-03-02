var SCALE = 1;

if (window.location.hash == "#2x") {
  SCALE = 2;
}


var app = new PLAYGROUND.Application({

  width: 640,
  height: 480,
  scale: SCALE,

  smoothing: false,

  create: function() {

    /* things to preload */ 

    this.loadSound("battle");
    this.loadSound("menu_music");

    this.loadImage("hand");
    this.loadImage("hand_jump");
    this.loadImage("angry_cupcake");
    this.loadImage("donut");
    this.loadImage("cookie");
    this.loadImage("chip");
    this.loadImage("spoon");
    this.loadImage("combo_amt");
    this.loadImage("healthbar");
    this.loadImage("blood");
    this.loadImage("combo_meter");  
    this.loadImage("gameover");  
    this.loadImage("heart"); 
    this.loadImage("menubg"); 
    this.loadImage("startscreen"); 
    this.loadImage("help"); 
    this.loadImage("options"); 
    this.loadImage("options02"); 
    this.loadImage("optionsselector"); 

    this.loadImage("bg01"); 
    this.loadImage("bg02"); 
    this.loadImage("bg03"); 
    this.loadImage("fg"); 
    // this.loadImage("bg04"); 

    this.loadImage("help01"); 
    this.loadImage("help02"); 
    this.loadImage("help03"); 

    this.loadSounds("enemy_hurt01", "enemy_hurt02", "enemy_hurt03", "enemy_death", "jump", "player_hurt", "player_death", "menu");

  },

  ready: function() {

    /* after preloading route events to the game state */

    this.setState(ENGINE.Menu);

  }

});
