var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Dishes = require('../models/dishes');

var dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
  Dishes.find({}, function (err, dish) {
    if (err) throw err;

    res.json(dish);
  });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
  Dishes.create(req.body, function(err, dish) {
    if (err) throw err;
    console.log('dish created');
    var id = dish._id;
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('added dish with id: ' + id);
  });   
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
  Dishes.remove({}, function(err, resp) {
    if (err) throw err;
    res.send(resp);
  });
});

dishRouter.route('/:dishId')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
  Dishes.findById(req.params.dishId, function(err, dish) {
    if (err) throw err;
    res.send(dish);
  });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
  Dishes.findByIdAndUpdate(req.params.dishId, {
    $set: req.body
  }, {
    new: true
  }, function(err, dish) {
    if (err) throw err;
    res.send(dish);
  });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
  Dishes.remove(req.params.dishId, function(err, resp) {
    if (err) throw err;
    res.send(resp);
  });
});

dishRouter.route('/:dishId/comments')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
  Dishes.findById(req.params.dishId, function(err, dish) {
    if (err) throw err;

    res.send(dish.comments);
  });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req,res,next){
  Dishes.findById(req.params.dishId, function(err, dish) {
    if (err) throw err;

    dish.comments.push(req.body);
    dish.save(function(err, dish) {
      if (err) throw err;
      res.send(dish);
    });
  });
})


module.exports = dishRouter;