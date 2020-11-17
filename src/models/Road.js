var Road = cc.Sprite.extend({
    lastObstacle: null,
    count: 0,

    ctor: function () {
        this._super("#road.png");
        this.x = 0;
        this.y = MW.APPEAR_POSITION[1];
        this.anchorX = 0;
    },
    destroy: function () {
        this.active = false;
        this.visible = false;

        var selChild, children = this.getChildren();
        for (var i = 0; i < children.length; i++) {
            selChild = children[i];
            selChild.destroy();
        }
    },
    removeInactiveUnit: function () {
        var selChild, children = this.getChildren();
        for (var i = 0; i < children.length; i++) {
            selChild = children[i];
            if (selChild.active && (selChild.x + this.x <= 0)) {
                cc.log("unit destroyed from road" + this.count);
                selChild.destroy();
            }
        }
    }
});

Road.create = function () {
    var road = new Road();
    MW.CONTAINER.ROADS.push(road);
    g_sharedGameLayer.addChild(road, -5);
    return road;
};

Road.getOrCreate = function () {
    var selChild = null;
    for (var i = 0; i < MW.CONTAINER.ROADS.length; i++) {
        selChild = MW.CONTAINER.ROADS[i];
        if (selChild.active === false) {
            selChild.visible = true;
            selChild.active = true;
            return selChild;
        }
    }
    selChild = Road.create();
    return selChild;
};

Road.preSet = function () {
    var road = null;
    for (var i = 0; i < 2; i++) {
        road = Road.create();
        road.visible = false;
        road.active = false;
        road.count = i;
    }
};