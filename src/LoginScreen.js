var MaxLevelLogin = 0;
var selectedLevel = 1;
let chooseLevelLabel = null;
var LoginScreenLayer = cc.Layer.extend({
    mainBgMusic: null,
    chooseLevelLabel : null,
    maxLevel:MaxLevelInGame,
    ctor: function () {
        this._super();
        this.setBackgroundLoginScreen();
        this.addMenuToStart();
        this.addMaxReachedLevel();
        this.selectLevelHandler();
        this.addIncreaseButton();
        this.addDecreaseButton();
        this.addSelectLevelScrollView();
        this.addSelectThroughScroll();
        var winSize =cc.director.getWinSize();
//        var ShaderNode = cc.GLNode.extend({
//            ctor:function(vertexShader, framentShader) {
//                this._super();
//                this.init();
//
//                if( 'opengl' in cc.sys.capabilities ) {
//                    this.width = 256;
//                    this.height = 256;
//                    this.anchorX = 0.5;
//                    this.anchorY = 0.5;
//
//                    this.shader = cc.GLProgram.create(vertexShader, framentShader);
//                    this.shader.retain();
//                    this.shader.addAttribute("aVertex", cc.VERTEX_ATTRIB_POSITION);
//                    this.shader.link();
//                    this.shader.updateUniforms();
//
//                    var program = this.shader.getProgram();
//                    this.uniformCenter = gl.getUniformLocation( program, "center");
//                    this.uniformResolution = gl.getUniformLocation( program, "resolution");
//                    this.initBuffers();
//
//                    this.scheduleUpdate();
//                    this._time = 0;
//                }
//            },
//            draw:function() {
//                this.shader.use();
//                this.shader.setUniformsForBuiltins();
//
//                //
//                // Uniforms
//                //
//                var frameSize = cc.view.getFrameSize();
//                var visibleSize = cc.view.getVisibleSize();
//                var retinaFactor = cc.view.getDevicePixelRatio();
//                var position = this.getPosition();
//
//                var centerx = position.x * frameSize.width/visibleSize.width * retinaFactor;
//                var centery = position.y * frameSize.height/visibleSize.height * retinaFactor;
//                this.shader.setUniformLocationF32( this.uniformCenter, centerx, centery);
//                this.shader.setUniformLocationF32( this.uniformResolution, 256, 256);
//
//                gl.enableVertexAttribArray( cc.VERTEX_ATTRIB_POSITION );
//
//                // Draw fullscreen Square
//                gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
//                gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, 0, 0);
//                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
//
//                gl.bindBuffer(gl.ARRAY_BUFFER, null);
//            },
//
//            update:function(dt) {
//                this._time += dt;
//            },
//            initBuffers:function() {
//
//                //
//                // Square
//                //
//                var squareVertexPositionBuffer = this.squareVertexPositionBuffer = gl.createBuffer();
//                gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
//                vertices = [
//                    256,            256,
//                    0,              256,
//                    256,            0,
//                    0,              0
//                ];
//                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//                gl.bindBuffer(gl.ARRAY_BUFFER, null);
//            }
//        });
//        
//
//        if( 'opengl' in cc.sys.capabilities ) {
//            var shaderNode = new ShaderNode( "res/example_Heart.vsh",  "res/example_Heart.fsh");
//            
//            this.addChild(shaderNode,10);
//            
//            shaderNode.x = winSize.width/2;
//            
//            shaderNode.y = winSize.height/2;
//        }
    },
    
addSelectLevelScrollView: function()
    {
        var scrollView = new cc.ScrollView();
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.setBounceable(true);
        scrollView.setTouchEnabled(true);
        scrollView.setContentSize(cc.size(700, 200));
        scrollView.setPosition(cc.winSize.width-200, cc.winSize.height/2 + 200);
        var listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setBounceEnabled(true);
        listView.setContentSize(cc.size(200, 100));
        listView.setItemsMargin(40);
        listView.setPosition(cc.p(0, 0));
        scrollView.addChild(listView);
        scrollView.setScale(1.5);
        for (var i = 2; i <= 20; i++) {
            var item = new ccui.Layout();
            item.setContentSize(cc.size(200, 50));
            var text = new cc.LabelTTF("Level:  " + (i-1).toString(), "Arial", 20);
            text.setColor(cc.color(255, 255, 255));
            text.setPosition(cc.p(item.width / 2, item.height / 2));
            item.addChild(text);
            (function (index) {
                item.setTouchEnabled(true);   
                item.addTouchEventListener(function(sender, type) {
                    if (type === ccui.Widget.TOUCH_ENDED) {
                        selectedLevel = index - 1;
                        chooseLevelLabel.setString("Select Level : " + selectedLevel);
                        cc.log("Selected Index: " + index - 1);
                        
                    }
                }, this);
            })(i);
            listView.pushBackCustomItem(item);
        }
        this.addChild(scrollView);
    },
    
    addMaxReachedLevel:function()
    {
        this.maxLevel=MaxLevelInGame;
        MaxLevelLogin = this.maxLevel;
        let maxLevelReachedLabel = new cc.LabelTTF("Highest Level Reached : "+this.maxLevel.toString(), "Arial", 30);
        maxLevelReachedLabel.attr({
        x: cc.winSize.width/2,
        y: cc.winSize.height/2 - 50,
        color: cc.color(255, 255, 255)
        });
        this.addChild(maxLevelReachedLabel);
    },
    
    addSelectThroughScroll : function()
    {
        
        let scroll_level = new cc.LabelTTF("Scroll Level : ", "Arial", 26);
        scroll_level.attr({
        x: cc.winSize.width - 280,
        y: cc.winSize.height - 55,
        color: cc.color(255, 255, 255)
        });
        this.addChild(scroll_level);
    },
    
    selectLevelHandler : function ()
    {
        chooseLevelLabel = new cc.LabelTTF("Select Level : "+ selectedLevel, "Arial", 30);
        chooseLevelLabel.attr({
        x: cc.winSize.width/2,
        y: cc.winSize.height/2 - 100,
        color: cc.color(255, 255, 255)
        });
        this.addChild(chooseLevelLabel);
    },
    
    getSelectedLevel : function()
    {
        return selectedLevel;
    },
    
    addIncreaseButton:function()
    {
        let plusIcon = new cc.MenuItemImage(
            res.plus_png,
            res.plus_png,
            increaseLevel, this);

        plusIcon.attr({
            x: cc.winSize.width/2 - 50,
            y: cc.winSize.height/2 - 150
        });
        
        let menu = new cc.Menu(plusIcon);
        menu.x = 0;
        menu.y = 0;
        plusIcon.setScale(0.25);
        this.addChild(menu, 1);

    },

    addDecreaseButton:function()
    {
        let minusIcon = new cc.MenuItemImage(
            res.minus_png,
            res.minus_png,
            decreaseLevel, this);

        minusIcon.attr({
            x: cc.winSize.width/2 + 50,
            y: cc.winSize.height/2 - 150
        });
        
        let menu = new cc.Menu(minusIcon);
        menu.x = 0;
        menu.y = 0;
        minusIcon.setScale(0.4);
        this.addChild(menu, 1);
    },
        
    addMenuToStart:function()
    {
        let menuItem1 = new cc.MenuItemFont("Play",play);
        let menu = new cc.Menu(menuItem1);
        menu.alignItemsVertically();
        this.addChild(menu);
    },
    
    setBackgroundLoginScreen : function()
    {
        var size = cc.winSize;
        this.sprite = new cc.Sprite(res.Loginbackground_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.sprite.setScale(0.5);
        this.addChild(this.sprite, 0);
    },
});

let increaseLevel = function()
{
    selectedLevel++;
    SoundManager.prototype.getInstance().playSoundEffect('res/clickSound.wav', false, 0.8);
    chooseLevelLabel.setString("Select Level : " + selectedLevel);
    
};

let decreaseLevel = function()
{
    SoundManager.prototype.getInstance().playSoundEffect('res/clickSound.wav', false, 0.8);
    if(selectedLevel>1){
        selectedLevel--;
        chooseLevelLabel.setString("Select Level : " + selectedLevel);
    }
    else
        return;
};

let play = function()
{
//    SoundManager.prototype.getInstance().stopSoundEffect(this.mainBgMusic);
    SoundManager.prototype.getInstance().playSoundEffect('res/clickSound.wav', false, 0.8);
    let scene = new GameScene();
    cc.director.runScene(new cc.TransitionFade(0.5,scene));
    

};

var LoginScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
            var layer = new LoginScreenLayer();
            this.addChild(layer);
    }
});

LoginScreenLayer.prototype.LoginScreenLayer_ = null;
LoginScreenLayer.prototype.getInstance = function() {
    if( !this.LoginScreenLayer_ ){
        this.LoginScreenLayer_ = new LoginScreenLayer();
    }
    return this.LoginScreenLayer_;
};
