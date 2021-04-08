var Shelter_need_supply = require('../models/shelter_need_supply');
var Supply = require('../models/supply');
var Shelter = require('../models/shelter');
var mongoose = require('mongoose');
var async = require('async')
const { body, validationResult } = require('express-validator');
exports.all_shelter_need_supply = function(req,res,next){
    Shelter_need_supply.find()
        .populate('shelter')
        .populate('supply')
        .exec(function (err, allneedsupplies) {
            if (err) { return next(err); }
            res.render('all_need_supplies', { title: 'The supplies that shelter need', all_shelter_need_supply: allneedsupplies });
        })
};

exports.shelter_need_supply_detail = function(req, res,next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        shelter_need_supply: function (callback) {
            Shelter_need_supply.findById(id)
                .populate('shelter')
                .populate('supply')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.shelter_need_supply == null) { 
            var err = new Error('shelter_need_supply not found');
            err.status = 404;
            return next(err);
        }
        res.render('shelter_need_supply_detail', { title: 'Shelter_need_supply Detail', shelter_need_supply: results.shelter_need_supply });
    });
};

exports.shelter_need_supply_create_get = function (req, res, next) {
    async.parallel({
        shelters: function(callback) {
            Shelter.find(callback);
        },
        supplies: function(callback) {
            Supply.find(callback);
        },
      }, function(err, results) {
            if (err) { return next(err); }
                res.render('shelter_need_supply_form', { title: 'Create shelter need supply',shelters:results.shelters, supplies:results.supplies });
        }
    );
};

exports.shelter_need_supply_create_post =  [
    body('shelter', 'Shelter required'),
    body('supply','Supply required'),
    body('need_number','need number required'),
    (req, res, next) => 
    {
        const errors = validationResult(req);
        var shelter_need_supply = new Shelter_need_supply({ 
            shelter: req.body.shelter,
            supply: req.body.supply,
            need_number: req.body.need_number,
            date_of_request: Date.now() }
        );
        if (!errors.isEmpty()) {
            res.render('shelter_need_supply_form', { title: 'Create shelter_need_supply', shelter_need_supply: shelter_need_supply, errors: errors.array()});
            return;
        }
        else {
            Shelter_need_supply.findOne({ 'shelter': req.body.shelter , 'supply' : req.body.supply })
                .exec( function(err, found_shelter_need_supply){
                      if (err) { return next(err); }
                      if (found_shelter_need_supply) {
                         res.render('shelter_need_supply_form', { title: 'Create Shelter_need_supply', need_number: need_number, errors: errors.array()});                      }
                      else {
                            shelter_need_supply.save(function (err) {
                                if (err) { return next(err); }
                                    res.redirect(shelter_need_supply.url);
                            });
                        }
                });
        }
    }
];

exports.shelter_need_supply_delete_get = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        shelter_need_supply : function(callback) {
            Shelter_need_supply.findById(id)
                .populate('shelter')
                .populate('supply')
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.shelter_need_supply==null) { 
            res.redirect('/catalog/shelter_need_supply');
        }
        res.render('shelter_need_supply_delete', { title: 'Delete Shelter_need_supply', shelter_need_supply: results.shelter_need_supply } );
    });
}; 

exports.shelter_need_supply_delete_post = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        shelter_need_supply: function(callback) {
            Shelter_need_supply.findById(id)
                .populate('shelter')
                .populate('supply')
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        Shelter_need_supply.findByIdAndRemove(id, function deleteShelter_need_supply(err) {
            if (err) { return next(err); }
            res.redirect('/catalog/shelter_need_supply');
        });     
    });
};

exports.shelter_need_supply_update_get = function(req, res, next) {
    async.parallel({
        shelter_need_supply: function(callback) {
            Shelter_need_supply.findById(req.params.id)
                .populate('shelter')
                .populate('supply')
                .exec(callback);
        },
        shelters: function(callback) {
            Shelter.find(callback);
        },
        supplies: function(callback) {
            Supply.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.shelter_need_supply==null) { 
                var err = new Error('Shelter_need_supply not found');
                err.status = 404;
                return next(err);
            }
            res.render('shelter_need_supply_form', { title: 'Update Shelter_need_supply', shelters:results.shelters, supplies:results.supplies,need_number:results.need_number, shelter_need_supply: results.shelter_need_supply });
        });

};


exports.shelter_need_supply_update_post = [

    // Convert the shelter to an array.
    (req, res, next) => {
        if(!(req.body.supply instanceof Array)){
            if(typeof req.body.supply==='undefined')
                req.body.supply=[];
            else
                req.body.supply=new Array(req.body.supply);
        }
        next();
    },
   
    // Validate fields.
    body('shelter', 'Shelter must not be empty.').isLength({ min: 1 }).trim(),
    body('supply', 'Supply must not be empty.').isLength({ min: 1 }).trim(),
    body('need_number', 'Own_number must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    body('shelter').escape(),
    body('supply').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        var shelter_need_supply = new Shelter_need_supply(
          { shelter: req.body.shelter,
            supply: req.body.supply,
            need_number: req.body.need_number,
            date_of_request:Date.now(),
            _id:req.params.id // This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            async.parallel({
                shelter: function(callback) {
                    Shelter.find(callback);
                },
                supply: function(callback) {
                    Supply.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                // Mark our selected genres as checked.
                for (let i = 0; i < results.supply.length; i++) {
                    if (shelter_need_supply.supply.indexOf(results.supplies[i]._id) > -1) {
                        results.supplies[i].checked='true';
                    }
                }
                res.render('shelter_need_supply_form', { title: 'Update shelter_need_supply',shelters:results.shelters, supplies:results.supplies, need_number: need_number, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Shelter_need_supply.findByIdAndUpdate(req.params.id, shelter_need_supply, {}, function (err,theshelter_need_supply) {
                if (err) { return next(err); }
                   res.redirect(theshelter_need_supply.url);
                });
        }
    }
];
