/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 5/1/13
 * Time: 8:24 PM
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function() {


    $("#progress").hide();
    $("#resultRow").hide();

    function status(message) {
        $('#status').text(message);
    }

    function handler(resp) {
        if (this.readyState == this.DONE) {
            if (this.status == 200) {

                var data = jQuery.parseJSON(resp.currentTarget.response);

                console.log(resp.response);
                $("#progress").hide();
                $('#uploadedImage').attr('src', data[0]);
                $('#uploadedText').text(data[1]);
                $("#resultRow").show();
                return false;
            }

        }
    }

    function getExtension(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }

    function isImage(filename) {
        var ext = getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'gif':
            case 'bmp':
            case 'png':
                //etc
                return true;
        }
        return false;
    }


    function uploadFiles() {
        var formData = new FormData();
        var wish = $("#txtWish").val();
        var input = document.getElementById('userPhotoInput');
        var files = input.files;

        var valid = false;

        for (var i = 0, file; file = files[i]; ++i) {
            if(isImage(file.name))
            {
                formData.append('userPhoto', file);
                valid = true;
            }else
            {
                valid = false;
            }
        }
        formData.append('wish', wish);

        if(valid)
        {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/photos', true);
            xhr.onload = handler;

            xhr.send(formData);  // multipart/form-data
            $("#uploadForm").hide();
            $("#progress").show();
        }
    }

    $('#btnUploadPhoto').click(function(e){
        e.preventDefault();
        uploadFiles();
    });

});