exports.avatar_upload=function(req,res,next){
    var login_user_id = req.session.user._id;
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    //上传路径
    form.uploadDir = 'public/images/avatars/';
    form.keepExtensions = true;//设置该属性为true可以使得上传的文件保持原来的文件的扩展名
    form.maxFieldsSize = 2*1024*1024;//限制所有存储表单字段域的大小（除去file字段），如果超出，则会触发error事件，默认为2M
    form.parse(req,function(err,fields,files){//该方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息
        if(err){
            res.locals.error = err;
            console.log("parse error");
            res.redirect('/catalog');
            return;
        }
        console.log(files);
        var ext_name = '';
        switch(files.ful_avatar.type){
        case 'image/pjpeg':
            ext_name ='jpg';
            break;
        case 'image/jpeg':
            ext_name ='jpg';
            break;
        case 'image/png':
            ext_name='png';
            break;
        case 'image/x-png':
            ext_name='png';
            break;
        };
        if(ext_name.length==0){
            res.locals.error='Only png and jpg formats are supported';
            res.redirect('/catalog');
            return;
        };
        var avatar_name = login_user_id+'.'+ext_name;
        var new_path = form.uploadDir+avatar_name;
        var show_url = '/images/avatars/'+avatar_name;
        var imgName = path.basename(new_path);//提取出用 ‘/' 隔开的path的最后一部分
        fs.rename(files.ful_avatar.path,new_path,function(err){//对上传后的图片进行重命名并更改存储路径
            if (err) {
                res.send({
                    ok: false,
                    msg: "上传成功但改名失败"
                });
                return;
            }
            console.log("old_path",files.ful_avatar.path);
            console.log("new_path",new_path);
            imageMagick(new_path)//进行图片剪裁和压缩
            .resize(580)// 等比变成宽度580
            .crop(580,580, 0, 0)// 保留高度580，使不溢出
            .write(new_path, function (err) {//压缩后的图片重新写入
                if (err) {
                    res.send({
                        ok: false,
                        msg: "写入失败"
                    });
                    return;
                }
                User.findByIdAndUpdate(login_user_id, {avatar_url:show_url}, function (err) {//更新数据库头像链接
                    if (err) { return next(err); }
                    console.log("database updated");
                    // res.redirect('/catalog');
                    res.render("cut_image", {imgName:imgName});
                });
            });
        });
    });    
};