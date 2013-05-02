/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 4/13/13
 * Time: 3:17 PM
 * To change this template use File | Settings | File Templates.
 */


function initialize() {
    var myLatlng =new google.maps.LatLng(51.918931, 4.48225);
    var mapOptions = {
        zoom: 13,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };



    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    // To add the marker to the map, call setMap();
    var marker = new google.maps.Marker({
        position: myLatlng,
        title:"Schielandhuis"
    });
    marker.setMap(map);
}


function loadScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyA8dW1Hy_qunSQUEf6eAAeDx68WUvNc-4Q&sensor=true&callback=initialize";
    document.body.appendChild(script);
}

$(document).ready(function() {
    // do stuff when DOM is ready
    loadScript();
});