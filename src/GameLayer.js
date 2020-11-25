STATE_PLAYING = 0;
STATE_GAMEOVER = 1;
STATE_PAUSE = 2;
MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;

var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
    _dinosaur: null,
    _background: null,
    _backgroundRe: null,
    _backgroundLength: 10,
    _road: null,
    _roadRe: null,
    _roadLength: 10,
    lbScore: null,
    _state: STATE_PAUSE,
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
        this._levelManager = new LevelManager(this);

        // score label
        this.lbScore = cc.LabelTTF.create(String(MW.SCORE), "Press Start 2P Regular", 32, null, cc.TEXT_ALIGNMENT_RIGHT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this.lbScore.attr({
            x: winSize.width - 350,
            y: winSize.height - 200,
            anchorX: 1.0,
            anchorY: 1.0,
            color: cc.BLACK
        });
        this.addChild(this.lbScore, 1000);

        this.lbHighScore = cc.LabelTTF.create(String(MW.HIGH_SCORE), "Press Start 2P Regular", 32, null, cc.TEXT_ALIGNMENT_RIGHT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this.lbHighScore.attr({
            x: this.lbScore.x - this.lbScore.width - 60,
            y: winSize.height - 200,
            anchorX: 1.0,
            anchorY: 1.0,
            color: cc.BLACK
        });
        this.addChild(this.lbHighScore, 1000);

        // this.addTouchListener();
        this.addKeyboardListener();

        // schedule
        this.scheduleUpdate();
        this.schedule(this.loadLevelResource, 1);
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

        this.addChild(new ScreenMenu());

        return true;
    },

    addKeyboardListener: function () {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (key, event) {
                if (self._state === STATE_PAUSE && key === cc.KEY.space) {
                    self.startGame();
                }
                MW.PRESSED_KEY = key;
            },
            onKeyReleased: function (key, event) {
                if (MW.PRESSED_KEY === key) {
                    MW.PRESSED_KEY = null;
                }
            }
        }, this);
    },

    increaseSpeed: function () {
        var newSpeed = this.speed + MW.SPEED_INCREASE_RATE;
        if (newSpeed <= MW.SPEED_MAX) {
            this.speed = newSpeed;
        }
        MW.OBSTACLE_DIST = 300;
    },

    loadLevelResource: function () {
        if (this._state === STATE_PLAYING) {
            this._levelManager.switchLevel();
            this._levelManager.loadLevelResource();
        }
    },

    update: function (dt) {
        if (this._state === STATE_PLAYING) {
            this.checkIsCollide();
            // this._movingBackground(dt);
            this._movingRoad(dt);
            this._road.removeInactiveUnit();
            this.updateScore();
        }
    },
    checkIsCollide: function () {
        var selChild, collide = false;
        // check collide
        var dinosaur = this._dinosaur;
        for (var i = 0; i < MW.CONTAINER.CACTI.length; i++) {
            selChild = MW.CONTAINER.CACTI[i];
            if (!selChild.active)
                continue;
            if (this.collide(selChild, dinosaur)) {
                collide = true;
            }
        }
        if (!collide) {
            for (i = 0; i < MW.CONTAINER.BIRDS.length; i++) {
                selChild = MW.CONTAINER.BIRDS[i];
                if (!selChild.active)
                    continue;
                if (this.collide(selChild, dinosaur)) {
                    collide = true;
                }
            }
        }

        if (collide && dinosaur.active) {
            this._state = STATE_GAMEOVER;
            this._dinosaur.destroy();
            this._dinosaur = null;
            this.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.callFunc(this.onGameOver, this)
            ));
        }
    },
    updateScore: function () {
        MW.SCORE += 1;
        if (MW.SCORE > MW.HIGH_SCORE) {
            var blink = cc.Blink.create(2, 5);
            MW.HIGH_SCORE = MW.SCORE;
            this.lbHighScore.setString(String(MW.HIGH_SCORE));
            this.lbHighScore.runAction(blink);
        }
        this.lbScore.setString(String(MW.SCORE));
        this.lbHighScore.x = this.lbScore.x - this.lbScore.width - 60;
    },
    collide: function (a, b) {
        var aRect = a.getBoundingBoxToWorld();
        var bRect = b.getBoundingBoxToWorld();

        aRect.width *= 0.95;
        aRect.height *= 0.95;
        bRect.width *= 0.95;
        aRect.height *= 0.95;

        return cc.rectIntersectsRect(aRect, bRect);
    },

    _movingBackground: function (dt) {
        var movingDist = this.speed * dt;

        var locBackgroundLength = this._backgroundLength, locBackground = this._background;
        var currPosX = locBackground.x - movingDist;
        var locBackgroundRe = this._backgroundRe;

        if (locBackgroundLength + currPosX <= winSize.width) {
            cc.log("locBackgroundLength: " + locBackgroundLength);
            cc.log("currPosX: " + currPosX);

            if (locBackgroundRe != null)
                throw "The memory is leaking at moving background";
            locBackgroundRe = this._background;
            this._backgroundRe = this._background;

            //create a new background
            this._background = ScrollingBackground.getOrCreate();
            locBackground = this._background;
            locBackground.x = currPosX + locBackgroundLength - 5;
        } else {
            locBackground.x = currPosX;
        }

        if (locBackgroundRe) {
            currPosX = locBackgroundRe.x - movingDist;
            if (currPosX + locBackgroundLength < 0) {
                locBackgroundRe.destroy();
                this._backgroundRe = null;
            } else
                locBackgroundRe.x = currPosX;
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
    startGame: function () {
        this._dinosaur.run();
        this._state = STATE_PLAYING;
    },
    onGameOver: function () {
        // cc.audioEngine.stopMusic();
        // cc.audioEngine.stopAllEffects();
        cc.convertTo
        this.unscheduleAllCallbacks();
        this._gameOverLayer = new GameOverLayer();
        this.addChild(this._gameOverLayer);
    },

    addObstacle: function (obstacle) {
        var locRoad = this._road;
        locRoad.addChild(obstacle);
        this._road.lastObstacle = obstacle;
        this.lastObstacleShown = false;
    },
});

GameLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameLayer();
    scene.addChild(layer, 1);
    return scene;
};
