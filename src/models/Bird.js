// Bird
var Bird = cc.Sprite.extend({
    active: true,
    ctor: function () {
        this._super();

        var bird1 = cc.spriteFrameCache.getSpriteFrame("bird_1.png");
        var bird2 = cc.spriteFrameCache.getSpriteFrame("bird_2.png");
        var birdFrames = [bird1, bird2];
        // run animate
        var birdAnimation = cc.animate(new cc.Animation(birdFrames, 0.1));

        this.runAction(birdAnimation.repeatForever());
    },
    destroy: function () {
        this.active = false;
        this.visible = false;
        this.removeFromParent(false);
    }
});

Bird.getOrCreateBird = function () {
    var selChild = null;
    var birdPool = MW.CONTAINER.BIRDS;
    for (var i = 0; i < birdPool.length; i++) {
        selChild = birdPool[i];
        if (selChild.active === false) {
            selChild.visible = true;
            selChild.active = true;
            return selChild;
        }
    }
    selChild = Bird.create();
    return selChild;
};

Bird.create = function () {
    var bird = new Bird();
    bird.retain();
    MW.CONTAINER.BIRDS.push(bird);
    return bird;
};

Bird.preSet = function () {
    var bird = null;
    for (var i = 0; i < 5; i++) {
        bird = Bird.create();
        bird.visible = false;
        bird.active = false;
    }
};
