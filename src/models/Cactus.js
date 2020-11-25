// Cactus
COUNT = 0;

var Cactus = cc.Sprite.extend({
    type: MW.CACTUS_TYPE_DEFAULT,
    active: true,
    ctor: function (cactusType) {
        this.type = cactusType || this.type;
        // Choose a random texture for cactus
        var textureChoices = CactusType[this.type].textureName;
        var randomTexture = textureChoices[Math.floor(Math.random() * textureChoices.length)];
        this._super("#" + randomTexture);

        this.anchorY = 0;
        this.x = winSize.width;
        this.y = 0;
        COUNT++;
        this.count = COUNT;
    },
    destroy: function () {
        this.active = false;
        this.visible = false;
        this.removeFromParent(false);
    }
});

Cactus.getOrCreateCactus = function (cactusType) {
    var selChild = null;
    var cactiPool = MW.CONTAINER.CACTI;
    for (var i = 0; i < cactiPool.length; i++) {
        selChild = cactiPool[i];
        if (selChild.type === cactusType && selChild.active === false) {
            selChild.visible = true;
            selChild.active = true;
            return selChild;
        }
    }
    selChild = Cactus.create(cactusType);

    return selChild;
};

Cactus.create = function (cactusType) {
    var cactus = new Cactus(cactusType);
    cactus.retain();
    MW.CONTAINER.CACTI.push(cactus);
    return cactus;
};

Cactus.preSet = function () {
    var cactus = null;
    for (var i = 0; i < 5; i++) {
        cactus = Cactus.create();
        cactus.visible = false;
        cactus.active = false;
    }
};
