/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 5/2/13
 * Time: 10:20 PM
 * To change this template use File | Settings | File Templates.
 */

var dbox  = require("dbox"),
    fs = require('fs'),
    gm = require('gm'),
    app   = dbox.app({ "app_key": "no00xsfglgclzib", "app_secret": "pbxm6gm0409rfae" }),
    access_token = { oauth_token_secret: '2aqivn6sx5c21p5', oauth_token: 'nanpa21ohrnpwmx', uid: '48451001' },
    client = app.client(access_token);


//Code needed to setup access token
/*
 app.requesttoken(function(status, request_token){
 console.log("request");
 console.log(request_token);

 });

var request_token =  { oauth_token_secret: '520Jown2yivCnIAv',
    oauth_token: '2NJy7YiXroVjemwT',
    authorize_url: 'https://www.dropbox.com/1/oauth/authorize?oauth_token=2NJy7YiXroVjemwT' };

/*
 app.accesstoken(request_token, function(status, access_token){
 console.log(access_token)
 })
 */

client.account(function(status, reply){
    console.log(reply)
});

exports.photoUpload = function (req, res, db) {

    console.log(JSON.stringify(req.files));
    var photo =   req.files.userPhoto;
    var filePath =    photo.path +'/'+ photo.name ;
    var d = new Date();
    var PhotoName = d.toString() + "_" + req.files.userPhoto.name;
    console.log( filePath);
    var buf =  fs.readFileSync(photo.path);
    client.put(PhotoName, buf, function(status, reply){
        var path = reply.path;
        console.log(reply);

        client.thumbnails(path,{ size:'l'} , function(status, reply, metadata){
            console.log(metadata);

            var fullpath  = __dirname.replace('routes','static');
            fullpath = fullpath + '/images/thumbs' + path;

            var relpath = 'images/thumbs' + path;

            var mediaArgs = {imageName: photo.name, imagePath:path, thumbNailPath:relpath};
            db.addMedia(mediaArgs, function(result){
                "use strict";
                fs.writeFile(fullpath, reply, function () {
                    console.log('Thumbnail saved!');
                    res.send(relpath);
                });
            });
        });
     });
};






