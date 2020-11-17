

var Dinosaur = cc.Sprite.extend({
    status: MW.DINO_STATUS.RUNNING,
    jumpVelocity: 0,
    speedDrop: false,
    active:true,
    runAnimate: null,
    duckAnimate: null,
    initY: null,

    ctor:function () {
        this._super("#t_rex_1.png");
        this.x = MW.APPEAR_POSITION[0];
        this.setY(MW.APPEAR_POSITION[1]);

        // set run frames
        var run0 = cc.spriteFrameCache.getSpriteFrame("t_rex_3.png");
        var run1 = cc.spriteFrameCache.getSpriteFrame("t_rex_4.png");
        var runFrames = [run0, run1];
        // run animate
        var runAnimation = new cc.Animation(runFrames, 0.2);
        this.runAnimate = cc.animate(runAnimation);
        this.runAnimate.retain();

        // set duck frames
        var duck0 = cc.spriteFrameCache.getSpriteFrame("t_rex_crunch_1.png");
        var duck1 = cc.spriteFrameCache.getSpriteFrame("t_rex_crunch_2.png");
        var duckFrames = [duck0, duck1];
        // run animate
        var duckAnimation = new cc.Animation(duckFrames, 0.2);
        this.duckAnimate = cc.animate(duckAnimation);
        this.duckAnimate.retain();

        this.scheduleUpdate();
        // this.initBornSprite();
        // this.born();
    },
    setY: function(y) {
        this.y = y;
        this.initY = y;
    },
    update:function (dt) {
        this.updateMove();
        if (this.status === MW.DINO_STATUS.JUMPING) {
            this.jumpVelocity += MW.GRAVITY * dt;
            var newY = this.y + this.jumpVelocity * dt;
            if (newY > this.initY) {
                this.y = newY;
            } else {
                this.y = this.initY;
                this.status = MW.DINO_STATUS.RUNNING;
            }
        }
    },

    run: function() {
        this.status = MW.DINO_STATUS.RUNNING;
        this.runAction(this.runAnimate.repeatForever());
    },
    duck: function() {
        this.status = MW.DINO_STATUS.DUCKING;
        this.runAction(this.duckAnimate.repeatForever());
    },
    startJump: function() {
        this.status = MW.DINO_STATUS.JUMPING;
        this.jumpVelocity = MW.JUMP_INIT_VELOCITY;
    },
    dropDown: function() {
        this.jumpVelocity = MW.DROP_VELOCITY;
    },
    updateMove:function() {
        if (MW.PRESSED_KEY === cc.KEY.space || MW.PRESSED_KEY === cc.KEY.up) {
            if (this.status === MW.DINO_STATUS.RUNNING || this.status === MW.DINO_STATUS.DUCKING) {
                this.startJump();
            }
        }
        if (MW.PRESSED_KEY === cc.KEY.down) {
            if (this.status === MW.DINO_STATUS.JUMPING) {
                this.dropDown();
            }
            else if (this.status === MW.DINO_STATUS.RUNNING) {
                this.duck();
            }
        }
        MW.PRESSED_KEY = null;
    },
    destroy:function () {
        // if (MW.SOUND) {
        //     cc.audioEngine.playEffect(cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_WINRT ? res.shipDestroyEffect_wav : res.shipDestroyEffect_mp3);
        // }
    },
});

