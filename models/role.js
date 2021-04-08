var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var role_schema = new Schema(
    {
        role_name: {type: String, required: true}
    }
);

// Virtual for role's URL
role_schema
.virtual('url')
.get(function () {
  return '/catalog/role/' + this._id;
});
module.exports = mongoose.model('Role', role_schema);
