//Permission Definitions
var userPermissions = {
    role: 'user',
    resources: [
        '/user/create',
        '/user/:id',
        '/user/:id/update',
        '/user/avatar_upload',
        '/user/handle_cut',
        '/user/create_qrcode',
        '/user/show_qrcode',
        '/user/identification',
        '/user/facial_recognition',
        '/relationship',
        '/relationship/research',
        '/relationship/:id/accept',
        '/relationship/:id/refuse', 
        '/relationship/request/:id',
        '/relationship/:id/message',
        '/friends_auth/create',
        '/shelter',
        '/relationship/all_friends'
    ],
    permissions: ['*'],
}; 
var adminPermissions = {
    role: 'admin',
    resources: [
        '/status',
        '/status/create', 
        '/status/:id',
        '/status/:id/delete',
        '/status/:id/update',
        '/supply',
        '/supply/create',
        '/supply/:id',
        '/supply/:id/delete',
        '/supply/:id/update',
        '/shelter',
        '/shelter/create', 
        '/shelter/:id',
        '/shelter/:id/delete',
        '/shelter/:id/update',
        '/user',
        '/user/:id',
        '/user/:id/delete',
        '/user/:id/update',
        '/user/avatar_upload',
        '/user/handle_cut',
        '/user/create_qrcode',
        '/user/show_qrcode',
        '/user/identification',
        '/user/facial_recognition',
        '/shelter_own_supply',
        '/shelter_own_supply/create',
        '/shelter_own_supply/:id',
        '/shelter_own_supply/:id/delete',
        '/shelter_own_supply/:id/update',
        '/shelter_need_supply',
        '/shelter_need_supply/create',
        '/shelter_need_supply/:id',
        '/shelter_need_supply/:id/delete',
        '/shelter_need_supply/:id/update',
        '/user_shelter',
        '/relationship',
    ],
    permissions: ['*'],
};  
var rootPermissions = {
    role: 'root',
    resources: [
        '/status',
        '/status/create', 
        '/status/:id',
        '/status/:id/delete',
        '/status/:id/update',
        '/supply',
        '/supply/create',
        '/supply/:id',
        '/supply/:id/delete',
        '/supply/:id/update',
        '/shelter',
        '/shelter/create', 
        '/shelter/:id',
        '/shelter/:id/delete',
        '/shelter/:id/update',
        '/user/:id',
        '/user/:id/delete',
        '/user/:id/update',
        '/user/avatar_upload',
        '/user/handle_cut',
        '/user/create_qrcode',
        '/user/show_qrcode',
        '/user/identification',
        '/user/facial_recognition',
        '/shelter_own_supply',
        '/shelter_own_supply/create',
        '/shelter_own_supply/:id',
        '/shelter_own_supply/:id/delete',
        '/shelter_own_supply/:id/update',
        '/shelter_need_supply',
        '/shelter_need_supply/create',
        '/shelter_need_supply/:id',
        '/shelter_need_supply/:id/delete',
        '/shelter_need_supply/:id/update',
        '/user_shelter',
        '/role',
        '/relationship',
    ],
    permissions: ['*'],
};
var superPermissions = {
    role: 'super',
    resources: [
        '/',
        '/status',
        '/status/create', 
        '/status/:id',
        '/status/:id/delete',
        '/status/:id/update',
        '/supply',
        '/supply/create',
        '/supply/:id',
        '/supply/:id/delete',
        '/supply/:id/update',
        '/shelter',
        '/shelter/create', 
        '/shelter/:id',
        '/shelter/:id/delete',
        '/shelter/:id/update',
        '/user',
        '/user/create',
        '/user/:id',
        '/user/:id/delete',
        '/user/:id/update',
        '/user/avatar_upload',
        '/user/handle_cut',
        '/user/create_qrcode',
        '/user/show_qrcode',
        '/user/identification',
        '/user/facial_recognition',
        '/shelter_own_supply',
        '/shelter_own_supply/create',
        '/shelter_own_supply/:id',
        '/shelter_own_supply/:id/delete',
        '/shelter_own_supply/:id/update',
        '/shelter_need_supply',
        '/shelter_need_supply/create',
        '/shelter_need_supply/:id',
        '/shelter_need_supply/:id/delete',
        '/shelter_need_supply/:id/update',
        '/user_shelter',
        '/role',
        '/relationship',
        '/relationship/all_friends',
        '/relationship/research',
        '/relationship/:id/accept',
        '/relationship/:id/refuse', 
        '/relationship/request/:id',
        '/relationship/:id/message',
        '/friends_auth/create',
    ],
    permissions: ['*'],
};
exports.permissions_array = [
    userPermissions,
    adminPermissions,
    rootPermissions,
    superPermissions
];

