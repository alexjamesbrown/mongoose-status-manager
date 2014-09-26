var mocha = require('mocha'),
async = require('async');
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

    describe('Instance Methods', function(){

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

                doc.status_updates[0].userId.should.equal('abc123')
                doc.status_updates[0].otherUserId.should.equal('xyz789')
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

                    order.status_updates[0].userId.should.equal(1234);

                    done();
                });
             });
         });
        });

        describe('.findAllStatus', function(){
            var doc;

            beforeEach(function(){
                doc = new Order();
            });

            it('returns all status objects matching given status', function(){
                doc.updateStatus('first status');
                doc.updateStatus('second status');
                doc.updateStatus('third status');
                doc.updateStatus('fourth status');
                doc.updateStatus('second status');

                doc.findAllStatus('second status', function(status){
                    status.should.have.length(2);
                });
            });

            it('returns all status objects matching given status in order', function(){
                doc.updateStatus('first status');
                doc.updateStatus('second status', {a: 1});
                doc.updateStatus('third status');
                doc.updateStatus('fourth status');
                doc.updateStatus('second status', {a: 2});

                doc.findAllStatus('second status', function(status){
                    status.should.have.length(2);

                    status[0].a.should.equal(1);
                    status[1].a.should.equal(2);
                });
            });
        });
    });

    describe('Static Methods', function(){

        describe('.findByStatus', function(){
            beforeEach(function(done){
                //create some docs
                var doc1 = new Order();
                doc1.updateStatus('pending');

                var doc2 = new Order();
                doc2.updateStatus('complete');

                var doc3 = new Order();
                doc3.updateStatus('complete');

                var doc4 = new Order();
                doc4.updateStatus('cancelled');

                var doc5 = new Order();
                doc5.updateStatus('cancelled', {reason: 'just because'});

                async.parallel([
                    doc1.save.bind(doc1), 
                    doc2.save.bind(doc2), 
                    doc3.save.bind(doc3), 
                    doc4.save.bind(doc4), 
                    doc5.save.bind(doc5)], function(err){
                    done();
                });
            });

            it('returns all docs with matching status', function(done){
                Order.findByStatus('complete', function(err, docs){
                    if(err) done(err);

                    docs.length.should.equal(2)
                    done();
                });
            });

            it('returns all docs with matching status and supplied meta information', function(done){
                Order.findByStatus('cancelled', {reason: 'just because'}, function(err, docs){
                    if(err) done(err);

                    docs.length.should.equal(1)
                    done();
                });
            });
        });


    });
});