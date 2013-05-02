/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 4/13/13
 * Time: 2:28 PM
 * To change this template use File | Settings | File Templates.
 */
exports.info = function(req, res){
    res.render('info.jade', {
        locals : {
            title : 'Het Schielandhuis'
            ,description: 'Sven en laura gaan trouwen'
            ,author: 'Paul Vaughan'
            ,page: 'info'
            ,analyticssiteid: 'UA-38061682-1'
        }
    });
};