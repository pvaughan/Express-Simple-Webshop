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


var connectionState = false;
var connection;

/*
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
*/


function attemptConnection() {
    if (!connectionState) {
        connection = null;

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
        connectionState = true;

        connection.on('close', function (err) {
            console.log('mysqldb conn closed after recconnect' + err);
            connectionState = false;
        });

        connection.on('error', function (err) {
            console.log('mysqldb error in reconnect: ' + err);

            if (!err.fatal) {
                //throw err;
            }
            if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
                //throw err;
            } else {
                connectionState = false;
            }

        });
    }
}

attemptConnection();

var dbConnChecker = setInterval(function(){
    if(!connectionState){
        console.log('not connected, attempting reconnect');
        attemptConnection();
    }
}, 30000);


exports.getItems = function (callback) {
    connection.query("select Items.ID as id, Items.Name, Items.Description,Items.ImageData, Items.Price,  Items.NrInStock, " +
        "totalOrderd.totalOrdered, " +
        "CASE WHEN totalOrderd.totalOrdered > 0 THEN (Items.NrInStock - totalOrderd.totalOrdered) ELSE Items.NrInStock END as remainingStock " +
        "from Items  left outer join (select Item_ID, sum(Quantity) as totalOrdered FROM Gift_Items group by Item_ID) totalOrderd " +
        "ON Items.ID = totalOrderd.Item_ID order by Items.Name", function (err, results, fields) {
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





exports.activateCode = function(req, res, callback) {
    var item = req.body;
    console.log('Activating code: ' + JSON.stringify(item));
    connection.query("Update invitation set Activated = 1  WHERE Code = ?", item.code, function(err, results) {
        callback(err);
  });
}


exports.getGuestWithCode = function(req, res, callback) {
    var item = req.body;
    console.log('Getting guests for code: ' + JSON.stringify(item));
    connection.query("SELECT g.ID, g.Name, g.Surname, i.ID as InviteID, i.Code FROM Guest g INNER JOIN invitation i ON g.InvitationID = i.ID WHERE i.Code = ?", item.code, function(err, results, fields) {
        console.log('SQL guest error:' + JSON.stringify(err));
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
       console.log('Updating user: ' + userId + ' attend: ' + attend + ' diet: ' + diet );
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
        console.log('GiftItem for user:' + JSON.stringify(item));

        var invitationId = guests[0].InviteID;
        var itemId = item.item_id;
        var quantity = item.Quantity;
        checkInventoryForItem(itemId, function (result) {
            if (result[0].remainingStock > 0) {
                connection.query("INSERT INTO Gift_Items (`Gift_ID`, `Item_ID`, `Quantity`) VALUES ((SELECT ID FROM Gift where Invitation_ID = ?), ?, ?)", [invitationId, itemId, quantity], function (err, result) {
                    // callback function returns employees array
                    console.log('GiftItem error:' + JSON.stringify(err));
                    callback(result);
                });
            } else {
                callback(null);
            }
        });
    }
}


exports.getGiftItemsForGuest = function(req, res, callback) {
    var guests = req.session.guests;
    var invitationId = guests[0].InviteID;
    connection.query("SELECT gi.Item_ID as id, g.Invitation_ID, i.Name, ROUND(i.Price * gi.quantity,2) as 'Price', gi.quantity , gi.Gift_ID " +
                     "FROM Gift_Items gi inner join Gift g on gi.Gift_ID= g.ID inner join Items i on gi.Item_ID= i.ID Where g.Invitation_ID = ?", invitationId, function(err, results, fields) {
        // callback function returns employees array
        callback(results);
    });
}

function checkInventoryForItem(itemId, callback) {
    connection.query("select Items.ID as id, CASE WHEN orderdItems.totalOrdered > 0 THEN (Items.NrInStock - orderdItems.totalOrdered) ELSE Items.NrInStock END as remainingStock " +
        "from Items  left outer join " +
        "(select Item_ID, sum(Quantity) as totalOrdered FROM Gift_Items group by Item_ID) orderdItems ON Items.ID = orderdItems.Item_ID where id =?", itemId,function(err, result) {
        callback(result);
    });
}

exports.updateGiftItemForGuest = function(req, res, callback) {
    var guests = req.session.guests;
    if(guests && guests.length > 0)
    {
        var item = req.body;
        var quantity = item.quantity;
        var invitationId = guests[0].InviteID;
        var itemId = req.params.id;

        checkInventoryForItem(itemId, function(result) {
            if (result[0].remainingStock > 0) {
                connection.query("UPDATE Gift_Items SET QUANTITY = ? where Gift_ID = (SELECT ID FROM Gift where Invitation_ID = ?) AND Item_ID = ?", [quantity, invitationId, itemId], function (err, result) {
                    // callback function returns employees array
                    console.log(JSON.stringify(err));
                    callback(result);
                });
            } else {
                callback(null);
            }
        });
    }
}

exports.removeGiftItemForGuest = function(req, res, callback) {
    var guests = req.session.guests;
    if(guests && guests.length > 0)
    {
        var invitationId = guests[0].InviteID;
        var itemId = req.params.id;
        connection.query("DELETE FROM Gift_Items where Gift_ID = (SELECT ID FROM Gift where Invitation_ID = ?) AND Item_ID = ?", [invitationId,itemId], function(err, result) {
            // callback function returns employees array
            callback(result);
        });
    }
}


exports.finaliseGiftForGuest = function(req, res, callback) {
    var guests = req.session.guests;
    if(guests && guests.length > 0)
    {
        var invitationId = guests[0].InviteID;
        var itemId = req.params.id;
        connection.query("UPDATE Gift SET Committed=1 WHERE Invitation_ID=? ", [invitationId], function(err, result) {
            // callback function returns employees array
            callback(result);
        });
    }
}



exports.checkGiftFinalisedForGuest = function(req, res, callback) {
    var guests = req.session.guests;
    if(guests && guests.length > 0)
    {
        var invitationId = guests[0].InviteID;
        var itemId = req.params.id;
        connection.query("Select Committed from Gift WHERE Invitation_ID=? ", [invitationId], function(err, result) {
            // callback function returns employees array
            var committed = false;
            if(result.length >0 )
            {
                committed=result[0].Committed[0];
            }
            callback(committed);
        });
    }
}

exports.saveWishAndPhoto = function(invitationId,wish,photo, callback) {
    connection.query("UPDATE Gift SET Message=?, Media=? WHERE Invitation_ID=?", [wish,photo,invitationId], function(err, result) {
        // callback function returns employees array
        callback();
    });
}





