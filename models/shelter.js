var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shelter_schema = new Schema(
  {
    shelter_name: {type: String, required: true},
    address:{type:String,required:true},
    capacity:{type:Number,require:true},
    people_number:{type:Number,require:true}
  }
);
// Virtual for shelter's URL
shelter_schema
.virtual('url')
.get(function () {
  return '/catalog/shelter/' + this._id;
});
//Export model
module.exports = mongoose.model('Shelter', shelter_schema);