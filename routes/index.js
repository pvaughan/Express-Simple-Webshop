/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.jade', {
    locals : {
        title : 'Your Page Title'
        ,description: 'Your Page Description'
        ,author: 'Paul Vaughan'
        ,analyticssiteid: 'UA-38061682-1'
    }
   });
};