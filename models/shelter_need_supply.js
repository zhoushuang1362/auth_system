var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shelter_need_supply_schema = new Schema(
    {
        shelter : { type: Schema.Types.ObjectId, ref: 'Shelter' },
        supply: {type: Schema.Types.ObjectId, ref: 'Supply'},
        need_number:{type:Number},
        date_of_request: {type:Date, required:true, timestamps: true},
    }
  );


shelter_need_supply_schema
  .virtual('url')
  .get(function () {
    return '/catalog/shelter_need_supply/' + this._id;
  });
module.exports = mongoose.model('Shelter_need_supply',shelter_need_supply_schema);
