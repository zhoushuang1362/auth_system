// Get arguments passed on command line
//var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var User=require('./models/user')
var Relationship=require('./models/relationship')
var Role=require('./models/role')
var Shelter_need_supply=require('./models/shelter_need_supply')
var Shelter_own_supply=require('./models/shelter_own_supply')
var Shelter=require('./models/shelter')
var Status=require('./models/status')
var Supply=require('./models/supply')
var User_shelter=require('./models/user_shelter')
var Friends_auth=require('./models/friends_auth')
var async = require('async')
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/shelter-managerdb?retryWrites=true';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users=[]
var shelters=[]
var supplies=[]
var status=[]
var roles=[]
var relationships=[]
var shelter_need_supplies=[]
var shelter_own_supplies=[]
var user_shelters=[]
var friends_auths=[]
//创建方法
//
function roleCreate(role_name, cb) {
  var role = new Role({ role_name: role_name });
       
  role.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New role: ' + role);
    roles.push(role)
    cb(null, status);
  } );
}

function statusCreate(status_name, cb) {
  var newstatus = new Status({ status_name: status_name });
       
  newstatus.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New status: ' + newstatus);
    status.push(newstatus)
    cb(null, status);
  } );
}

function shelterCreate(sheltername,address,capacity,peopleNumber,cb) {
  shelterdetail = {shelter_name:sheltername , address:address , capacity:capacity }
  if (peopleNumber != false) shelterdetail.people_number = peopleNumber
  var shelter = new Shelter(shelterdetail);         
  shelter.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Shelter: ' + shelter);
    shelters.push(shelter)
    cb(null, shelter)
  } );
}

function userCreate(given_name,family_name, birth, age,sex,address,telephone,note,password,is_authenticated,shelter,role,status,cb) {
    userdetail = {given_name:given_name , family_name: family_name , age:age,
                  sex:sex, address:address , note:note, password:password,is_authenticated:is_authenticated,role:role,status:status}
    if (birth != false) userdetail.birth = birth
    if (telephone != false) userdetail.telephone = telephone
    if (shelter != false) userdetail.shelter = shelter
    var user = new User(userdetail);         
    user.save(function (err) {
      if (err) {
        cb(err, null)
        return
      }
      console.log('New User: ' + user);
      users.push(user)
      cb(null, user)
    } );
}

function supplyCreate(supplyName, cb) {
  var supply = new Supply({ supply_name: supplyName });
       
  supply.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Supply: ' + supply);
    supplies.push(supply)
    cb(null, supply);
  } );
}

function relationshipCreate( user,friend,date_of_request,date_of_confirm,is_accepted,rela_type,cb){
  relationshipdetail = {user:user , friend: friend , date_of_request:date_of_request,rela_type:rela_type,
    date_of_confirm:date_of_confirm,is_accepted:is_accepted}
  var relationship = new Relationship(relationshipdetail);
  relationship.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Relationship: ' + relationship);
    relationships.push(relationship)
    cb(null, relationship)
  } );
}

function friends_authCreate(auth_user,friend,date_of_auth,cb){
  var friends_auth = new Friends_auth({auth_user:auth_user,friend:friend,date_of_auth:date_of_auth});
  friends_auth.save(function(err){
    if(err){
      cb(err,null)
      return
    }
    console.log('New friends_auth:' + friends_auth);
    friends_auths.push(friends_auth)
    cb(null,friends_auth)
  });
}

function shelter_need_supplyCreate(shelter,supply,need_number,date_of_request,cb){
  var shelter_need_supply = new Shelter_need_supply({shelter:shelter,supply:supply,need_number:need_number,date_of_request:date_of_request});
  shelter_need_supply.save(function(err){
    if(err){
      cb(err,null)
      return
    }
    console.log('New shelter_need_supply: ' + shelter_need_supply);
    shelter_need_supplies.push(shelter_need_supply)
    cb(null,shelter_need_supply)
  });
}

function shelter_own_supplyCreate(shelter,supply,own_number,date_of_update,cb){
  var shelter_own_supply = new Shelter_own_supply({shelter:shelter,supply:supply,own_number:own_number,date_of_update:date_of_update});
  shelter_own_supply.save(function(err){
    if(err){
      cb(err,null)
      return
    }
    console.log('New shelter_own_supply: ' + shelter_own_supply);
    shelter_own_supplies.push(shelter_own_supply)
    cb(null,shelter_own_supply)
  });
}

function user_shelterCreate(user,shelter,date,is_enter,cb){
  var user_shelter = new User_shelter({user:user,shelter:shelter,date:date,is_enter:is_enter});
  user_shelter.save(function(err){
    if(err){
      cb(err,null)
      return
    }
    console.log('New user_shelter: '+ user_shelter)
    user_shelters.push(user_shelter)
    cb(null,user_shelter)
  });
}
//创建实例
function createShelters(cb) {
  //
    async.series([
        function(callback) {
          shelterCreate('窪町小学校', '文京区大塚３－２－３',500,10,callback);
        },
        function(callback) {
          shelterCreate('大塚小学校', '文京区大塚４－１－７',666,20,callback);
        },
        function(callback) {
          shelterCreate('青柳小学校', '文京区大塚５－４０－１８',666,30,callback);
        },
        function(callback) {
          shelterCreate('音羽中学校', '文京区大塚１－９－２４',666,40,callback);
        },
        function(callback) {
          shelterCreate('湯島小学校', '文京区湯島２－２８－１４',666,50,callback);
        },
        ],
        // optional callback
        cb);
} 

