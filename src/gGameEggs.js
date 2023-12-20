var MaxLevelInGame = 1;
let EggCollectorLayer = cc.Layer.extend({
    basket: null,
    eggsArray : [],
    scoreLabel: null,
    score: 0,
    pauseButton: null,
    isGamePaused: false,
    resetButton : null,
    missedChances : 0,
    missLabel : null,
    totalChances : 5,
    atLevel :  0,
    levelLabel : null,
    levelReach : 0,
    dropSpeed : 3,
    closeButton: null,
    isclosedclicked : false,
    backgroundMusic : false,
    tryAgain : null,
    isDialogueOpen : false,
    dataReadFromFile : [],
    
    ctor: function () {
        this._super();
        this.dataFromFile = FileReader.prototype.getInstance().readDataFromFile();
        this.levelReach = this.getDataFromFile(this.atLevel);
        this.addBackgroundImage();
        this.addCollectBasket();
        this.scoreUpdateHandler();
        this.addResetButton();
        this.addPlayandPauseButton();
        this.addTouchEventHandler();
        this.recordMissedChanges();
        this.addAtLevel();
        this.addCloseButton();
        this.updateDropSpeed();
        
    },
    
    addCloseButton:function()
    {
        this.closeButton = new cc.MenuItemImage(
            res.close_png,
            res.close_png,
            this.onCloseButtonClicked, this);
        this.closeButton.attr({
            x: 50,
            y: cc.winSize.height - 50
        });
        let closeMenu= new cc.Menu(this.closeButton);
        closeMenu.x = 0;
        closeMenu.y = 0;
        this.closeButton.setScale(0.8);
        this.addChild(closeMenu, 1);
    },
    
    onCloseButtonClicked : function()
    {
        if(!this.isDialogueOpen){
            MaxLevelInGame = this.atLevel;
            selectedLevel = 1;
            SoundManager.prototype.getInstance().playSoundEffect('res/clickSound.wav', false, 0.8);
            SoundManager.prototype.getInstance().stopSoundEffect(this.backgroundMusic);
            this.isclosedclicked = true;
            if(this.isGamePaused)
            {
                this.onTogglePause();
            }
            this.removeFromParent();
            let scene = new LoginScene();
            cc.director.runScene(new cc.TransitionFade(0.5,scene));
        }
        
    },
    
    addBackgroundImage: function()
    {
        let size = cc.winSize;
        this.sprite = new cc.Sprite(res.background_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.sprite.setScale(2.8);
        this.addChild(this.sprite, 0);
        this.backgroundMusic = SoundManager.prototype.getInstance().playSoundEffect('res/backgroundMusic.wav', true, 0.3);
    },
    
    addAtLevel : function()
    {
        this.atLevel = LoginScreenLayer.prototype.getInstance().getSelectedLevel()-1;
        this.levelLabel = new cc.LabelTTF("Level : "+ this.atLevel.toString(), "Arial", 30);
        this.levelLabel.attr({
        x: cc.winSize.width - 500,
        y: cc.winSize.height - 40,
        color: cc.color(255, 255, 255)
        });
        this.addChild(this.levelLabel);
    },
    
    recordMissedChanges : function()
    {
        this.missLabel = new cc.LabelTTF("Missed: "+this.missedChances.toString() + "/" + this.totalChances.toString(), "Arial", 30);
        this.missLabel.attr({
        x: cc.winSize.width - 300,
        y: cc.winSize.height - 40,
        color: cc.color(255, 255, 255)
        });
        this.addChild(this.missLabel);
    },
    
    addCollectBasket : function()
    {
        this.basket = new cc.Sprite(res.Basket_png);
        this.basket.setPosition(cc.winSize.width / 2, 60);
        this.basket.setScale(0.15);
        this.addChild(this.basket);
    },
    
    scoreUpdateHandler : function()
    {
        this.scoreLabel=new cc.LabelTTF("Score: 0/"+ this.getDataFromFile(this.atLevel), "Arial", 30);
        this.scoreLabel.attr({
        x: cc.winSize.width - 100,
        y: cc.winSize.height - 40,
        color: cc.color(255, 255, 255)
        });
        this.addChild(this.scoreLabel);
    },
    
    levelUpdateHandler: function()
    {
        SoundManager.prototype.getInstance().playSoundEffect('res/levelup.wav', false, 1);
        this.levelLabel.setString("Level : " + this.atLevel.toString());
    },
    
    addTouchEventHandler : function()
    {
        cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: function (touch, event) {
            return true;
        },
            
        onTouchMoved: function (touch, event) {
            let delta = touch.getDelta();
            this.basket.x += delta.x;
            let minX = 70;
            let maxX = cc.winSize.width-70;
            this.basket.x = cc.clampf(this.basket.x, minX, maxX);
        }.bind(this)
        }, this);
        if (!this.isGamePaused) {
            this.schedule(this.spawnRandomEggs, 3);
        }
        this.scheduleUpdate();
    },
    
    addPlayandPauseButton : function()
    {
        
        this.pauseButton = new cc.MenuItemImage(
            res.pause_png,
            res.pause_png,
            this.onTogglePause, this);

        this.pauseButton.attr({
            x: 250,
            y: cc.winSize.height - 50
        });
        
        let menu = new cc.Menu(this.pauseButton);
        menu.x = 0;
        menu.y = 0;
        this.pauseButton.setScale(0.8);
        this.addChild(menu, 1);
    },
    
    addResetButton : function()
    {
        
        this.resetButton = new cc.MenuItemImage(
            res.reset_png,
            res.reset_png,
            this.onResetButtonButtonClicked, this);
        
        this.resetButton.attr({
            x: 150,
            y: cc.winSize.height - 50
        });
        
        let resetMenu= new cc.Menu(this.resetButton);
        resetMenu.x = 0;
        resetMenu.y = 0;
        this.resetButton.setScale(0.8);
        this.addChild(resetMenu, 1);
    },
    
    spawnRandomEggs: function () {
        let numberOfEggs = Math.floor(Math.random() * 4) + 1;
        let randomEgg = [res.EggPink_png,res.Egg_png,res.EggGreen_png,res.Bomb_png];
        for (let i = 0; i < numberOfEggs; i++) {
            let index = Math.floor(Math.random() * randomEgg.length);
            if(this.atLevel >= 4 && this.atLevel <7)
            {
                let value = Math.floor(Math.random() * 10);
                if(value == 6)
                {
                    this.scheduleOnce(this.spawnEgg.bind(this,res.EggGolden_png), i * 0.5);
                }
                else
                    this.scheduleOnce(this.spawnEgg.bind(this,randomEgg[index]), i * 0.5);
            }
            else if(this.atLevel>=7)
            {
                let value = Math.floor(Math.random() * 10);
                if(value == 8 || value == 4 )
                {
                    this.scheduleOnce(this.spawnEgg.bind(this,res.EggGolden_png), i * 0.5);
                }
                else
                    this.scheduleOnce(this.spawnEgg.bind(this,randomEgg[index]), i * 0.5);
            }
            else
                this.scheduleOnce(this.spawnEgg.bind(this,randomEgg[index]), i * 0.5);
        }
    },
    
    spawnEgg: function (spriteName) {
        let egg = new cc.Sprite(spriteName);
        egg.attr({
        x: cc.random0To1() * cc.winSize.width,
        y: cc.winSize.height + egg.height / 2
        });
        egg.setScale(0.12);
        if(spriteName == "res/egg.png")
            egg.name = "egg1";
        if(spriteName == "res/eggPink.png")
            egg.name = "egg2";
        if(spriteName == "res/eggGreen.png")
            egg.name = "egg3";
        if(spriteName == "res/bomb.png")
            egg.name = "bomb";
        if(spriteName == "res/eggGolden.png")
            egg.name = "jackpot";
        egg.setTag(9101);
        this.addChild(egg);
        this.eggsArray.push(egg);
        let moveAction = cc.moveTo(this.dropSpeed, cc.p(egg.x, -egg.height / 2));
        let removeAction = cc.callFunc(function () {
            if(egg.name!="bomb"){
                SoundManager.prototype.getInstance().playSoundEffect('res/missed.wav', false, 1);
                this.missedChances +=1;
                this.updateMissedlabel();
                egg.removeFromParent();
                let index = this.eggsArray.indexOf(egg);
                if (index !== -1) {
                    this.eggsArray.splice(index, 1);
                }
            }
        }.bind(this));
        egg.runAction(cc.sequence(moveAction, removeAction));
    },
    
    updateDropSpeed : function ()
    {
        if(this.atLevel <2)
            this.dropSpeed = 3;
        if(this.atLevel >= 2 && this.atLevel <3)
            this.dropSpeed = 2.5;
        if(this.atLevel >= 3 && this.atLevel <4)
            this.dropSpeed = 2;
        if(this.atLevel >= 4  && this.atLevel <5)
            this.dropSpeed = 1.5;
        if(this.atLevel >= 5  && this.atLevel <7)
            this.dropSpeed = 1.1;
        if(this.atLevel >= 7  && this.atLevel <8)
            this.dropSpeed = 1;
        if(this.atLevel >= 8  && this.atLevel <10)
            this.dropSpeed = 0.9;
        if(this.atLevel >= 10)
            this.dropSpeed = 0.7;
    },
    
    updateMissedlabel: function()
    {
        
        if(this.atLevel == 5 && this.atLevel<7)
            this.totalChances = 5;
        if(this.atLevel >= 7)
            this.totalChances = 4;
        this.missLabel.setString("Missed: " + this.missedChances  + "/" + this.totalChances.toString());
    },
    
    update: function (dt) {
        if (!this.isGamePaused) {
            if(this.isclosedclicked){
                while(this.getChildByTag(9101)){
                    this.getChildByTag(9101).removeFromParent();}
            }
            for (let i = 0; i < this.eggsArray.length; i++) {
                let eggnew = this.eggsArray[i];
                if (this.checkCollision(this.basket, eggnew)) {
                    eggnew.removeFromParent();
                    let index = this.eggsArray.indexOf(eggnew);
                    if (index !== -1) {
                        this.eggsArray.splice(index, 1);
                        this.checkEggsandBomb(eggnew);
                        this.updateScoreLabel();
                    }
                }
            }
            if(this.missedChances == this.totalChances){
                if(!this.isDialogueOpen){
                    this.addGameOverPopUp();
                    
                    while (this.eggsArray.length > 0) {
                        this.eggsArray.pop();
                    }
                }
            }
            this.levelReachedCheck();
        }
    },
    
    ontryAgainPopUpClick : function()
    {
        MaxLevelInGame = this.atLevel;
        this.onTogglePause();
        this.atLevel = 1;
        this.levelUpdateHandler();
        this.updateDropSpeed();
        this.onResetButtonButtonClicked();
        this.isDialogueOpen =false;
        this.tryAgain.removeFromParent();
    },
    
    addGameOverPopUp : function()
    {
        this.onTogglePause();
        this.isDialogueOpen =true;
        this.tryAgain = new cc.MenuItemImage(
            res.tryagain_png,
            res.tryagain_png,
            this.ontryAgainPopUpClick, this);

        this.tryAgain.attr({
            x: cc.winSize.width/2,
            y: cc.winSize.height/2
        });
        
        let menu = new cc.Menu(this.tryAgain);
        menu.x = 0;
        menu.y = 0;
        this.tryAgain.setScale(0.8);
        this.addChild(menu, 2);
    },
    
    levelReachedCheck :function()
    {
        if(this.score > this.levelReach-1)
        {
            this.atLevel+=1;
            this.levelUpdateHandler();
            let sparkleEffect = ParticleEffectsInGame.prototype.getInstance().particleEffectSparkle(this.levelLabel,'res/levelupparticle.plist');
            this.addChild(sparkleEffect,1);
            this.score = 0;
            this.updateScoreLabel();
            if(this.atLevel<=20)
                this.levelReach  = this.getDataFromFile(this.atLevel);
            else
                this.levelReach = this.atLevel*15;
            this.missedChances = 0;
            this.updateMissedlabel();
            this.updateDropSpeed();
        }
    },
    
    
    checkEggsandBomb : function(eggnew)
    {
        if(eggnew.name == "egg1"){
            this.score += 1;
            this.showLabelAtScreen(1,false,false,false);
            SoundManager.prototype.getInstance().playSoundEffect('res/collect.wav', false, 1);
            let sparkleEffect = ParticleEffectsInGame.prototype.getInstance().particleEffectSparkle(this.basket,'res/sparkle.plist');
            this.addChild(sparkleEffect,1);
        }
        else if(eggnew.name == "egg2"){
            this.score += 2;
            this.showLabelAtScreen(2,false,false,false);
            SoundManager.prototype.getInstance().playSoundEffect('res/collect.wav', false, 1);
            let sparkleEffect = ParticleEffectsInGame.prototype.getInstance().particleEffectSparkle(this.basket,'res/sparkle.plist');
            this.addChild(sparkleEffect,1);
        }
        else if(eggnew.name == "egg3"){
            this.score += 3;
            this.showLabelAtScreen(3,false,false,false);
            SoundManager.prototype.getInstance().playSoundEffect('res/collect.wav', false, 1);
            let sparkleEffect = ParticleEffectsInGame.prototype.getInstance().particleEffectSparkle(this.basket,'res/sparkle.plist');
            this.addChild(sparkleEffect,1);
        }
        else if(eggnew.name == "jackpot"){
            if(this.atLevel >= 10){
                this.score += 20;
                this.showLabelAtScreen(20,false,false,false);
            }
            else
            {
                this.score += 10;
                this.showLabelAtScreen(10,false,false,false);
            }
            SoundManager.prototype.getInstance().playSoundEffect('res/collect.wav', false, 1);
            let sparkleEffect = ParticleEffectsInGame.prototype.getInstance().particleEffectSparkle(this.basket,'res/sparkle.plist');
            this.addChild(sparkleEffect,1);
        }
        else if(eggnew.name == "bomb"){
            let sparkleEffect = ParticleEffectsInGame.prototype.getInstance().particleEffectSparkle(this.basket,'res/blast.plist');
            this.addChild(sparkleEffect,1);
            SoundManager.prototype.getInstance().playSoundEffect('res/boom.wav', false, 1.5);
//                            this.missedChances += 1;
//                            this.updateMissedlabel();
            if(this.score > 0){
                let deduct =this.changeScore();
                this.showLabelAtScreen(deduct,true,false,false);
            }
        }
    },

    showLabelAtScreen : function(amount,isDeduct,isPaused,isRestarted)
    {
        let displayText= "";
        if(isDeduct)
            displayText = "YOU CATCHED A BOMB : -" + amount.toString();
        else
            displayText = "+" + amount.toString();
        
        if(isRestarted)
            displayText = "Game Restarted";
        else if(isPaused)
            displayText = "Game Paused";
        
        this.displayLabel = new cc.LabelTTF(displayText, "Arial", 34);
        if(isDeduct){
            this.displayLabel.attr({
            x: cc.winSize.width/2,
            y: cc.winSize.height/2-50,
            color: cc.color(255, 255, 255)
            });
        }
        else if(!isDeduct)
        {
            this.displayLabel.attr({
            x: cc.winSize.width/2,
            y: cc.winSize.height/2,
            color: cc.color(255, 255, 255)
            });
        }
        else if(isPaused)
        {
            this.displayLabel.attr({
            x: cc.winSize.width/2,
            y: cc.winSize.height/2+50,
            color: cc.color(255, 255, 255)
            });
        }
        else if(isRestarted)
        {
            this.displayLabel.attr({
            x: cc.winSize.width/2,
            y: cc.winSize.height/2+100,
            color: cc.color(255, 255, 255)
            });
        }
        
        this.addChild(this.displayLabel);
        let Action = cc.FadeOut.create(0.5);
        this.displayLabel.runAction(Action);
    },
    
    changeScore: function()
    {
        if(this.score > 0 && this.score <=10){
            this.score -=1;
            return 1;
        }
        else if(this.score > 10 && this.score <= 40){
            this.score -=10;
            return 10;
        }
        else if(this.score > 40 && this.score <=80){
            this.score -= 25;
            return 25;
        }
        else{
            this.score -=50;
            return 50;
        }
    },
    
    checkCollision: function (spriteA, spriteB) {
        if(cc.sys.isObjectValid(spriteA) && cc.sys.isObjectValid(spriteB)){
            let a = spriteA.getBoundingBox();
            let b = spriteB.getBoundingBox();
            return cc.rectIntersectsRect(a, b);
        }
    },
        
    updateScoreLabel: function () {
        if(this.atLevel <= 20)
            this.scoreLabel.setString("Score: " + this.score + "/"+ this.getDataFromFile(this.atLevel));
        else
            this.scoreLabel.setString("Score: " + this.score + "/"+ this.atLevel*15);
    },
        
    onTogglePause: function () {
        if(!this.isDialogueOpen)
        {
            SoundManager.prototype.getInstance().playSoundEffect('res/clickSound.wav', false, 0.8);
            this.isGamePaused = !this.isGamePaused;
            let spriteChange =  res.play_png;
            if(this.isGamePaused){
                spriteChange = res.play_png;
                this.showLabelAtScreen(0,false,true,false);
            }
            else{
                spriteChange = res.pause_png;
            }
            this.pauseButton.setNormalImage(new cc.Sprite(spriteChange));
            this.pauseButton.setSelectedImage(new cc.Sprite(spriteChange));
            if (this.isGamePaused)
                cc.director.pause();
            else
                cc.director.resume();
        }
    },
    
    onResetButtonButtonClicked : function ()
    {
        SoundManager.prototype.getInstance().playSoundEffect('res/clickSound.wav', false, 0.8);
        this.score = 0;
        this.missedChances = 0;
        this.updateMissedlabel();
        this.updateDropSpeed();
        this.updateScoreLabel();
//        this.removeEggsFromArray();
        while(this.getChildByTag(9101)){
            this.getChildByTag(9101).removeFromParent();
        }
        this.eggsArray =[];
        this.basket.setPosition(cc.winSize.width / 2, 60);
        if (this.isGamePaused) {
            cc.director.resume();
            this.isGamePaused = false;
            this.pauseButton.setNormalImage(new cc.Sprite(res.pause_png));
            this.pauseButton.setSelectedImage(new cc.Sprite(res.pause_png));
        }
        if(!this.isDialogueOpen)
            this.showLabelAtScreen(0,false,false,true);
    },
    
    removeEggsFromArray : function()
    {
        for(let i=0;i<this.eggsArray.length;i++)
        {
            let eggnew = this.eggsArray[i];
            if (true) {
                eggnew.removeFromParent();
                let index = this.eggsArray.indexOf(eggnew);
                if (index !== -1) {
                    this.eggsArray.splice(index, 1);
                }
            }
        }
    },
    
    getDataFromFile: function(value)
    {
        for(let i=0;i<this.dataFromFile.length-1;i++)
        {
            if(this.dataFromFile[i].first==value)
                return this.dataFromFile[i].second;
        }
        return null;
    },
    
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        let layer = new EggCollectorLayer();
        this.addChild(layer);
    }
});


