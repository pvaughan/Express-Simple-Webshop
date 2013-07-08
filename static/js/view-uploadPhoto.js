/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 5/1/13
 * Time: 8:24 PM
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function() {

    status('Choose a file :)');

    /*
    // Check to see when a user has selected a file
    var timerId;
    timerId = setInterval(function() {
        var val = $('#userPhotoInput').val();
        if( val !== '') {
            clearInterval(timerId);

            $('#uploadForm').submit();
        }
    }, 500);

    $(this).ajaxSubmit({

        error: function (xhr) {
            status('Error: ' + xhr.status);
        },

        success: function(response) {

            if(response.error) {
                status('Opps, something bad happened');
                return;
            }

            var imageUrlOnServer = response.path;

            status('Success, file uploaded to:' + imageUrlOnServer);
            $('#uploadedImage').attr('src', imageUrlOnServer);
        }
    });
    */

    function status(message) {
        $('#status').text(message);
    }



    function handler(resp) {
        if(this.readyState == this.DONE) {
            if(this.status == 200 )
                {
                console.log(resp.response);
                $('#uploadedImage').attr('src', resp.currentTarget.response);
                //processData(this.responseXML.getElementById('test').textContent);
                return;
            }
            // something went wrong
            processData(null);
        }
    }



    function uploadFiles(url, files, form) {
        var formData = new FormData();

        for (var i = 0, file; file = files[i]; ++i) {
            formData.append('userPhoto', file);
        }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onload = handler;

        xhr.send(formData);  // multipart/form-data
    }


    $('#userPhotoInput').live('change', function(){  uploadFiles('/api/photos', this.files); });


});