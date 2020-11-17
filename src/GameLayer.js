STATE_PLAYING = 0;
STATE_GAMEOVER = 1;
MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;

var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
    _time: null,
    _tmpScore: 0,
    _dinosaur: null,
    _background: null,
    _backgroundRe: null,
    _backgroundLength: 10,
    _road: null,
    _roadRe: null,
    _roadLength: 10,
    lbScore: null,
    // screenRect: null,
    _state: STATE_PLAYING,
    distSinceLastObstacle: 0,
    lastObstacleShown: false,
    speed: MW.INITIAL_SPEED,

    ctor: function () {
        this._super();
        this.init();
    },
    init: function () {
        cc.spriteFrameCache.addSpriteFrames(res.game_plist, res.game_png);

        // reset global values
        MW.CONTAINER.CACTI = [];
        MW.CONTAINER.BIRDS = [];
        MW.CONTAINER.BACKGROUND = [];
        MW.CONTAINER.CLOUDS = [];
        MW.CONTAINER.ROADS = [];

        MW.SCORE = 0;
        this._state = STATE_PLAYING;

        this._levelManager = new LevelManager(this);

        // this.screenRect = cc.rect(0, 0, winSize.width, winSize.height + 10);

        // score label
        this.lbScore = cc.LabelTTF.create("Moves: 0", "Arial", "32.0", null, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        // this.lbScore.setPosition(90,50);
        this.addChild(this.lbScore, 1000);

        // this.addTouchListener();
        this.addKeyboardListener();

        // schedule
        this.scheduleUpdate();
        this.schedule(this.scoreCounter, 1);
        this.schedule(this.increaseSpeed, 1);

        // if (MW.SOUND)
        //     cc.audioEngine.playMusic(cc.sys.os === cc.sys.OS_WP8 || cc.sys.os === cc.sys.OS_WINRT ? res.bgMusic_wav : res.bgMusic_mp3, true);

        g_sharedGameLayer = this;

        // Init background
        ScrollingBackground.preSet();
        this._background = ScrollingBackground.getOrCreate();
        this._backgroundLength = this._background.width;

        // Init road
        Road.preSet();
        this._road = Road.getOrCreate();
        this._roadLength = this._road.width;

        //pre set -- Road must be preset before cactus
        Cloud.preSet();
        Cactus.preSet();

        // Create dino
        this._dinosaur = new Dinosaur();
        this._dinosaur.setY(this._dinosaur.y + this._road.height);
        this.addChild(this._dinosaur);

        return true;
    },


    // !TODO:
    // addTouchListener: function () {
    //     var self = this;
    //     cc.eventManager.addListener({
    //         event: cc.EventListener.TOUCH_ONE_BY_ONE,
    //         swallowTouches: true,
    //         onTouchBegan: function (touch, event) {
    //             return true;
    //         },
    //         onTouchMoved: (touch, event) => {
    //             var touchDelta = touch.getDelta();
    //             cc.log(touchDelta.x);
    //             cc.log(touchDelta.y);
    //             var newPos = cc.p(self._dinosaur.x + touchDelta.x, self._dinosaur.y + touchDelta.y);
    //             this._dinosaur.setPosition(newPos);
    //         },
    //     }, this);
    // },

    addKeyboardListener: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (key, event) {
                MW.PRESSED_KEY = key;
            },
        }, this);
    },

    increaseSpeed: function () {
        this.speed += MW.SPEED_INCREASE_RATE;
        MW.OBSTACLE_DIST = 300;
    },

    scoreCounter: function () {
        if (this._state === STATE_PLAYING) {
            this._time++;
            this._levelManager.loadLevelResource();
        }
    },

    update: function (dt) {
        if (this._state === STATE_PLAYING) {
            this.checkIsCollide();
            this.updateUI();
            // this._movingBackground(dt);
            this._movingRoad(dt);
            this._road.removeInactiveUnit();
        }
    },
    checkIsCollide: function () {
        var selChild;

        // check collide
        var dinosaur = this._dinosaur;
        for (var i = 0; i < MW.CONTAINER.CACTI.length; i++) {
            selChild = MW.CONTAINER.CACTI[i];
            if (!selChild.active)
                continue;

            if (this.collide(selChild, dinosaur)) {
                if (dinosaur.active) {
                    this._state = STATE_GAMEOVER;
                    this._dinosaur = null;
                    this.runAction(cc.sequence(
                        cc.delayTime(0.2),
                        cc.callFunc(this.onGameOver, this)
                    ));
                }
            }
        }
    },
    updateUI: function () {
        if (this._tmpScore < MW.SCORE) {
            this._tmpScore += 1;
        }
        this.lbScore.setString("Score: " + this._tmpScore);
    },
    collide: function (a, b) {
        var aRect = a.getBoundingBoxToWorld();
        var bRect = b.getBoundingBoxToWorld();
        return cc.rectIntersectsRect(aRect, bRect);
    },

    _movingBackground: function (dt) {
        var movingDist = 0.5 * this.speed * dt;

        var locBackDistance = this._backgroundLength, locBackSky = this._background;
        var currPosX = locBackSky.x - movingDist;
        var locBackSkyRe = this._backgroundRe;

        if (locBackDistance + currPosX <= winSize.width) {
            if (locBackSkyRe != null)
                throw "The memory is leaking at moving background";
            locBackSkyRe = this._background;
            this._backgroundRe = this._background;

            //create a new background
            this._background = ScrollingBackground.getOrCreate();
            locBackSky = this._background;
            locBackSky.x = currPosX + locBackDistance - 5;
        } else {
            locBackSky.x = currPosX;
        }

        if (locBackSkyRe) {
            currPosX = locBackSkyRe.x - movingDist;
            if (currPosX + locBackDistance < 0) {
                locBackSkyRe.destroy();
                this._backgroundRe = null;
            } else
                locBackSkyRe.x = currPosX;
        }
    },
    _movingRoad: function (dt) {
        var movingDist = this.speed * dt;

        var locRoadLength = this._roadLength, locRoad = this._road;
        var currPosX = locRoad.x - movingDist;
        var locRoadRe = this._roadRe;

        if (this._road.lastObstacle &&
            this._road.lastObstacle.x + this._road.x <= winSize.width
            && !this.lastObstacleShown)
        {
            this.distSinceLastObstacle = 0;
            this.lastObstacleShown = true;
        } else {
            this.distSinceLastObstacle += movingDist;
        }

        if (locRoadLength + currPosX <= winSize.width) {
            if (locRoadRe != null)
                throw "The memory is leaking at moving road";
            locRoadRe = this._road;
            this._roadRe = this._road;

            //create a new road
            this._road = Road.getOrCreate();
            locRoad = this._road;
            locRoad.x = currPosX + locRoadLength - 5;
        } else {
            locRoad.x = currPosX;
        }

        if (locRoadRe) {
            currPosX = locRoadRe.x - movingDist;
            if (currPosX + locRoadLength < 0) {
                locRoadRe.destroy();
                this._roadRe = null;
            } else
                locRoadRe.x = currPosX;
        }
    },
    onGameOver: function () {
        // cc.audioEngine.stopMusic();
        // cc.audioEngine.stopAllEffects();
        var scene = new cc.Scene();
        scene.addChild(new GameOverLayer());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },

    addCactus: function (cactus) {
        var locRoad = this._road;
        locRoad.addChild(cactus);
        this._road.lastObstacle = cactus;
        this.lastObstacleShown = false;
    }
});

GameLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameLayer();
    scene.addChild(layer, 1);
    return scene;
};
