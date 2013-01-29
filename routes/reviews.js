/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 1/29/13
 * Time: 6:19 PM
 * To change this template use File | Settings | File Templates.
 */

exports.reviews = function(req, res){
    res.render('reviews.jade', {
        locals : {
            title : 'Node App - Reviews'
            ,description: 'Your Page Description'
            ,author: 'Paul Vaughan'
            ,analyticssiteid: 'UA-38061682-1'
        }
    });
};