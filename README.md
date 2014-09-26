# Mongoose Status Manager #

Add status schema to your object, and allow status history tracking

    npm install mongoose-status-manager

Plug it in to your schema...

    var db = require('mongoose'),
        var statusManagerPlugin = require('mongoose-status-manager'),
        OrderSchema = db.Schema(),

        OrderSchema(statusManagerPlugin);

Make the model...

    var Order = db.model('order', OrderSchema);

Make the instance or find the instance with the statics below ...

Now, you can update the status of an order like so:

    var order = new Order();
    order.setStatus('pending');


`order.status` will be 'pending' as elected.  
Also, `order.status_updates` will be an array:

    [
      {
        status: 'pending', date: "2014-09-26T12:29:17.781Z"
      }
    ]

Use the statics...

    Order.findByStatus - finds all orders for the given status

Adds these handy methods on the instance...

    order.updateStatus('status', {meta}) // updates the status with the specified status, and sets the (optional) meta properties in the status_updates

For example:  

    order.updateStatus('cancelled', {reason: 'just because});

... would result in the `order.status_updates` being an array like this:

    [
      {
         status: 'cancelled', date: "2014-09-26T12:29:17.781Z", reason: 'just because'
      }
    ]

##Querying##  

You can query for documents by status with `findByStatus` like this:

    Order.findByStatus('complete', function(err, docs){ 
      //docs has all docs with status of 'complete'
    });

Optionally, you can also pass in a meta object into the query:

    Order.findByStatus('complete', {reason: 'error'}, function(err, docs){ 
      //docs has all docs with status of 'complete' and where the last status update reason was 'error'
    });

You can pass in an empty status to query just by meta:

    Order.findByStatus('', {reason: 'error'}, function(err, docs){ 
      //docs has all docs where the last status update reason was 'error', regardless of status
    });

####//ToDo###
Enhance the querying to be able to return docs if the 'reason' was error at any status_update

---

Please look at the tests for further use.  

If you find a bug, let me know or fix it yourself, this is open source!

MIT