// load required packages
var express = require('express');
var bodyParser = require('body-parser');

// start express app
var app = express();

// Connect to a mongodb
var mongodb = require('mongodb');
var db, itemsCollection;
mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/tododb', function (err, database) {
    if (err) throw err;

    // Connected!
    db = database;
    itemsCollection = db.collection('items');

    app.listen(3000);
    console.log('Listening on port 3000');
});

// Create a router that can accept JSON
var router = express.Router();
router.use(bodyParser.json());

// Setup the collection routes which can act as REST API
router.route('/')
      .get(function (req, res, next) {
          itemsCollection.find().toArray(function (err, docs) {
              res.send({
                  status: 'Items found',
                  items: docs
              });
          });
      })
      .post(function (req, res, next) {
          var d = new Date();
          var item = req.body;
          item.date = d;
          itemsCollection.insert(item, function (err, docs) {
              res.send({
                  status: 'Item added',
                  itemId: item._id
              });
          });
      })
      .put(function (req, res, next) {
          // todo: update todo!
      })

// Setup the item routes
router.route('/:id')
      .delete(function (req, res, next) {
          var id = req.params['id'];
          var lookup = { _id: new mongodb.ObjectID(id) };
          itemsCollection.remove(lookup, function (err, results) {
              res.send({ status: 'Item cleared' });
          });
      });

// Setup todo get complete todo list
app.use(express.static(__dirname + '/public'))
   .use('/todo', router);

