/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index.jade', {
    locals : {
        title : 'Sven en Laura'
        ,description: 'Sven en laura gaan trouwen whoohooo!!'
        ,page: 'home'
        ,author: 'Paul Vaughan'
        ,analyticssiteid: 'UA-38061682-1'
    }
   });
};

exports.redirect = function(req, res){

    res.render('redirect.jade', {
        locals : {
            title : 'Sven en Laura'
            ,description: 'Sven en laura gaan trouwen whoohooo!!'
            ,page: 'home'
            ,author: 'Paul Vaughan'
            ,analyticssiteid: 'UA-38061682-1'
        }
    });
};

