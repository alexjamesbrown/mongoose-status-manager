var mocha = require('mocha'),
    should = require('should'),
    db = require('mongoose'),
    statusPlugin = require('../lib/mongoose-status-manager');

describe('Mongoose Status Manager', function(){

    db.connect('mongodb://localhost/mongoose-status-manager');

    var schema = db.Schema();
    schema.plugin(statusPlugin, {unique: !1});

    var Order = db.model('order', schema);

    //delete all stored documents
    afterEach(function(done){
        Order.remove(function(err, doc){
            if(err) return done(err);
            done();
        });
    });

    describe('.updateStatus', function(){

        it('sets status', function(){

        	var o = new Order();
        	o.updateStatus('first status')
            
            should.exist(o.status, 'status not set')
            o.status.should.equal('first status')
        });

    });
});