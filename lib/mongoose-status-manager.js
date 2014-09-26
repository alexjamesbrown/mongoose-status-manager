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

    	var now = new Date();
    	this.status_updates.push({status: status, date: now});
    };

};

exports = module.exports = statusManagerPlugin;