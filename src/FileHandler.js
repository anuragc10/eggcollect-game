var FileReader = cc.Layer.extend({
    obtainedData : [],
    
    ctor : function()
    {
        this.readFileData();
    },
    
    readFileData : function()
    {
        let pathFile = "res/file.txt";
        cc.loader.load(pathFile, function(err,data){
            if(err)
            {
                cc.error(err.message || err);
                return;
            }
            let fileContent = data.toString();
            let lines = fileContent.split('\n');
            for (let i = 0; i < lines.length; i++) {
                let values = lines[i].split(',');
                let firstValue = parseInt(values[0], 10);
                let secondValue = parseInt(values[1], 10);
                this.obtainedData.push({first : firstValue ,second : secondValue});
            }
        }.bind(this));
    },
    
    readDataFromFile :function ()
    {
        return this.obtainedData;
    },
    
    
});

//insatance
FileReader.prototype.FileReader_ = null;
FileReader.prototype.getInstance = function() {
    if( !this.FileReader_ ){
        this.FileReader_ = new FileReader();
    }
    return this.FileReader_;
};

