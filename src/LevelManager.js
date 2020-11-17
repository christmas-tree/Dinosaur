var LevelManager = cc.Class.extend({
    _currentLevel: null,
    _gameLayer: null,

    count: 0,
    ctor: function (gameLayer) {
        if (!gameLayer) {
            throw "gameLayer must be non-nil";
        }
        this._gameLayer = gameLayer;
        this._currentLevel = 0;
    },

    switchLevel: function () {
        if (this._currentLevel === levels.length - 1) return;
        if (levels[this._currentLevel] >= levels[this._currentLevel + 1]) {
            this._currentLevel += 1;
        }
    },

    loadLevelResource: function () {
        if (g_sharedGameLayer.distSinceLastObstacle < MW.OBSTACLE_DIST) {
            cc.log("Try to add new cactus: " + g_sharedGameLayer.distSinceLastObstacle);
            return;
        }

        //load cactus
        var locLevel = levels[this._currentLevel];
        if (locLevel.hasMultipleCacti) {
            var types = ['single', 'multi'];
            var randomChoice = types[Math.floor(Math.random() * types.length)];
            this.addCactusToRoad(randomChoice);
        } else {
            this.addCactusToRoad('single');
        }

        // if (locLevel.hasBirds) {
        //     // add birds
        // }
        //
        // if (locLevel.hasDarkMode) {
        //     // add dark mode
        // }
    },

    addCactusToRoad: function (cactusType) {
        cc.log("Adding new cactus: " + g_sharedGameLayer.distSinceLastObstacle);

        var locRoad = g_sharedGameLayer._road, locRoadLength = g_sharedGameLayer._roadLength;
        var roadLengthShown = winSize.width - locRoad.x;
        var cactus = Cactus.getOrCreateCactus(cactusType);
        cactus.x = roadLengthShown;
        // cactus.x = roadLengthShown + Math.random() * (locRoadLength - roadLengthShown);
        g_sharedGameLayer.addCactus(cactus);
        this.lastObstacleShown = false;

        g_sharedGameLayer.distSinceLastObstacle = 0;
        this.count++;
    }
});
