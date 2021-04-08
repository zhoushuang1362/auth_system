var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var friends_auth_schema = new Schema(
    {
        auth_user:{type: Schema.Types.ObjectId, ref: 'User'},
        friend:{type: Schema.Types.ObjectId, ref: 'User'},
        date_of_auth:{type:Date, reqsuired:true, default:Date.now},
    }
)
friends_auth_schema
.virtual('date_of_auth_formatted')
.get(function () {
  return moment(this.date_of_auth).format('YYYY-MM-DD HH:mm:ss');
});


module.exports = mongoose.model('Friends_auth',friends_auth_schema);