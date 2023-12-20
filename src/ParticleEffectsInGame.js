var ParticleEffectsInGame = cc.Class.extend({
    
    ctor:function()
    {
        
    },
    
    particleEffectSparkle: function(parentObject , path)
    {
        let sparkleEffect = new cc.ParticleSystem(path);
        sparkleEffect.setPosition(parentObject.getPosition().x,parentObject.getPosition().y);
        sparkleEffect.setScale(0.7);
        sparkleEffect.setLife(1);
        return sparkleEffect;
    },
    
});

ParticleEffectsInGame.prototype.ParticleEffectsInGame_ = null;

ParticleEffectsInGame.prototype.getInstance = function() {
    if( !this.ParticleEffectsInGame_ ){
        this.ParticleEffectsInGame_ = new ParticleEffectsInGame();
    }
    return this.ParticleEffectsInGame_;
};
