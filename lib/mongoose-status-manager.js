var Schema = require('mongoose').Schema

var statusManagerPlugin = function(schema, options){

	schema.add({
		status: String, 
		status_updates: [{}]
	});

	schema.methods.updateStatus = function(status, meta){
		this.status = status

		var now = new Date();

		var statusUpdate = {status: status, date: now};

		if(meta){
			for(var prop in meta){
				statusUpdate[prop] = meta[prop];
			}
		}

		this.status_updates.unshift(statusUpdate);
	};

	schema.methods.findAllStatus = function(status, meta){
		return this.status_updates.map(function(s){
			if(s.status == status)
				return s;
		});
	};

	schema.statics.findByStatus = function(status, meta, callback){

      arguments[0] = {'status': status};

      if (meta) {
      	for(var prop in meta){
	      	arguments[0]['status_updates.0.'+prop] = meta[prop];
      	}
      }

      this.find.apply(this, arguments);
  };
};

exports = module.exports = statusManagerPlugin;