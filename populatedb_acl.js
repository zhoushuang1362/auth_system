var acl = require('acl');
var acl_array = require('./acl_array')
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/shelter-managerdb?retryWrites=true';
mongoose.connect(mongoDB, { useNewUrlParser: true })
                            .then(()=>{
                                acl_def_mongo()
                            });
function acl_def_mongo(){
    var nodeAcl = new acl(new acl.mongodbBackend(mongoose.connection.db,'_acl'));
    for (let a = 0; a < acl_array.permissions_array.length; a++) {
        for (let b = 0; b < acl_array.permissions_array[a].resources.length; b++) {
            nodeAcl.allow(acl_array.permissions_array[a].role,
                    acl_array.permissions_array[a].resources[b],acl_array.permissions_array[a].permissions);
        }        
    }
    //nodeAcl.addRoleParents('admin','user');
    //nodeAcl.addRoleParents('root','admin');
    // mongoose.connection.close();
};
