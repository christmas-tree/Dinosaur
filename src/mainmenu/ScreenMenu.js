var ScreenMenu = cc.Layer.extend({
    _itemMenu: null,
    _beginPos: 0,

    ctor: function () {
        this._super();
        // var size = cc.director.getVisibleSize();
        // var yBtn = 3 * size.height / 5;
        // var btnNewGame = gv.commonButton(200, 64, cc.winSize.width / 4, yBtn, "Start");
        // this.addChild(btnNewGame);
        // btnNewGame.addClickEventListener(this.onNewGame.bind(this));

        var label = cc.LabelTTF.create("DINOSAUR", "Press Start 2P Regular", 48, null, cc.TEXT_ALIGNMENT_RIGHT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        label.attr({
            x: this.width / 2,
            y: this.height / 2,
            color: cc.BLACK
        });
        this.addChild(label, 1000);

        var lbInstruction = cc.LabelTTF.create("Press Space to start running", "Press Start 2P Regular", 18, null, cc.TEXT_ALIGNMENT_RIGHT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        lbInstruction.attr({
            x: this.width / 2,
            y: label.y - label.height/ 2 - 60,
            color: cc.BLACK
        });
        this.addChild(lbInstruction, 1000);

        this.addKeyboardListener();
    },
    addKeyboardListener: function () {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (key, event) {
                if (key === cc.KEY.space) {
                    var fade = cc.FadeOut.create(1.0);
                    self.runAction(fade);
                    self.visible = false;
                }
            },
        }, this);
    },

});