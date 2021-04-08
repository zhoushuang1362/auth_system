var mongoose = require('mongoose');
var Supply = require('../models/supply');
var Shelter = require('../models/shelter');
var Shelter_own_supply = require('../models/shelter_own_supply');
var async = require('async')
const { body, validationResult } = require('express-validator');

exports.all_shelter_own_supply = function(req,res,next){
    Shelter_own_supply.find()
        .populate('shelter')
        .populate('supply')
        .exec(function (err, allownsupplies) {
            if (err) { return next(err); }
            res.render('all_own_supplies', { title: 'The supplies that shelter own', all_shelter_own_supply: allownsupplies });
        })
};

exports.shelter_own_supply_detail = function(req, res,next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        shelter_own_supply: function (callback) {
            Shelter_own_supply.findById(id)
                .populate('shelter')
                .populate('supply')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.shelter_own_supply == null) { 
            var err = new Error('shelter_own_supply not found');
            err.status = 404;
            return next(err);
        }
        res.render('shelter_own_supply_detail', { title: 'Shelter_own_supply Detail', shelter_own_supply: results.shelter_own_supply });
    });
};

exports.shelter_own_supply_create_get = function (req, res, next) {
    async.parallel({
        shelters: function(callback) {
            Shelter.find(callback);
        },
        supplies: function(callback) {
            Supply.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            res.render('shelter_own_supply_form', { title: 'Create shelter own supply',shelters:results.shelters, supplies:results.supplies });
        }
    );
};

exports.shelter_own_supply_create_post =  [
    body('shelter', 'Shelter required'),
    body('supply','Supply required'),
    body('own_number','own number required'),
    
    (req, res, next) => 
    {
        const errors = validationResult(req);
        var shelter_own_supply = new Shelter_own_supply(
        { shelter: req.body.shelter,
          supply: req.body.supply,
          own_number: req.body.own_number,
          date_of_update: Date.now() }
        );
        if (!errors.isEmpty()) {
            res.render('shelter_own_supply_form', { title: 'Create shelter_own_supply', shelter_own_supply: shelter_own_supply, errors: errors.array()});
            return;
        }
        else {
            Shelter_own_supply.findOne({ 'shelter': req.body.shelter , 'supply' : req.body.supply })
                .exec( function(err, found_shelter_own_supply){
                        if (err) { return next(err); }
                        if (found_shelter_own_supply) {
                            res.render('shelter_own_supply_form', { title: 'Update Shelter_own_supply', own_number: own_number, errors: errors.array()});                      }
                        else {
                            shelter_own_supply.save(function (err) {
                            if (err) { return next(err); }
                            res.redirect(shelter_own_supply.url);
                            });
                        }
                });
        }
    }
];

exports.shelter_own_supply_delete_get = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        shelter_own_supply : function(callback) {
            Shelter_own_supply.findById(id)
                .populate('shelter')
                .populate('supply')
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.shelter_own_supply==null) { 
            res.redirect('/catalog/shelter_own_supply');
        }
        res.render('shelter_own_supply_delete', { title: 'Delete Shelter_own_supply', shelter_own_supply: results.shelter_own_supply } );
    });
}; 

exports.shelter_own_supply_delete_post = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        shelter_own_supply: function(callback) {
            Shelter_own_supply.findById(id)
                .populate('shelter')
                .populate('supply')
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        Shelter_own_supply.findByIdAndRemove(id, function deleteShelter_own_supply(err) {
            if (err) { return next(err); }
            res.redirect('/catalog/shelter_own_supply');
        });     
    });
};

exports.shelter_own_supply_update_get = function(req, res, next) {
    async.parallel({
        shelter_own_supply: function(callback) {
            Shelter_own_supply.findById(req.params.id)
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
            if (results.shelter_own_supply==null) { 
                var err = new Error('Shelter_own_supply not found');
                err.status = 404;
                return next(err);
            }
            res.render('shelter_own_supply_form', { title: 'Update Shelter_own_supply', shelters:results.shelters, supplies:results.supplies,own_number:results.own_number, shelter_own_supply: results.shelter_own_supply });
        });

};


exports.shelter_own_supply_update_post = [

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
    body('own_number', 'Own_number must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    body('shelter').escape(),
    body('supply').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        var shelter_own_supply = new Shelter_own_supply(
          { shelter: req.body.shelter,
            supply: req.body.supply,
            own_number: req.body.own_number,
            date_of_update:Date.now(),
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
                    if (shelter_own_supply.supply.indexOf(results.supplies[i]._id) > -1) {
                        results.supplies[i].checked='true';
                    }
                }
                res.render('shelter_own_supply_form', { title: 'Update shelter_own_supply',shelters:results.shelters, supplies:results.supplies, own_number: own_number, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Shelter_own_supply.findByIdAndUpdate(req.params.id, shelter_own_supply, {}, function (err,theshelter_own_supply) {
                if (err) { return next(err); }
                   res.redirect(theshelter_own_supply.url);
                });
        }
    }
];
