var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var relationship_schema = new Schema(
    {
      user:{type: Schema.Types.ObjectId, ref: 'User'},
      friend:{type: Schema.Types.ObjectId, ref: 'User'},
      date_of_request: {type:Date, reqsuired:true, default:Date.now},
      date_of_confirm: {type:Date },
      is_accepted: {type:Boolean},
      rela_type:{type:String,enum:['friend','family']},
      message:{type:String,default:'なし'},
    }
  );


relationship_schema
.virtual('url')
.get(function () {
  return '/catalog/relationship/' + this._id;
});
relationship_schema
.virtual('url_accept')
.get(function () {
  return '/catalog/relationship/' + this._id + '/accept';
});
relationship_schema
.virtual('url_refuse')
.get(function () {
  return '/catalog/relationship/' + this._id + '/refuse';
});
relationship_schema
.virtual('url_message')
.get(function () {
  return '/catalog/relationship/' + this._id + '/message';
});
relationship_schema
.virtual('date_of_request_formatted')
.get(function () {
  return moment(this.date_of_request).format('YYYY-MM-DD HH:mm:ss');
});
relationship_schema
.virtual('date_of_confirm_formatted')
.get(function () {
  return moment(this.date_of_confirm).format('YYYY-MM-DD HH:mm:ss');
});
module.exports = mongoose.model('Relationship',relationship_schema);