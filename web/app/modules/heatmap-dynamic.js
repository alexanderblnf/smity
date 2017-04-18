
var heatmap;

function initGoogleMaps(){

}

setTimeout(function(){
    /*
    console.log('success!');

     heatmap = h337.create({
        container: document.getElementById('map-container')
    });

    heatmap.setData({
        max: 5,
        data: [{ x: 10, y: 15, value: 5}]
    });
*/
    map = new google.maps.Map(document.getElementById('map-container'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });

    heatmap = h337.create({
        container: document.getElementById('map-container')
    });

    heatmap.setData({
        max: 5,
        data: [{ x: 10, y: 15, value: 5}]
    });

}, 5000);