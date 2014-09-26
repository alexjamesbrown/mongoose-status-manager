var Schema = require('mongoose').Schema

var statusManagerPlugin = function(schema, options){

    schema.add({
        status_updates: [
            {
                status: String,
                date: Date,
                meta: Object
            }
        ]
    });

    schema.methods.updateStatus = function(status, meta){
    	this.status = status

    	var now = new Date();
    	this.status_updates.unshift({status: status, date: now, meta: meta});
    };

};

exports = module.exports = statusManagerPlugin;