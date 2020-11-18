var Dinosaur = cc.Sprite.extend({
    status: MW.DINO_STATUS.RUNNING,
    jumpVelocity: 0,
    speedDrop: false,
    active: true,
    runAnimate: null,
    duckAnimate: null,
    initY: null,

    ctor: function () {
        this._super("#t_rex_1.png");
        this.x = MW.APPEAR_POSITION[0];
        this.setY(MW.APPEAR_POSITION[1]);

        this.scheduleUpdate();
    },
    setY: function (y) {
        this.y = y;
        this.initY = y;
    },
    update: function (dt) {
        this.updateMove();
        if (this.status === MW.DINO_STATUS.JUMPING) {
            this.jumpVelocity += MW.GRAVITY * dt;
            var newY = this.y + this.jumpVelocity * dt;
            if (newY > this.initY) {
                this.y = newY;
            } else {
                this.y = this.initY;
                this.run()
            }
        }
    },

    run: function () {
        this.status = MW.DINO_STATUS.RUNNING;
        this.stopAllActions();

        // set run frames
        var run0 = cc.spriteFrameCache.getSpriteFrame("t_rex_3.png");
        var run1 = cc.spriteFrameCache.getSpriteFrame("t_rex_4.png");
        var runFrames = [run0, run1];
        // run animate
        var runAnimation = cc.animate(new cc.Animation(runFrames, 0.1));
        this.runAction(runAnimation.repeatForever());
    },
    duck: function () {
        this.status = MW.DINO_STATUS.DUCKING;
        this.stopAllActions();
        // set duck frames
        var duck0 = cc.spriteFrameCache.getSpriteFrame("t_rex_crunch_1.png");
        var duck1 = cc.spriteFrameCache.getSpriteFrame("t_rex_crunch_2.png");
        var duckFrames = [duck0, duck1];
        // run animate
        var duckAnimation = cc.animate(new cc.Animation(duckFrames, 0.1));

        this.runAction(duckAnimation.repeatForever());
    },
    startJump: function () {
        this.status = MW.DINO_STATUS.JUMPING;
        this.jumpVelocity = MW.JUMP_INIT_VELOCITY;
        this.stopAllActions();
    },
    dropDown: function () {
        this.jumpVelocity = MW.DROP_VELOCITY;
    },
    updateMove: function () {
        if (MW.PRESSED_KEY === cc.KEY.space || MW.PRESSED_KEY === cc.KEY.up) {
            if (this.status === MW.DINO_STATUS.RUNNING || this.status === MW.DINO_STATUS.DUCKING) {
                return this.startJump();
            }
        }
        if (MW.PRESSED_KEY === cc.KEY.down) {
            if (this.status === MW.DINO_STATUS.JUMPING) {
                return this.dropDown();
            } else if (this.status === MW.DINO_STATUS.RUNNING) {
                return this.duck();
            }
        } else {
            if (this.status === MW.DINO_STATUS.DUCKING) {
                this.run();
            }
        }
    },
    destroy: function () {
        this.stopAllActions();
        this.unscheduleAllCallbacks();
        var die = cc.spriteFrameCache.getSpriteFrame("t_rex_5.png");
        this.setSpriteFrame(die);
    },
});

