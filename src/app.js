var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        
        this._super();
        var layer = new LoginScreenLayer();
        this.addChild(layer);
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

