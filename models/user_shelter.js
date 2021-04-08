var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var user_shelter_schema = new Schema(
    {
        user:{type: Schema.Types.ObjectId, ref: 'User'},
        shelter : { type: Schema.Types.ObjectId, ref: 'Shelter' },
        date: {type:Date, required:true,timestamps: true},
	    is_enter: {type:Boolean, required:true, default:true}
    }
);

user_shelter_schema
.virtual('date_formatted')
.get(function () {
  return moment(this.date).format('YYYY-MM-DD HH:mm:ss');
});

module.exports = mongoose.model('User_shelter',user_shelter_schema);