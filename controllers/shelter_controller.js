var Shelter = require('../models/shelter');
var mongoose = require('mongoose');
var async = require('async')
const { body, validationResult } = require('express-validator');

// Display list of all shelters.
exports.all_shelters = function(req,res,next){
    Shelter.find()
        .sort([['shelter_name', 'ascending']])
        .exec(function (err, allshelters) {
            if (err) { return next(err); }
            res.render('all_shelters', { title: 'All shelters', all_shelters: allshelters });
        })
};  

exports.shelter_detail = function(req,res,next)
{
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel(
     {
        shelter : function(callback){
            Shelter.findById(id)
              .exec(callback);
        },
     },
     function(err,results)
     {
        if (err) { return next(err); }
        if (results.shelter==null) {
            var err = new Error('Shelter not found');
            err.status = 404;
            return next(err);
        }
        res.render('shelter_detail', { title: 'Shelter Detail', shelter: results.shelter});
     }
    );
};

exports.shelter_create_get = function (req, res, next) {
    res.render('shelter_form', { title: 'Create Shelter' });
};

exports.shelter_create_post =  [
    body('name', 'Shelter name required').isLength({ min: 1 }).trim(),
    body('address','Shelter address required').isLength({min:1}).trim(),
    body('capacity','Shelter capacity required'),
    body('people_number','people number required'),

    body('name').trim().escape(),
    
    (req, res, next) => 
    {
      const errors = validationResult(req);
      var shelter = new Shelter(
        { 
            shelter_name: req.body.name,
            address: req.body.address,
            capacity: req.body.capacity,
            people_number : req.body.people_number }
      );
      if (!errors.isEmpty()) {
        res.render('shelter_form', { title: 'Create Shelter', shelter: shelter, errors: errors.array()});
        return;
      }
      else {
           Shelter.findOne({ 'shelter_name': req.body.name })
                .exec( function(err, found_shelter){
                      if (err) { return next(err); }
                      if (found_shelter) {
                         res.render('shelter_form', { title: 'Create Shelter', shelter: shelter, errors: errors.array()});                      }
                      else {
                         shelter.save(function (err) {
                           if (err) { return next(err); }
                           res.redirect(shelter.url);
                         });
                       }
                });
        }
    }
];

exports.shelter_delete_get = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        shelter : function(callback) {
            Shelter.findById(id).exec(callback);
        },
      }, 
    function(err, results) {
        if (err) { return next(err); }
        if (results.shelter==null) { 
            res.redirect('/catalog/shelter');
        }
        res.render('shelter_delete', { title: 'Delete Shelter', shelter: results.shelter } );
      });
  }; 
  
exports.shelter_delete_post = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        shelter: function(callback) {
            Shelter.findById(id).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        Shelter.findByIdAndRemove(id, function deleteShelter(err) {
            if (err) { return next(err); }
            res.redirect('/catalog/shelter');
        });
    });
};

exports.shelter_update_get = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    Shelter.findById(id, function(err, shelter) {
        if (err) { return next(err); }
        if (shelter==null) { 
            var err = new Error('Shelter not found');
            err.status = 404;
            return next(err);
        }
        res.render('shelter_form', { title: 'Update Shelter', shelter: shelter });
    });
  };
  
  exports.shelter_update_post = [
    body('name', 'Shelter name required').isLength({ min: 1 }).trim(),
    body('address','Shelter address required').isLength({min:1}).trim(),
    body('capacity','Shelter capacity required'),
    body('people_number','people number required'),
    body('name').escape(),
    (req, res, next) => {
        var id = mongoose.Types.ObjectId(req.params.id); 
        const errors = validationResult(req);
        var shelter = new Shelter(
          {
            shelter_name: req.body.name,
            address: req.body.address,
            capacity : req.body.capacity,
            people_number:req.body.people_number,
            _id: id
          }
        );
        if (!errors.isEmpty()) {
            res.render('shelter_form', { title: 'Update Shelter', shelter: shelter, errors: errors.array()});
        return;
        }
        else {
            Shelter.findByIdAndUpdate(id, shelter, {}, function (err,theshelter) {
             if (err) { return next(err); }
             res.redirect(theshelter.url);
            });
          }
      }
  ];