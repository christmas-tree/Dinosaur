var GameOverLayer = cc.Layer.extend({
    _ship: null,
    _lbScore: 0,

    ctor: function () {
        this._super();
        this.init();
    },
    init: function () {
        var replayBtn = new cc.Sprite("#return.png");
        replayBtn.attr({
            x: this.width / 2,
            y: this.height + replayBtn.height,
            anchorY: 0.0,
            scale: 1.5
        })
        this.addChild(replayBtn, 9);

        var lbScore = new cc.LabelTTF.create("Score: " + MW.SCORE, "Press Start 2P Regular", 32,
            null, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        lbScore.x = this.width / 2;
        lbScore.y = 0;
        lbScore.anchorY = 1.0;
        lbScore.color = cc.BLACK;
        this.addChild(lbScore, 10);

        this.addTouchListener();
        this.addKeyboardListener();

        var moveUp = cc.moveTo(0.5, cc.p(this.width / 2, this.height / 2 - 10));
        moveUp.easing(cc.easeInOut(3.0));
        lbScore.runAction(moveUp);

        var moveDown = cc.moveTo(0.5, cc.p(this.width / 2, this.height / 2 + 10));
        moveDown.easing(cc.easeInOut(3.0));
        replayBtn.runAction(moveDown);

        // if(MW.SOUND){
        //     cc.audioEngine.playMusic(cc.sys.os === cc.sys.OS_WP8 || cc.sys.os === cc.sys.OS_WINRT ? res.mainMainMusic_wav : res.mainMainMusic_mp3, true);
        // }

        return true;
    },
    addTouchListener: function () {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                self.onPlayAgain();
                return true;
            },
        }, this);
    },

    addKeyboardListener: function () {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (key, event) {
                if (key === cc.KEY.space) {
                    self.onPlayAgain();
                }
            },
        }, this);
    },

    onPlayAgain: function () {
        // cc.audioEngine.stopMusic();
        // cc.audioEngine.stopAllEffects();
        MW.PRESSED_KEY = null;
        var scene = new cc.Scene();
        scene.addChild(new GameLayer());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
});

GameOverLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameOverLayer();
    scene.addChild(layer);
    return scene;
};
