var Schema = require('mongoose').Schema

var statusManagerPlugin = function(schema, options){

    schema.add({
    	status: String, 

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

    schema.statics.findByStatus = function(status, callback){
        arguments[0] = {'status': status};
        this.find.apply(this, arguments);
    };
};

exports = module.exports = statusManagerPlugin;