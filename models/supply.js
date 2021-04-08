var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var supply_schema = new Schema(
    {
        supply_name: {type: String, required: true}
    }
);

// Virtual for supply's URL
supply_schema
.virtual('url')
.get(function () {
  return '/catalog/supply/'+this.id;
});

module.exports = mongoose.model('Supply',supply_schema);
  