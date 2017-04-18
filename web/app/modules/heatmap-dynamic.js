
var heatmap;

function initGoogleMaps(){
}

setTimeout(function(){
    //do this after view has loaded :)
    console.log('success!');

     heatmap = h337.create({
        container: document.getElementById('map-container')
    });

    heatmap.setData({
        max: 5,
        data: [{ x: 10, y: 15, value: 5}]
    });
}, 5000);