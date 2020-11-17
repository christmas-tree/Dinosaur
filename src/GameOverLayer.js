
var GameOverLayer = cc.Layer.extend({
    _ship:null,
    _lbScore:0,

    ctor:function(){
        this._super();
        this.init();
    },
    init:function () {
        var sp = new cc.Sprite("#return.png");
        sp.anchorX = 0;
        sp.anchorY = 0;
        sp.scale = MW.SCALE;
        this.addChild(sp, 0, 1);

        var logo = new cc.Sprite(res.gameOver_png);
        this.addChild(logo, 9);

        var lbScore = new cc.LabelTTF("Your Score:"+MW.SCORE,"Arial Bold",24);
        lbScore.x = 240;
        lbScore.y = 370;
        lbScore.color = cc.color(255,0,0);
        this.addChild(lbScore,10);
        // if(MW.SOUND){
        //     cc.audioEngine.playMusic(cc.sys.os === cc.sys.OS_WP8 || cc.sys.os === cc.sys.OS_WINRT ? res.mainMainMusic_wav : res.mainMainMusic_mp3, true);
        // }

        return true;
    },
    onPlayAgain:function (pSender) {
        // cc.audioEngine.stopMusic();
        // cc.audioEngine.stopAllEffects();
        var scene = new cc.Scene();
        scene.addChild(new GameLayer());
        cc.director.runScene(new cc.TransitionFade(1.2,scene));
    }
});

GameOverLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameOverLayer();
    scene.addChild(layer);
    return scene;
};
