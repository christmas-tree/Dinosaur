var Cloud = cc.Sprite.extend({
    active: true,
    ctor: function () {
        this._super("#cloud.png");
        this.anchorX = 0;
        this.anchorY = 0;
        this.y = MW.MIN_CLOUD_HEIGHT + Math.floor(Math.random() * (MW.MIN_CLOUD_HEIGHT - MW.MAX_CLOUD_HEIGHT));
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


var ScrollingBackground = cc.Sprite.extend({
    active: false,

    ctor: function () {
        this._super();
        this.width = winSize.width * 2;
        this.anchorX = 0;
        this.anchorY = 0;
    },
    destroy: function () {
        this.active = false;
        this.visible = false;
        var children = this.getChildren();
        var selChild;
        for (var i = children.length - 1; i >= 0; i++) {
            selChild = children[i];
            selChild.destroy();
            this.removeChild(selChild);
        }
    }
})

ScrollingBackground.create = function () {
    var background = new ScrollingBackground();
    MW.CONTAINER.BACKGROUND.push(background);
    g_sharedGameLayer.addChild(background, -10);
    return background;
};

ScrollingBackground.getOrCreate = function () {
    var background = null;
    for (var i = 0; i < MW.CONTAINER.BACKGROUND.length; i++) {
        background = MW.CONTAINER.BACKGROUND[i];
        if (background.active === false) {
            background.visible = true;
            background.active = true;
        }
    }
    if (!background)
        background = ScrollingBackground.create();

    // Add clouds to background
    var randNum = Math.floor(Math.random() * 4);
    var cloud;
    for (var i = 0; i < randNum; i++) {
        cloud = Cloud.getOrCreate();
        cloud.x = winSize.width - background.x;
        cloud.y = MW.MIN_CLOUD_HEIGHT + Math.floor(Math.random() * (MW.MIN_CLOUD_HEIGHT - MW.MAX_CLOUD_HEIGHT));
        background.addChild(cloud);
    }
    return background;
};

ScrollingBackground.preSet = function () {
    var background = null;
    for (var i = 0; i < 2; i++) {
        background = ScrollingBackground.create();
        background.visible = false;
        background.active = false;
    }
};