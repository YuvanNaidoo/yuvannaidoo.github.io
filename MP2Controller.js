var locationButtons = [];

//FROM api
var allLocations = [];

function CreateButtons (parentName)
{
  for (var i = 0; i < allLocations.length; i ++)
  {
    var parentDiv = document.getElementById(parentName);
    var newButton = document.createElement('button');
    newButton.id = 'locationButton' + i;
    newButton.textContent = allLocations[i].name;
    newButton.style.position = 'absolute';
    newButton.style.width = 100 + '%';
    newButton.style.height = 15 + '%';
    newButton.style.top = (i * 15) + '%';
    newButton.style.left = 0 + '%';
    newButton.style.opacity = 1;
    newButton.className = "LocationButton";
    newButton.customAttr = i;
    locationButtons[i] = newButton;
    parentDiv.appendChild(newButton);

    //Populate Object Data
    populateAceData(i);
    populateWeatherData(i);

    //I don't understand this piece of code
    //It was taken from: http://stackoverflow.com/questions/8801787/get-index-of-clicked-element-using-pure-javascript
    var p = document.getElementById('allLocationButtons');
    (function(index){
      p.children[i].onclick = function(){
        currentIndex = index;
        initialize();
        ShowLocation(index);
      }
    })(i)//taken from: http://stackoverflow.com/questions/8801787/get-index-of-clicked-element-using-pure-javascript

  }
}

function ShowLocation (locationIndex)
{
  var lA = allLocations[locationIndex];
  var lHT = document.getElementById('LocationHeadingText');
  var lT = document.getElementById('LocationText');
  var lAce = document.getElementById('ACEText');
  var lW = document.getElementById('WeatherText');
  var lS = document.getElementById('SunText');

  var lHText = "<b>" + lA.description + "</b>";
  var lText = "<b>Location Data</b>";
  lText += "<br>Country : " +  lA.country;
  lText += "<br>Latitude : " + lA.lat;
  lText += "<br>Longitude : " + lA.long;

  var aText = "<b>" +  "ACE DATA" + "</b>";
  aText += "<br>Probability of seeing Aurora : " + lA.aceData.value;

  var wText = "<b>" +  "Weather Data" + "</b>";
  wText += "<br>Temperature(celcius) : " + lA.weather.temperature;
  wText += "<br>Cloud Cover(%) : " + lA.weather.cloud;
  wText += "<br>Rain(%) : " + lA.weather.rain;
  wText += "<br>Humidity(%) : " + lA.weather.humidity;
  wText += "<br>Wind : " + lA.weather.wind.speed + " (km/h) " + lA.weather.wind.direction;

  var sText = "<b>" +  "Sun and Moon Phases" + "</b>";
  sText += "<br>Sunrise : " + lA.weather.sunrise;
  sText += "<br>Sunset : " + lA.weather.sunset;
  sText += "<br>Moonrise : " + lA.weather.moonrise;
  sText += "<br>Moonset : " + lA.weather.moonset;
  sText += "<br>Moon Phase : " + lA.weather.moonphase;

  lHT.innerHTML = lHText;
  lT.innerHTML = lText;
  lAce.innerHTML = aText;
  lW.innerHTML = wText;
  lS.innerHTML = sText;
  ChangeImage(locationIndex);
  //LocationHeadingText
}

function callAPI ()
{
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://api.auroras.live/v1/?type=locations&format=jsonp", true);
  xhttp.send();
  xhttp.onreadystatechange = function()
  {
    if (xhttp.readyState == 4 && xhttp.status == 200)
    {
      var rawText = xhttp.responseText;
      var jText = rawText.replace("aurorasLive(", "");
      jText = jText.replace("}])", "}]");
      allLocations = JSON.parse(jText);
    }
     CreateButtons('allLocationButtons');
  }
}

function populateAceData (index)
{
  var aD = new XMLHttpRequest();
  var loc = allLocations[index];
  aD.open("GET", "https://api.auroras.live/v1/?type=ace&lat=" + loc.lat + "&long=" + loc.long + "&data=probability", true);
  aD.send();
  aD.onreadystatechange = function()
  {
    if (aD.readyState == 4 && aD.status == 200)
    {
      var rawText = aD.responseText;
      var rawText = rawText.replace("aurorasLive(", "");
      var rawText = rawText.replace("})", "}");
      allLocations[index].aceData = JSON.parse(rawText);
    }
  }
}

function populateWeatherData (index)
{
  var w = new XMLHttpRequest();
  var loc = allLocations[index];
  w.open("GET", "https://api.auroras.live/v1/?type=weather&lat=" + loc.lat + "&long=" + loc.long + "&format=jsonp", true);
  w.send();
  w.onreadystatechange = function()
  {
    if (w.readyState == 4 && w.status == 200)
    {
      var rawText = w.responseText;
      var rawText = rawText.replace("aurorasLive(", "");
      var rawText = rawText.replace("})", "}");
      allLocations[index].weather = JSON.parse(rawText);
    }
  }
}

var allImages;
function PopulateImageData ()
{
  var u = new XMLHttpRequest();
  u.open("GET", "https://api.auroras.live/v1/?type=images&action=list&format=jsonp", true);
  u.send();
  u.onreadystatechange = function()
  {
    if (u.readyState == 4 && u.status == 200)
    {
      var rawText = u.responseText;
      rawText = rawText.replace("aurorasLive(", "");
      rawText = rawText.replace("})", "}");
      allImages = JSON.parse(rawText);
    }
  }
}

function ChangeImage (index)
{
  var locID = allLocations[index].id;
  if (allImages.images[locID] != null)
  {
    var im = allImages.images[locID];
    var newPath = im.url;
    var imHolder = document.getElementById('locImage');
    imHolder.src = newPath;
  } else {
    console.log(allLocations[index].id + ": No Image");
  }
}

//////////////////////////////////////////////////////CODE FROM TEGAN
//UV
var currentIndex = 0;
//UV

var map;

var MY_MAPTYPE_ID = 'custom_style';

function initialize() {

  //Custom JSON Code for Map Style, UV
    var featureOpts = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#5684ff"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#5adbff"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#6277b1"
      }
    ]
  },
  {
    "featureType": "transit.station.airport",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#a5ffa2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
];
//UV
  var mapOptions = {
    zoom: 2,
    //UV
    center: new google.maps.LatLng(allLocations[currentIndex].lat, allLocations[currentIndex].long),
    //UV
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    },
    mapTypeId:MY_MAPTYPE_ID
  };

  map = new google.maps.Map(document.getElementById('googleMap'),
      mapOptions);

      //From Google
      var marker = new google.maps.Marker({
              position: new google.maps.LatLng(allLocations[currentIndex].lat, allLocations[currentIndex].long),
              map: map,
              title: 'Hunting Location!',
              animation: google.maps.Animation.DROP,
            });
      marker.addListener('click', toggleBounce);
      //From Google

  var styledMapOptions = {
    name: 'Aurora Hunter'
  };

  //From Google
  function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
  //From Google
  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

  map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
}

//Using own api Key
function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBcctC9-Uc2uGUQRG5qY7z8AHo1geNouTY&callback=initialize";
  document.body.appendChild(script);
}

window.onload = loadScript;
