var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shelter_own_supply_schema = new Schema(
    {
        shelter : { type: Schema.Types.ObjectId, ref: 'Shelter' },
        supply: {type: Schema.Types.ObjectId, ref: 'Supply'},
        own_number:{type:Number},
        date_of_update: {type:Date, required:true, timestamps: true},
    }
  );

  shelter_own_supply_schema
  .virtual('url')
  .get(function () {
    return '/catalog/shelter_own_supply/' + this._id;
  });
module.exports = mongoose.model('Shelter_own_supply',shelter_own_supply_schema);
  