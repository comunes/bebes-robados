/* global GoogleMaps,google,geocode:true,provincia,municipio,Template, alertMessage, success, Roles
 resetMarker:true, Meteor, Router, $ ReactiveVar AutoForm renderProvincias _ AutoForm TAPi18n */

import {noUndef} from '/imports/lib/functions.js';

var toDelete = new ReactiveVar();

Template.bebeForm.helpers({
  noValidado: function () { return this.doc && !this.doc.validated; },
  pdteModeracion: function () { return this.doc.validated ? '' : TAPi18n.__('Caso pendiente de moderación'); },
  publicar: function () { return this.doc.validated ? TAPi18n.__('No publicar') : TAPi18n.__('Publicar'); },
  isAddingAdminIsFamiliar: function () {
    return this.type === 'insert' || Roles.userIsInRole(Meteor.userId(), ['admin']) || Meteor.userId() === this.doc.familiar;
  },
  isFamiliarOrAdmin: function () {
    return Roles.userIsInRole(Meteor.userId(), ['admin']) || Meteor.userId() === this.doc.familiar;
  },
  buscasBebe: function () {
    var value = AutoForm.getFieldValue('buscasBebe');
    // console.log('buscas bebe: ' + value);
    // Si no definido devolvemos el valor por defecto
    return typeof value === 'undefined' ? true : value;
  },
  isFamiliar: function () {
    return Meteor.userId() === this.familiar;
  },
  isEqual: function (type, otherType) {
    return type === otherType;
  },
  defaultFalse: function () {
    return false;
  },
  defaultTrue: function () {
    return true;
  },
  onError: function () {
    return function (error) {
      alertMessage('Error al borrar');
      console.log(error);
    };
  },
  onSuccess: function () {
    return function (result) {
      success('Borrado');
    };
  },
  beforeRemove: function () {
    return function (collection, id) {
      toDelete.set(this);
      $('#delete-babe').confirmation('show');
    };
  },
  fotos: function () {
    return (this).photos;
  },
  attachs: function () {
    return (this).attachs;
  },
  tieneFotos: function () {
    var files = (this).photos;
    return _.isArray(files) && files.length > 0;
  },
  tieneAttachs: function () {
    var files = (this).attachs;
    return _.isArray(files) && files.length > 0;
  },
  mapOptions: function () {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(36.5270612, -6.2885962), // Cadiz
        zoom: 4
      };
    }
  }
});

Template.bebeForm.onCreated(function () {
  AutoForm.resetForm('editaBebeForm');
  AutoForm.resetForm('nuevoBebeForm');
  GoogleMaps.ready('lugarNacimientoMap', function (map) {
    resetMarker();
    geocode();
  });
  GoogleMaps.ready('cementerioEnterradoMap', function (map) {
  });
});

var nacimientoMarker;

resetMarker = function () {
  if (noUndef(nacimientoMarker)) {
    nacimientoMarker.setMap(null);
  }
};

var resizeCementerioMap = function () {
  var map = $('#cementerioEnterradoDireccion').geocomplete('map');
  // var center = map.getCenter();
  google.maps.event.trigger(map, 'resize');
  // map.setCenter(center);
};

geocode = function () {
  // console.log('Trying to geocode');
  var lugar = $('#lugarNacimiento').val();
  var lugarDire = $('#lugarNacimientoDireccion').val();
  var lugarProv = $('#lugarNacimientoProvinciaNombre').val();
  var lugarMuni = $('#lugarNacimientoMunicipioNombre').val();
  var lugarPais = $('#lugarNacimientoPais').val();

  var lat = '';
  var long = '';
  if (!google) {
    // Not yet ready
    return;
  }
  var geocoder = new google.maps.Geocoder();
  var direccion = ((typeof lugar === 'string' ? lugar : '') + ' ' +
                  (typeof lugarDire === 'string' ? lugarDire : '') + ' ' +
                   lugarMuni + ' ' + lugarProv + ' ' + lugarPais).trim();
  // Delete marker if exists
  resetMarker();
  if (direccion.length > 0) {
    var map = GoogleMaps.maps.lugarNacimientoMap.instance;
    // console.log('Buscando ' + direccion);
    geocoder.geocode({'address': direccion}, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        // console.log(results[0].geometry.location.lat());
        lat = results[0].geometry.location.lat().toString();
        long = results[0].geometry.location.lng().toString();
        // console.log('Geocode was successful');
        var newMarker = new google.maps.Marker({
          position: { lat: results[0].geometry.location.lat(),
                      lng: results[0].geometry.location.lng() },
          map: map
        });
        nacimientoMarker = newMarker;
        map.setCenter(newMarker.getPosition());
        map.setZoom(11);
      } else {
        map.setZoom(4);
        console.log(
          'Geocode was not successful for the following reason: ' + status);
      }
      $('#lugarNacimientoLatitud').val(lat);
      $('#lugarNacimientoLongitud').val(long);
    });
  } else {
    $('#lugarNacimientoLatitud').val('');
    $('#lugarNacimientoLongitud').val('');
  }
};

Template.bebeForm.events({
  'shown.bs.tab a[href="#fallecimiento"]': function (e) {
    // console.log('Fallecimiento show');
    $('#cementerioEnterradoDireccion').trigger('geocode');
    resizeCementerioMap();
  },
  'keydown form input': function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      console.log('Pressed enter');
      return false;
    }
  }
});

Template.bebePage.events({
  'blur #lugarNacimiento': function (event, template) {
    geocode(event, template);
  },
  'blur #lugarNacimientoDireccion': function (event, template) {
    geocode(event, template);
  }
});

Template.nuevoBebe.events({
  'blur #lugarNacimiento': function (event, template) {
    geocode(event, template);
  },
  'blur #lugarNacimientoDireccion': function (event, template) {
    geocode(event, template);
  }
});

Template.bebeForm.onRendered(function () {
  // listenToTabChange();

  this.autorun(function () {
    if (GoogleMaps.loaded()) {
      $('#cementerioEnterradoDireccion').geocomplete({
        map: '#cementerioEnterradoMap'
      });
    }
  });

  $('#delete-bebe').confirmation({
    title: TAPi18n.__('¿Estás seguro?'),
    btnOkLabel: TAPi18n.__('Borrar'),
    btnCancelLabel: TAPi18n.__('No'),
    placement: 'top',
    onConfirm: function () {
      Router.go('personsList');
      toDelete.get().remove();
    }
  });

  // Render provincias
  var provinceName = '#lugarNacimientoProvinciaNombre';
  var municipeName = '#lugarNacimientoMunicipioNombre';

  var onProvSelect = function (prov) {
    // console.log('Prov select ' + prov + ' ' + typeof prov);
    $(municipeName).val('');
    if (!isNaN(prov) && prov >= 0) {
      $(provinceName).val(provincia(prov));
    } else {
      $(provinceName).val('');
    }
    geocode();
  };

  var onMuniSelect = function (muni) {
    if (!isNaN(muni) && muni >= 0) {
      var muniName = municipio(muni);
      // console.log('Muni select de ' + muni + ': ' +  muniName + ' ' + typeof muni);
      $(municipeName).val(muniName);
    } else {
      $(municipeName).val('');
    }
    geocode();
  };

  var prevProv;
  var prevMuni;

  if (typeof this.data !== 'undefined' &&
    typeof this.data.doc !== 'undefined' && this.data.doc !== null) {
    prevProv = this.data.doc.lugarNacimientoProvincia;
    prevMuni = this.data.doc.lugarNacimientoMunicipio;
  }

  renderProvincias(prevProv, prevMuni, onProvSelect, onMuniSelect);
  // Fin render provincias
});
