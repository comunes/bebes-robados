/* global Template $ Session Router GoogleMaps google noUndef Persons isNew onSliderRender
 renderSexoAlt renderDate renderAprox renderNuevo calcShowAll isValidLatLng */

Template.home.helpers({
  mainMapOptions: function () {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(36.5270612, -6.2885962), // Cadiz
        // mapTypeId: google.maps.MapTypeId.SATELLITE,
        zoomControl: true,
        // Sin nombres ni carreteras
        // styles: [{ featureType: 'road', stylers: [  {visibility: 'on'} ] } ],
        styles: [{'featureType': 'all', 'elementType': 'all', 'stylers': [{'saturation': -100}, {'gamma': 0.5}]}],
        /* styles: [{'featureType':'landscape','stylers':[{'saturation':-100},{'lightness':65},{'visibility':'on'}]},{'featureType':'poi','stylers':[{'saturation':-100},{'lightness':51},{'visibility':'simplified'}]},{'featureType':'road.highway','stylers':[{'saturation':-100},{'visibility':'simplified'}]},{'featureType':'road.arterial','stylers':[{'saturation':-100},{'lightness':30},{'visibility':'on'}]},{'featureType':'road.local','stylers':[{'saturation':-100},{'lightness':40},{'visibility':'on'}]},{'featureType':'transit','stylers':[{'saturation':-100},{'visibility':'simplified'}]},{'featureType':'administrative.province','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':-25},{'saturation':-100}]},{'featureType':'water','elementType':'geometry','stylers':[{'hue':'#ffff00'},{'lightness':-25},{'saturation':-97}]}], */
        zoom: 5
        // Maybe:
        // https://stackoverflow.com/questions/9555499/apply-mask-to-google-map
      };
    }
  }
});

Template.home.events({
  'keypress #home-main-search': function (event) {
    if (event.which === 13) {
      event.preventDefault();
      var search = event.target.value;
      Session.set('main-home-search', search);
      Router.go('personsList');
    }
  },
  'submit form': function (event) {
    event.preventDefault();
  },
  'click .map-container': function (event) {
    // https://stackoverflow.com/questions/21992498/disable-mouse-scroll-wheel-zoom-on-embedded-google-maps
    $('div.map-container > div').css('pointer-events', 'auto');
  }
});

var markers = {};

var markerVisibility = function (person, min, max) {
  return min <= person.fechaNacimiento && person.fechaNacimiento <= max;
};

Template.home.onRendered(function () {
  $('#fullpage').fullpage({
    navigation: true,
    navigationPosition: 'right'
  });

  onSliderRender(function () {
    // TODO https://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-markers-visible-markers

    // repaint markers in some year
    var min = new Date(Session.get('minBornYear'), 0, 1);
    var max = new Date(Session.get('maxBornYear'), 11, 31);
    var showAll = calcShowAll();
    var keys = Object.keys(markers);
    for (var i = 0; i < keys.length; i++) {
      var id = keys[i];
      var marker = markers[id];
      if (noUndef(marker)) {
        if (showAll) {
          // show all markers
          marker.setVisible(true);
        } else {
          var person = Persons.find(id);
          if (person.count() === 1) {
            marker.setVisible(markerVisibility(person.fetch()[0], min, max));
          }
        }
      }
    }
  });
});

Template.home.onCreated(function () {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('mainMap', function (map) {
    // Add a marker to the map once it's ready
    var min = new Date(Session.get('minBornYear'), 0, 1);
    var max = new Date(Session.get('maxBornYear'), 11, 31);
    var showAll = calcShowAll();

    var infowindow = new google.maps.InfoWindow();
    var createMarker = function (map, person) {
      var lat = person.lugarNacimientoLatitud;
      var long = person.lugarNacimientoLongitud;
      if (isValidLatLng(lat) && isValidLatLng(long)) {
        // console.log('Adding new marker to map');
        var nuevo = isNew(person.updatedAt);
        // https://developers.google.com/maps/documentation/javascript/markers
        var image = {
          url: nuevo ? '/images/gmaps-pointer-new.png' : person.buscasBebe ? '/images/gmaps-pointer.png' : '/images/gmaps-pointer-familia.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(29, 50),
          // The origin for this image is (0, 0).
          scaledSize: new google.maps.Size(29, 50),
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(14, 50)
        };
        var moreInfo = 'Pulsa para más info';
        var marker = new google.maps.Marker({
          map: map.instance,
          // https://developers.google.com/maps/documentation/javascript/examples/map-latlng-literal
          icon: image,
          title: moreInfo,
          position: {lat: parseFloat(lat), lng: parseFloat(long)}
        });
        marker.setVisible(showAll ? true : markerVisibility(person, min, max));
        markers[person._id] = marker;

        // https://stackoverflow.com/questions/3059044/google-maps-js-api-v3-simple-multiple-marker-example
        google.maps.event.addListener(marker, 'click', (function (marker, person) {
          return function () {
            infowindow.setContent('<span style="font-size: 14px">' +
                                  (person.buscasBebe ? 'Buscamos bebe' : 'Busco a mi familia biológica') + ',<br>' +
                                  '<a title="' + moreInfo +
                                  '" href="/bebe/' + person.slug + '/">' + renderSexoAlt(person.sexo) +
                                  (person.fechaNacimiento instanceof Date ? (person.buscasBebe ? ' nacido aquí el '
                                                                             : ' nací aquí el ') : ' nacido aquí ') +
                                  renderAprox(person.fechaNacimientoEsAprox) + renderDate(person.fechaNacimiento) + ' ' +
                                  renderNuevo(person.updatedAt) + '</a></span>');
            infowindow.open(map.instance, marker);
          };
        })(marker, person));
      }
    };

    Persons.find().observe({
      // http://meteorcapture.com/how-to-create-a-reactive-google-map/
      added: function (document) {
        // console.log('Added new marker');
        createMarker(map, document);
      },
      changed: function (newDocument, oldDocument) {
        // console.log('Changed marker');
        var oldMarker = markers[newDocument._id];
        if (typeof oldMarker !== 'undefined') {
          oldMarker.setPosition({ lat: parseFloat(newDocument.lugarNacimientoLatitud),
                                  lng: parseFloat(newDocument.lugarNacimientoLongitud) });
        } else {
          createMarker(map, newDocument);
        }
      },
      removed: function (oldDocument) {
        var oldMarker = markers[oldDocument._id];
        if (typeof oldMarker !== 'undefined') {
          oldMarker.setMap(null);
          google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
          delete markers[oldDocument._id];
        }
      }
    });
  });
});
