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
        if (MW.SCORE >= levels[this._currentLevel + 1].minScore) {
            this._currentLevel += 1;
        }
    },

    loadLevelResource: function () {
        if (g_sharedGameLayer.distSinceLastObstacle < MW.OBSTACLE_DIST) {
            return;
        }

        //load cactus
        var locLevel = levels[this._currentLevel];
        var newObstacleType = locLevel.obstacles[Math.floor(Math.random() * locLevel.obstacles.length)]

        var obs;
        switch (newObstacleType) {
            case 'singleCacti':
                obs = Cactus.getOrCreateCactus('single');
                this.addObstacleToRoad(obs);
                break;
            case 'multiCacti':
                obs = Cactus.getOrCreateCactus('multi');
                this.addObstacleToRoad(obs);
                break;
            case 'birds':
                obs = Bird.getOrCreateBird();
                obs.y = g_sharedGameLayer._dinosaur.height * (1 + 1.5 * Math.random());
                this.addObstacleToRoad(obs);
                break;
            case 'nightMode':
                break;
        }
    },

    addObstacleToRoad: function (obstacle) {
        var locRoad = g_sharedGameLayer._road, locRoadLength = g_sharedGameLayer._roadLength;
        var roadLengthShown = winSize.width - locRoad.x;
        // obstacle.x = roadLengthShown;
        obstacle.x = roadLengthShown + (Math.random() * (locRoadLength - roadLengthShown));
        g_sharedGameLayer.addObstacle(obstacle);
        this.lastObstacleShown = false;
    }
});
