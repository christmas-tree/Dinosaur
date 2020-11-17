var Cloud = cc.Sprite.extend({
    active: true,
    ctor: function () {
        this._super("#cloud.png");
        this.anchorX = 0;
        this.anchorY = 0;
        this.y = MW.MIN_CLOUD_HEIGHT + Math.floor(Math.random() * (MW.MIN_CLOUD_HEIGHT - MW.MAX_CLOUD_HEIGHT));
        this.x = cc.director.getWinSize().width;
    },
    destroy: function () {
        this.visible = false;
        this.active = false;
    }
});

Cloud.create = function () {
    var cloud = new Cloud();
    MW.CONTAINER.CLOUDS.push(cloud);
    return cloud;
};

Cloud.getOrCreate = function () {
    var selChild = null;
    for (var j = 0; j < MW.CONTAINER.CLOUDS.length; j++) {
        selChild = MW.CONTAINER.CLOUDS[j];
        if (selChild.active === false) {
            selChild.visible = true;
            selChild.active = true;
            this.y = MW.MIN_CLOUD_HEIGHT + Math.floor(Math.random() * (MW.MIN_CLOUD_HEIGHT - MW.MAX_CLOUD_HEIGHT));
            this.x = cc.director.getWinSize().width;
            return selChild;
        }
    }
    selChild = Cloud.create();
    return selChild;
};


Cloud.preSet = function () {
    var cloud = null;
    for (var i = 0; i < 2; i++) {
        cloud = Cloud.create();
        cloud.visible = false;
        cloud.active = false;
    }
};


var ScrollingBackground = cc.Layer.extend({
    active: false,
    ctor: function () {
        this._super();
        this.width = winSize.width;
        var randNum = Math.floor(Math.random() * 3);
        for (var i = 0; i < randNum; i++) {
            this.addChild(Cloud.getOrCreate());
        }

        this.anchorX = 0;
    },
    destroy: function() {
        this.active = false;
        this.visible = false;
    }
})

ScrollingBackground.create = function() {
    var background = new ScrollingBackground();
    MW.CONTAINER.BACKGROUND.push(background);
    g_sharedGameLayer.addChild(background, -10);
    cc.log("Creating: anchorX = " + background.anchorX);
    return background;
};

ScrollingBackground.getOrCreate = function() {
    var selChild = null;
    for (var i = 0; i < MW.CONTAINER.BACKGROUND.length; i++) {
        selChild = MW.CONTAINER.BACKGROUND[i];
        if (selChild.active === false) {
            selChild.visible = true;
            selChild.active = true;
            cc.log("Getting: anchorX = " + selChild.anchorX);
            return selChild;
        }
    }
    selChild = ScrollingBackground.create();
    return selChild;
};

ScrollingBackground.preSet = function () {
    var background = null;
    for (var i = 0; i < 2; i++) {
        background = ScrollingBackground.create();
        background.visible = false;
        background.active = false;
    }
};