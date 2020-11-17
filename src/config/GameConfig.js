var MW = MW || {};
var winSize = cc.director.getWinSize();

//game state
MW.GAME_STATE = {
    HOME:0,
    PLAY:1,
    OVER:2
};

//keys
MW.KEYS = [];

//score
MW.SCORE = 0;

//sound
MW.SOUND = true;

//delta x
MW.DELTA_X = -100;

//offset x
MW.OFFSET_X = -24;

//rot
MW.ROT = -5.625;

//container
MW.CONTAINER = {
    CACTI: [],
    BIRDS:[],
    BACKGROUND: [],
    CLOUDS: [],
    ROADS: []
};


MW.LOGOY = 350;
MW.FLAREY = 445;

MW.SCALE = 1.5;
MW.WIDTH = 480;
MW.HEIGHT = 720;
MW.FONTCOLOR = "#1f2d96";
MW.menuHeight = 36;
MW.menuWidth = 123;

MW.CACTUS_TYPE_DEFAULT = "single"

MW.DINO_STATUS = {
    CRASHED: 'CRASHED',
    DUCKING: 'DUCKING',
    JUMPING: 'JUMPING',
    RUNNING: 'RUNNING',
    WAITING: 'WAITING'
};

MW.INITIAL_SPEED = 500
MW.SPEED_INCREASE_RATE = 20

MW.GRAVITY = -4000
MW.JUMP_INIT_VELOCITY = 1250
MW.DROP_VELOCITY = -3000
MW.MAX_JUMP_HEIGHT = 30
MW.MIN_JUMP_HEIGHT = 30

MW.OBSTACLE_DIST = 300

MW.APPEAR_POSITION = [100, winSize.height/3]
MW.MIN_CLOUD_HEIGHT = 100
MW.MAX_CLOUD_HEIGHT = 100

