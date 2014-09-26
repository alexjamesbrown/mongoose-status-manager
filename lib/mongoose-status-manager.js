var statusManagerPlugin = function(schema, options){

    schema.methods.updateStatus = function(status){
    	this.status = status
    };

};

exports = module.exports = statusManagerPlugin;