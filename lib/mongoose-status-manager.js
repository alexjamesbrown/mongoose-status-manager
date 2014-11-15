var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var statusManagerPlugin = function(schema, options) {

    schema.add({
        status: String,
        status_updates: [{}]
    });

    schema.methods.updateStatus = function(status, meta) {
        this.status = status

        var statusUpdate = {
            status: status,
            date: new Date()
        };

        if (meta) {
            for (var prop in meta) {
                statusUpdate[prop] = meta[prop];
            }
        }

        this.status_updates.unshift(statusUpdate);
    };

    schema.methods.findAllStatus = function(status, meta) {
        return this.status_updates.map(function(s) {
            if (s.status == status)
                return s;
        });
    };

    schema.statics.findByStatus = function(status, meta, callback) {

        if (typeof(meta) === 'function') {
            callback = meta;
        }

        if (typeof(status) == 'object') {
            return callback(new Error('Status is missing'), null);
        }

        if (status != '')
            arguments[0] = {
                'status': status
            };
        else
            arguments[0] = {};

        if (meta) {
            for (var prop in meta) {
                arguments[0]['status_updates.0.' + prop] = meta[prop];
            }
        }

        this.find.apply(this, arguments);
    };

    schema.statics.updateStatus = function(query, status, meta, callback) {
        if (typeof(meta) === 'function') {
            callback = meta;
        }

        if (mongoose.Types.ObjectId.isValid(query.toString())) {
            query = {
                _id: query
            };
        }

        var statusUpdate = {
            status: status,
            date: new Date()
        };

        if (meta) {
            for (var prop in meta) {
                statusUpdate[prop] = meta[prop];
            }
        }

        var update = {
                $set: {
                    status: statusUpdate.status
                },
                $push: {
                    status_updates: {
                        $each: [statusUpdate],
                        $position: 0
                    }
                }
            },
            options = {
                multi: true
            };

        this.update(query, update, options, function(err) {
            callback(err);
        });
    };
};

exports = module.exports = statusManagerPlugin;
