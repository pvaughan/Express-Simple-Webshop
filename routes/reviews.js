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
            title : 'Huwelijks Cadeau - Items'
            ,description: 'Your Page Description'
            ,author: 'Paul Vaughan'
            ,page: 'gift'
            ,analyticssiteid: 'UA-38061682-1'
        }
    });
};


exports.photoUpload = function(req, res){
    res.render('photoUpload.jade', {
        locals : {
            title : 'Photo upload'
            ,description: 'Your Page Description'
            ,author: 'Paul Vaughan'
            ,page: 'photo'
            ,analyticssiteid: 'UA-38061682-1'
        }
    });
};