/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 4/13/13
 * Time: 2:28 PM
 * To change this template use File | Settings | File Templates.
 */

exports.rsvp = function (req, res) {
    var  needToIncludeLayout = !req.xhr;

    var templateName = needToIncludeLayout ?  "rsvp.jade" : "rsvp-partial.jade";

    res.render(templateName, {
        locals : {
             title : 'RSVP'
            ,description: 'Sven en laura gaan trouwen'
            ,author: 'Paul Vaughan'
            ,page: 'gift'
            ,analyticssiteid: 'UA-38061682-1'
        }
    });
};
