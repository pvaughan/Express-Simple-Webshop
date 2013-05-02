//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , format = require('util').format
    , sqlServer = require("./models/mysqlDB.js")
    , dbox  = require("dbox")
    , routes = require('./routes')
    ,fs = require('fs')
    , reviews = require('./routes/reviews')
    , info = require('./routes/info')
    , rsvp = require('./routes/rsvp')
    , io = require('socket.io')
    , hbsPrecompiler = require('handlebars-precompiler')
    , port = (process.env.PORT || 3000);

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use('/node_modules', connect.static('node_modules'));
    server.use(server.router);
    hbsPrecompiler.watchDir(
        __dirname + "/views",
        __dirname + "/static/js/templates.js",
        ['handlebars', 'hbs']
    );
});

//setup the errors
server.error(function (err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: 'Paul Vaughan'
                 ,analyticssiteid: 'UA-38061682-1'
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: 'Test webapp with express and backbone'
                 ,author: 'Paul Vaughan'
                 ,analyticssiteid: 'UA-38061682-1'
                 ,error: err 
                },status: 500 });
    }
});
server.listen( port);

//Setup Socket.IO

var io = io.listen(server);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});


var app   = dbox.app({ "app_key": "no00xsfglgclzib", "app_secret": "pbxm6gm0409rfae" })
/*
app.requesttoken(function(status, request_token){
    console.log("request");
    console.log(request_token);

});*/

var request_token =  { oauth_token_secret: '520Jown2yivCnIAv',
                       oauth_token: '2NJy7YiXroVjemwT',
                       authorize_url: 'https://www.dropbox.com/1/oauth/authorize?oauth_token=2NJy7YiXroVjemwT' };

/*
app.accesstoken(request_token, function(status, access_token){
    console.log(access_token)
})
*/


var access_token = { oauth_token_secret: '2aqivn6sx5c21p5',
                     oauth_token: 'nanpa21ohrnpwmx',
                     uid: '48451001' };


var client = app.client(access_token);
client.account(function(status, reply){
    console.log(reply)
});



///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', routes.index);

server.get('/info', info.info);
server.get('/rsvp', rsvp.rsvp);
server.get('/photo',reviews.photoUpload);


server.get('/reviews', restrict, reviews.reviews);

server.get('/items', function(req, res){
    sqlServer.getItems(function(itmes) {
        res.send(itmes);
    });
});

server.get('/env', function(req, res){

        res.send(process.env.VCAP_SERVICES);

});




server.post('/items', function(req, res){
    sqlServer.addItem(req, res, function(itmem) {
        res.send(itmem);
    });
});

server.post('/rsvp/code', function (req, res){
    sqlServer.getGuestWithCode(req, res, function (guests) {
        res.send(guests);
    });
});

server.post('/rsvp/confirmRVP', function (req, res){
    sqlServer.updateGuestWithRSVP(req, res);
});


server.post('/api/photos', function(req, res) {
    console.log(JSON.stringify(req.files));
    var photo =   req.files.userPhoto;
    var filePath =    photo.path +'/'+ photo.name ;
    console.log( filePath);

    fs.readFile( photo.path, function(err, data) {
        if (err) throw err; // Fail if the file can't be read.
        client.put(req.files.userPhoto.name, data, function(status, reply){
            console.log(reply)
        })
    });


});

//image
server.get('/image', function(req, res){
    res.send('<form method="post" enctype="multipart/form-data">'
        + '<p>Title: <input type="text" name="title" /></p>'
        + '<p>Image: <input type="file" name="image" /></p>'
        + '<p><input type="submit" value="Upload" /></p>'
        + '</form>');
});

server.post('/image', function(req, res, next){
    // the uploaded file can be found as `req.files.image` and the
    // title field as `req.body.title`

    client.put(req.files.image.name, req.files.image, function(status, reply){
        console.log(reply)
    })


    res.send(format('\nuploaded %s (%d Kb) to %s as %s'
        , req.files.image.name
        , req.files.image.size / 1024 | 0
        , req.files.image.path
        , req.body.title));
});



//Login
function restrict(req, res, next) {
    if (req.session.guests) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

server.get('/login', function(req, res){
    res.render('login.jade', {
        locals : {
            title : 'Login'
            ,description: 'Sven en laura gaan trouwen whoohooo!!'
            ,page: 'login'
            ,author: 'Paul Vaughan'
            ,analyticssiteid: 'UA-38061682-1'
        }
    });

});

server.post('/login', function(req, res){
    sqlServer.getGuestWithCode(req, res, function (guests) {
        if (guests) {
            // Regenerate session when signing in
            // to prevent fixation
            var userName =  "";
            for (var i = 0; i < guests.length; i++) {
                userName += guests[i].Name + " ";
            }

            req.session.regenerate(function(){
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.guests = guests;
                req.session.success = 'Authenticated as ' + userName
                    + ' click to <a href="/logout">logout</a>. '
                    + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('back');
            });
        } else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.'
                + ' (use "tj" and "foobar")';
            res.redirect('login');
        }
    });
});

server.get('/logout', function(req, res){
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
        res.redirect('/');
    });
});



//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
