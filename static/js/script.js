/* Author: YOUR NAME HERE
*/
$.fn.serializeObject = function () {
    var o = {},
        a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


bootstrap_alert = function() {}
bootstrap_alert.warning = function(message) {
    $('#alert_placeholder').html('<div class="alert"><a class="close" data-dismiss="alert">×</a><span><strong>Ahhh snap! </strong> '+message+'</span></div>')
}


$(document).ready(function () {
    /*
    var socket = io.connect();
    $('#sender').bind('click', function() {
        socket.emit('message', 'Message Sent on ' + new Date());
}   );

    socket.on('server_message', function(data){
        $('#receiver').append('<li>' + data + '</li>');
    });
    */
    $.ajaxSetup({ cache: false });



    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
        var viewportmeta = document.querySelector('meta[name="viewport"]');
        if (viewportmeta) {
            viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
            document.body.addEventListener('gesturestart', function () {
                viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
            }, false);
        }
    }

});