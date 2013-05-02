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
    connection.query("select * from Items", function(err, results, fields) {
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


exports.getGuestWithCode = function(req, res, callback) {
    var item = req.body;
    console.log('Getting guests for code: ' + JSON.stringify(item));
    connection.query("SELECT g.ID, g.Name, g.Surname, i.Code FROM Guest g INNER JOIN invitation i ON g.InvitationID = i.ID WHERE i.Code = ?", item.code, function(err, results, fields) {
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




