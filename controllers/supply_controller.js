var mongoose = require('mongoose');
//..回退一层，只在引用文件时使用
var Supply = require('../models/supply');
var async = require('async')
const { body, validationResult } = require('express-validator');
exports.all_supplies = function(req,res,next){
    Supply.find()
        .sort([['supply_name', 'ascending']])
        .exec(function (err, allsupplies) {
            if (err) { return next(err); }
            res.render('all_supplies', { title: 'All supplies', all_supplies: allsupplies });
        })
};

exports.supply_detail = function(req,res,next){
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        supply: function(callback) {
            Supply.findById(id)
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.supply==null) {
            var err = new Error('Supply not found');
            err.status = 404;
            return next(err);
        }
        res.render('supply_detail', { title: 'Supply Detail', supply: results.supply} );
    });

};

exports.supply_create_get = function(req, res, next) {       
    res.render('supply_form', { title: 'Create Supply' });
};

exports.supply_create_post =  [
    body('name', 'Supply name required').isLength({ min: 1 }).trim(),
    // Sanitize (trim and escape) the name field.
    body('name').trim().escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create a genre object with escaped and trimmed data.
        var supply = new Supply(
          { supply_name: req.body.name }
        );
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('supply_form', { title: 'Create Supply', supply: supply, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid.
            // Check if supply with same name already exists.
            Supply.findOne({ 'supply_name': req.body.name })
                .exec( function(err, found_supply) {
                     if (err) { return next(err); }
                     if (found_supply) {
                         // Genre exists, redirect to its detail page.
                         //res.redirect(found_supply.url);
                         res.render('supply_form')        
                     }
                     else {
                         supply.save(function (err) {
                           if (err) { return next(err); }
                           // Genre saved. Redirect to genre detail page.
                           res.redirect(supply.url);
                         });

                     }
                 });
        }
    }
];

exports.supply_delete_get = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        supply : function(callback) {
            Supply.findById(id).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.supply==null) { 
            res.redirect('/catalog/supply');
        }
        res.render('supply_delete', { title: 'Delete Supply', supply: results.supply } );
    });
}; 

exports.supply_delete_post = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        supply: function(callback) {
            Supply.findById(id).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        Supply.findByIdAndRemove(id, function deleteSupply(err) {
            if (err) { return next(err); }
            res.redirect('/catalog/supply');
        });
    });
};

exports.supply_update_get = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    Supply.findById(id, function(err, supply) {
        if (err) { return next(err); }
        if (supply==null) { 
            var err = new Error('Supply not found');
            err.status = 404;
            return next(err);
        }
        res.render('supply_form', { title: 'Update Supply', supply: supply });
    });
};

exports.supply_update_post = [
    // Validate that the name field is not empty.
    body('name', 'Supply name required').isLength({ min: 1 }).trim(),
    // Sanitize (escape) the name field.
    body('name').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        var id = mongoose.Types.ObjectId(req.params.id); 
        // Extract the validation errors from a request .
        const errors = validationResult(req);
        // Create a supply object with escaped and trimmed data (and the old id!)
        var supply = new Supply(
          {
          supply_name: req.body.name,
          _id: id
          }
        );
        if (!errors.isEmpty()) {
            res.render('supply_form', { title: 'Update Supply', supply: supply, errors: errors.array()});
        return;
        }
        else {
            Supply.findByIdAndUpdate(id, supply, {}, function (err,thesupply) {
                if (err) { return next(err); }
                   res.redirect(thesupply.url);
                });
        }
    }
];