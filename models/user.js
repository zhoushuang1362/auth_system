var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var user_schema = new Schema(
  {
    family_name: {type: String, required: true, max: 100},
    given_name: {type: String, required: true, max: 100},
    birth: {type: Date,required:true},
    age:{type: Number,required:true},
    sex:{type:String,enum:['male','female'],required:true},
    password:{type:String,required:true},
    address:{type:String,required:true},
    telephone:{type:String,require:true},
    is_authenticated:{type:String,enum:['real_name_auth','temp_auth','not_auth'],default:'not_auth'},
    note:{type:String,default:'なし'},
    auth_number:{type:Number,default:0},
    status:{type: Schema.Types.ObjectId, ref: 'Status'},
    role:{type: Schema.Types.ObjectId,  ref: 'Role',default:'5ee25085963f7d167ca42457'},
    shelter:{type: Schema.Types.ObjectId, ref: 'Shelter'},
    avatar_url:{type:String,default:null},
  }
);
// Virtual for user's full name
user_schema
.virtual('name')
.get(function () {
  var fullname = '';
  if (this.family_name && this.given_name) {
    fullname = this.family_name + ', ' + this.given_name
  }
  if (!this.family_name || !this.given_name) {
    fullname = '';
  }
  return fullname;
});
// Virtual for user's URL
user_schema
.virtual('url')
.get(function () {
  return '/catalog/user/' + this._id;
});
user_schema
.virtual('birth_formatted')
.get(function () {
  return moment(this.birth).format('YYYY MM DD');
});
user_schema
.virtual('url_request_friend')
.get(function () {
  return '/catalog/relationship/request/' + this._id;
});
module.exports = mongoose.model('User', user_schema);