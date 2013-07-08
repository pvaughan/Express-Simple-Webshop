/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 3/30/13
 * Time: 9:41 PM
 * To change this template use File | Settings | File Templates.
 */

var mysql = require('mysql');
var MYSQL_USERNAME = 'root';
var MYSQL_PASSWORD = '';

var connection;


if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var cre = env['mysql-5.1'][0]['credentials'];

    connection = mysql.createConnection({
        host: cre.host,
        port: cre.port,
        user: cre.username,
        password: cre.password,
        database: cre.name
    });
    console.log('connected to cloud db');
} else {
    connection = mysql.createConnection({
        host: 'localhost',
        user: MYSQL_USERNAME,
        password: MYSQL_PASSWORD,
        database: 'svenenlauraDB'
    });
}




exports.getItems = function(callback) {
    connection.query("SELECT ID as id, Name, Description, ImageData, Price, NrInStock FROM Items", function(err, results, fields) {
        // callback function returns employees array
        callback(results);

    });
}



exports.addItem = function(req, res) {
    var item = req.body;
    console.log('Adding item: ' + JSON.stringify(item));
    connection.query("insert into Items (Name, Description) values (?,?)", [item.Name, item.Description], function(err, result) {
        console.log('Name '+item.Name+' Description '+item.Description);
        res.send(result[0]);
    });
}


exports.addMedia = function(media, callback) {
    console.log('Adding media: ' + JSON.stringify(media));

    connection.query( "INSERT INTO Media(Name, Path, ThumbNailPath ) VALUES (?, ?,?)", [media.imageName,  media.imagePath, media.thumbNailPath ], function(err, result) {
        console.log(JSON.stringify(err));
        console.log(JSON.stringify(result));
        callback(result);
    });
}

exports.getAllMedia = function(callback) {
    connection.query("select * from Media", function(err, results, fields) {
        // callback function returns employees array
        callback(results);
     });
}




exports.getGuestWithCode = function(req, res, callback) {
    var item = req.body;
    console.log('Getting guests for code: ' + JSON.stringify(item));
    connection.query("SELECT g.ID, g.Name, g.Surname, i.ID, i.Code FROM Guest g INNER JOIN invitation i ON g.InvitationID = i.ID WHERE i.Code = ?", item.code, function(err, results, fields) {
        // callback function returns employees array
        callback(results);

    });
}

exports.updateGuestWithRSVP = function(req, res) {
    var rspv = req.body;

    for(var i = 0; i <  rspv.user_id.length; i++)
    {
       var userId =  parseInt(rspv.user_id[i]);
       var diet =  rspv.text_diet[i];
       var attend =  rspv.dropd_attend[i] == "1" ?true:false ;
       console.log('Updating user: ' + userId + ' attend: ' + attend);
       connection.query("UPDATE Guest SET Present=?, Comment=? WHERE ID=?", [attend,diet,userId], function(err, result) {
            console.log(err);
       });
    }
}

//Gift Items



exports.addGiftItemsForGuest = function(req, res, callback) {
    var guests = req.session.guests;
    if(guests && guests.length > 0)
    {
        var item = req.body;

        var invitationId = guests[0].ID;
        var itemId = item.item_id;
        var quantity = item.Quantity;

        connection.query("INSERT INTO Gift_Items (`Gift_ID`, `Item_ID`, `Quantity`) VALUES ((SELECT ID FROM GIFT where Invitation_ID = ?), ?, ?)",[invitationId,itemId,quantity], function(err, result) {
            // callback function returns employees array
            callback(result);
        });
    }
}


exports.getGiftItemsForGuest = function(req, res, callback) {
    var guests = req.session.guests;
    var invitationId = guests[0].ID;
    connection.query("SELECT gi.Item_ID as id, g.Invitation_ID, i.Name, ROUND(i.Price * gi.quantity,2) as 'Price', gi.quantity , gi.Gift_ID " +
                     "FROM Gift_Items gi inner join Gift g on gi.Gift_ID= g.ID inner join Items i on gi.Item_ID= i.ID Where g.Invitation_ID = ?", invitationId, function(err, results, fields) {
        // callback function returns employees array
        callback(results);
    });
}





exports.updateGiftItemForGuest = function(req, res, callback) {
    var guests = req.session.guests;
    if(guests && guests.length > 0)
    {
        var item = req.body;
        var quantity = item.quantity;
        var invitationId = guests[0].ID;
        var itemId = req.params.id;
        connection.query("UPDATE Gift_Items SET QUANTITY = ? where Gift_ID = (SELECT ID FROM GIFT where Invitation_ID = ?) AND Item_ID = ?", [quantity,invitationId,itemId], function(err, result) {
            // callback function returns employees array
            console.log(JSON.stringify(err));
            callback(result);
        });
    }
}

exports.removeGiftItemForGuest = function(req, res, callback) {
    var guests = req.session.guests;
    if(guests && guests.length > 0)
    {
        var invitationId = guests[0].ID;
        var itemId = req.params.id;
        connection.query("DELETE FROM Gift_Items where Gift_ID = (SELECT ID FROM GIFT where Invitation_ID = ?) AND Item_ID = ?", [invitationId,itemId], function(err, result) {
            // callback function returns employees array
            callback(result);
        });
    }
}




