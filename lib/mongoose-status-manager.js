var statusManagerPlugin = function(schema, options){

    schema.add({
        status_updates: [
            {
                status: String,
                date: Date,
            }
        ]
    });

    schema.methods.updateStatus = function(status){
    	this.status = status

    	this.status_updates.push({status: status})
    };

};

exports = module.exports = statusManagerPlugin;