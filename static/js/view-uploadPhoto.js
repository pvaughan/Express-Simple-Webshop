/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 5/1/13
 * Time: 8:24 PM
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function() {

    status('Choose a file :)');

    // Check to see when a user has selected a file
    var timerId;
    timerId = setInterval(function() {
        if( $('#userPhotoInput').val() !== '') {
            clearInterval(timerId);

            $('#uploadForm').submit();
        }
    }, 500);

    $(this).ajaxSubmit({

        error: function(xhr) {
            status('Error: ' + xhr.status);
        },

        success: function(response) {

            if(response.error) {
                status('Opps, something bad happened');
                return;
            }

            var imageUrlOnServer = response.path;

            status('Success, file uploaded to:' + imageUrlOnServer);
            $('<img/>').attr('src', imageUrlOnServer).appendTo($('body'));
        }
    });

    function status(message) {
        $('#status').text(message);
    }
});