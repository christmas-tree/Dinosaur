/**
 * Created by GSN on 7/6/2015.
 */

var ScreenMenu = cc.Layer.extend({
    _itemMenu: null,
    _beginPos: 0,

    ctor: function () {
        this._super();
        var size = cc.director.getVisibleSize();
        var yBtn = 3 * size.height / 5;

        var btnNewGame = gv.commonButton(200, 64, cc.winSize.width / 4, yBtn, "Start");
        this.addChild(btnNewGame);
        btnNewGame.addClickEventListener(this.onNewGame.bind(this));

    },
    onEnter: function () {
        this._super();
    },
    onNewGame: function (sender) {
        // cc.audioEngine.stopMusic();
        // cc.audioEngine.stopAllEffects();
        var scene = new cc.Scene();
        scene.addChild(new GameLayer());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },
});