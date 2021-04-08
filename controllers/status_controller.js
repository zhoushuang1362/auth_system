var mongoose = require('mongoose');
var Status = require('../models/status');
var async = require('async')
const { body, validationResult } = require('express-validator');

exports.all_status = function(req,res,next)
{
    Status.find()
        .sort([['status_name', 'ascending']])
        .exec(function (err, allstatus) {
            if (err) { return next(err); }
            res.render('all_status', { title: 'All status', all_status: allstatus });
        })
};

exports.status_detail = function(req,res,next)
{
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel(
     {
        status : function(callback){
            Status.findById(id)
              .exec(callback);
        },
     },
     function(err,results)
     {
        if (err) { return next(err); }
        if (results.status==null) {
            var err = new Error('Status not found');
            err.status = 404;
            return next(err);
        }
        res.render('status_detail', { title: 'Status Detail', status: results.status});
     }
    );
};

exports.status_create_get = function (req, res, next) {
    res.render('status_form', { title: 'Create Status' });
};

exports.status_create_post =  [
    body('name', 'Status name required').isLength({ min: 1 }).trim(),
    body('name').trim().escape(),
    (req, res, next) => 
    {
      const errors = validationResult(req);
      var status = new Status(
        { status_name: req.body.name }
      );
      if (!errors.isEmpty()) {
        res.render('status_form', { title: 'Create Status', status: status, errors: errors.array()});
        return;
      }
      else {
           Status.findOne({ 'status_name': req.body.name })
                .exec( function(err, found_status){
                      if (err) { return next(err); }
                      if (found_status) {
                         //res.redirect(found_status.url);
                         res.render('status_form', { title: 'Create Status', status: status, errors: errors.array()});                      }
                      else {
                         status.save(function (err) {
                           if (err) { return next(err); }
                           res.redirect(status.url);
                         });
                       }
                });
        }
    }
];

exports.status_delete_get = function(req, res, next) {
  var id = mongoose.Types.ObjectId(req.params.id); 
  async.parallel({
      status : function(callback) {
          Status.findById(id).exec(callback);
        },
    }, 
  function(err, results) {
      if (err) { return next(err); }
      if (results.status==null) { 
          res.redirect('/catalog/status');
      }
      res.render('status_delete', { title: 'Delete Status', status: results.status } );
    });
}; 

exports.status_delete_post = function(req, res, next) {
  var id = mongoose.Types.ObjectId(req.params.id); 
  async.parallel({
      status: function(callback) {
          Status.findById(id).exec(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      Status.findByIdAndRemove(id, function deleteStatus(err) {
          if (err) { return next(err); }
          res.redirect('/catalog/status');
      });
  });
};

exports.status_update_get = function(req, res, next) {
  var id = mongoose.Types.ObjectId(req.params.id); 
  Status.findById(id, function(err, status) {
      if (err) { return next(err); }
      if (status==null) { 
          var err = new Error('Status not found');
          err.status = 404;
          return next(err);
      }
      res.render('status_form', { title: 'Update Status', status: status });
  });
};

exports.status_update_post = [
  body('name', 'Status name required').isLength({ min: 1 }).trim(),
  body('name').escape(),
  (req, res, next) => {
      var id = mongoose.Types.ObjectId(req.params.id); 
      const errors = validationResult(req);
      var status = new Status(
        {
        status_name: req.body.name,
        _id: id
        }
      );
      if (!errors.isEmpty()) {
          res.render('status_form', { title: 'Update Status', status: status, errors: errors.array()});
      return;
      }
      else {
          Status.findByIdAndUpdate(id, status, {}, function (err,thestatus) {
           if (err) { return next(err); }
           res.redirect(thestatus.url);
          });
        }
    }
];