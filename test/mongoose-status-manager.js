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

        var doc;

        beforeEach(function(){
            doc = new Order();
        });

        it('sets status', function(){

        	doc.updateStatus('first status')

            doc.status.should.equal('first status')
        });

        it('adds status to status update list', function(){

            doc.updateStatus('first status')
            
            doc.status_updates.should.have.length(1);
            doc.status_updates[0].status.should.equal('first status')
        });

        it('adds status to status update list with date', function(){

            doc.updateStatus('first status')
            
            doc.status_updates.should.have.length(1);
            doc.status_updates[0].status.should.equal('first status')

            doc.status_updates[0].date.toDateString().should.eql(new Date().toDateString())
        });

        it('stores status updates in order of oldest at bottom', function(){

            doc.updateStatus('first status')
            doc.updateStatus('second status')
            doc.updateStatus('third status')
            
            doc.status_updates.should.have.length(3);
            doc.status_updates[0].status.should.equal('third status')
            doc.status_updates[1].status.should.equal('second status')
            doc.status_updates[2].status.should.equal('first status')
        });

        it('can store meta data with update', function(){

            doc.updateStatus('a status update', {userId: 'abc123', otherUserId: 'xyz789'});
            
            doc.status_updates.should.have.length(1);
            doc.status.should.equal('a status update')
            doc.status_updates[0].status.should.equal('a status update')

            doc.status_updates[0].meta.userId.should.equal('abc123')
            doc.status_updates[0].meta.otherUserId.should.equal('xyz789')
        });

        it('saves and retrieves from database', function(done){
         doc.updateStatus('first status')
         doc.updateStatus('second status', {userId: 1234})

         doc.save(function(err){
            if(err) done(err);

            //retrieve from db
            Order.find(function(err, result){
                var order = result[0];
                
                order.status.should.equal('second status');

                order.status_updates.should.have.length(2);
                order.status_updates[0].status.should.equal('second status');
                order.status_updates[1].status.should.equal('first status');

                order.status_updates[0].meta.userId.should.equal(1234);

                done();
            });
         });
     });
    });
});