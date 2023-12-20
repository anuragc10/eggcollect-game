var SoundManager = cc.Class.extend({
    
    ctor:function()
    {
        
    },
    
    playSoundEffect : function(path,loop = false, volume)
    {
        let musicID = jsb.AudioEngine.play2d(path,loop,volume);
        jsb.AudioEngine.setVolume(musicID,volume);
        return musicID;
    },
    
    stopSoundEffect: function(musicID){
      if(musicID > -1)
          jsb.AudioEngine.stop(musicID);
    },
    
});

SoundManager.prototype.soundManager_ = null;

SoundManager.prototype.getInstance = function() {
    if( !this.soundManager_ ){
        this.soundManager_ = new SoundManager();
    }
    return this.soundManager_;
};
