let x = 2;
var express = require('express');
var router = express.Router();
//var fs = require("fs"); //don't need this because we're working with mongoose now

// start by creating data so we don't have to type it in each time
let ServerOrderArray = [];

// define a constructor to create movie objects
let OrderObject = function (pStoreID, pSalesPersonID, pCdID, pPricePaid, pDate) {
    this.StoreID = pStoreID
    this.SalesPersonID = pSalesPersonID;
    this.CdID = pCdID;
    this.PricePaid = pPricePaid;
    this.Date = pDate;
}

// ============================== mongoDB ==============================



const mongoose = require("mongoose");
const OrderSchema = require("../orderSchema");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection is in (MoviesDB)
const dbURI =
  "mongodb+srv://marcususer:nintendoDSi@marcuscluster.kzhbyc3.mongodb.net/orders?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established! :)");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

// ============================== Generic ========================

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* GET all Order data */
router.get('/getAllOrders', function(req, res) {
  // leaving find({}) blank takes all values
  OrderSchema.find({}, (err, AllOrders) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllOrders);
  });
});

/* Add one new Order */
router.post('/AddOrder', function(req, res) {

  let oneNewOrder = new OrderSchema(req.body);  
  console.log(req.body);
  oneNewOrder.save((err, newOrder) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
    console.log(newOrder);
    // res.status(201).json(todo);

    var response = {
      status  : 200,
      success : 'Added Successfully'
    }
    res.end(JSON.stringify(response)); // send reply

    }
  });
});

// DELETE movie
router.delete('/DeleteOrder/:ID', (req, res) => {
  const ID = req.params.ID;
  let found = false;
  console.log(ID);    

  for(var i = 0; i < ServerOrderArray.length; i++) // find the match
  {
      if(ServerOrderArray[i].ID === ID){
        ServerOrderArray.splice(i,1);  // remove object from array
          found = true;
          fileManager.write();
          break;
      }
  }

  if (!found) {
    console.log("not found");
    return res.status(500).json({
      status: "error"
    });
  } else {
    var response = {
      status  : 200,
      success : 'Order ' + ID + ' deleted!'
    }
    res.end(JSON.stringify(response)); // send reply
  }
});


module.exports = router;

// ============================== Filters ==============================

// GET everything from Store 98053
router.get('/getStore98053', function(req, res) {
  let which = 98053;
  OrderSchema.find({StoreID: which,  PricePaid: { $gt: 0, $lt: 16} }).sort({ PricePaid: -1}).exec(function(err, AllOrders) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(AllOrders);
    res.status(200).json(AllOrders);
  });
});

// GET every CD with the ID 123456
router.get('/getCD123456', function(req, res) {
  let which = 123456;
  OrderSchema.find({CdID: which,  PricePaid: { $gt: 0, $lt: 16} }).sort({ PricePaid: -1}).exec(function(err, AllOrders) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(AllOrders);
    res.status(200).json(AllOrders);
  });
});