function createRole(cb){
  async.series([
    function(callback){
    roleCreate('super',callback)
    },
    function(callback){
      roleCreate('root',callback)
    },
    function(callback){
    roleCreate('admin',callback)
    },
    function(callback){
      roleCreate('user',callback)
    },
  ],
  cb);
}

function createStatus(cb){
  async.series([
    function(callback){
      statusCreate('無傷',callback)
    },
    function(callback){
      statusCreate('軽傷',callback)
    },
    function(callback){
      statusCreate('重傷',callback)
    },
    function(callback){
      statusCreate('重体',callback)
    },
    function(callback){
      statusCreate('死亡',callback)
    }
  ],
  cb);
}
function createUsers(cb) {
    //
      async.series([
          function(callback) {
            userCreate('super', 'super', '1991-01-22', 25,'male', '東京都文京区大塚1-1-1','1234567890',
            'sssss','super','real_name_auth',shelters[0],roles[0],status[0],callback);
          },
          function(callback) {
            userCreate('root', 'root', '1990-01-22', 19,'female', '東京都文京区大塚1-1-2','1234567891',
            'sssss','root','real_name_auth',shelters[0],roles[1],status[0],callback);
          },
          function(callback) {
            userCreate('admin0', 'admin0', '1990-03-31', 18,'female', '東京都文京区大塚1-1-3','1234567892',
            'sssss','admin0','real_name_auth',shelters[0],roles[2],status[0],callback);
          },
          function(callback) {
            userCreate('admin1', 'admin1', '1990-03-31', 20,'female', '東京都文京区大塚1-1-4','1234567893',
            'sssss','admin','real_name_auth',shelters[1],roles[2],status[0],callback);
          },
          function(callback) {
            userCreate('user0', 'user0', '1999-03-31', 18,'male', '東京都文京区大塚1-1-10','0987654320',
            'sssss','000000','real_name_auth',shelters[0],roles[3],status[0],callback);
          },
          function(callback) {
            userCreate('user1', 'user1', '1998-03-31', 18,'female', '東京都文京区大塚1-1-11','0987654321',
            'sssss','111111','real_name_auth',shelters[1],roles[3],status[1],callback);
          },
          function(callback) {
            userCreate('user2', 'user2', '1997-03-31', 18,'male', '東京都文京区大塚1-1-12','0987654322',
            'sssss','222222','real_name_auth',shelters[1],roles[3],status[2],callback);
          },
          function(callback) {
            userCreate('user3', 'user3', '1996-03-31', 18,'female', '東京都文京区大塚1-1-13','0987654323',
            'sssss','333333','not_auth',shelters[2],roles[3],status[0],callback);
          },
          ],
          // optional callback
          cb);
  }
function createSupply(cb) {
  //
    async.series([
        function(callback) {
          supplyCreate('飲料水',callback);
        },
        function(callback) {
          supplyCreate('非常食',callback);
        },
        function(callback) {
          supplyCreate('毛布',callback);
        },
        function(callback) {
          supplyCreate('簡易トイレ',callback);
        },
        function(callback) {
          supplyCreate('パン',callback);
        },
        function(callback) {
          supplyCreate('ベビーフード',callback);
        },
        ],
        // optional callback
        cb);
}

function createRelationship(cb){
  async.series([
    function(callback){
      relationshipCreate(users[2],users[3],Date.now(),Date.now(),null,'friend',callback);
    },
  ],
  cb);
}

function createFriends_auth(cb){
  async.series([
    function(callback){
      friends_authCreate(users[2],users[3],Date.now(),callback)
    },
  ],
  cb);
}

function createShelter_need_supply(cb){
  async.series([
    function(callback){
      shelter_need_supplyCreate(shelters[0],supplies[0],10,Date.now(),callback);
    },
  ],
  cb);
}

function createShelter_own_supply(cb){
  async.series([
    function(callback){
      shelter_own_supplyCreate(shelters[1],supplies[1],10,Date.now(),callback);
    },
  ],
  cb);
}

function createUser_shelter(cb){
  async.series([
    function(callback){
      user_shelterCreate(users[4],shelters[0],Date.now(),true,callback);
    },
  ],
  cb);
}

//function call
async.series([
    createRole,
    createStatus,
    createSupply,
    createShelters,
    createUsers,
    createShelter_need_supply,
    createShelter_own_supply,
    createUser_shelter,
    createRelationship,
    createFriends_auth,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('users: '+users);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});