var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var status_schema = new Schema(
    {
        status_name: {type: String, required: true, default:'未確認'}
    }
);

// 虚拟属性'url'
status_schema
  .virtual('url')
  .get(function () {
    return '/catalog/status/' + this._id;
  });

module.exports = mongoose.model('Status', status_schema);
