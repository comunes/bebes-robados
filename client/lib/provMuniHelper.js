import provinces from '/imports/lib/provincias/provinciasJson.js'
import municipes from '/imports/lib/provincias/municipiosJson.js'

municipio = function (cod_id) {
  var name;
  $.each(municipes, function(number, municipe) {
    if (municipe.id === parseInt(cod_id)) {
      name = municipe.name;
      return false;
    }
  });
  return name;
}

provincia = function (prov) {
  var name;
  $.each(provinces, function(number, province) {
    if (province.code === prov) {
      name = province.name;
      return false;
    }
  });
  return name;
}

renderProvincias = function(prevProv, prevMuni, onProvSelect, onMuniSelect, defProvText, defMuniText) {
  var provinceCssSelector = '.ps-prov';
  var municipeCssSelector = '.ps-mun';
  var provinceDefaultText = defProvText || 'Provincia';
  var municipeDefaultText = defMuniText || 'Municipio';

  function changeMuni(selectedProvince) {
    $(municipeCssSelector).empty();
    $(municipeCssSelector).append($('<option>').text(municipeDefaultText).attr('value', -1));
    $.each(municipes, function(number, municipe) {
      if (municipe.cod_prov === selectedProvince) {
        $(municipeCssSelector).append($('<option>').text(municipe.name).attr('value', number.toString()));
      }
    });
  }

  // Set default text
  $(provinceCssSelector).append($('<option>').text(provinceDefaultText).attr('value', -1));
  $(municipeCssSelector).append($('<option>').text(municipeDefaultText).attr('value', -1));

  // Populate province select
  $.each(provinces, function(number, province) {
    $(provinceCssSelector).append($('<option>').text(province.name).attr('value', province.code));
  });

  // When selected province changes, populate municipe select
  $(provinceCssSelector).change(function() {
    // console.log("Provincia cambiada");
    var prov = this.value;
    changeMuni(prov);
    // Clear muni
    onProvSelect(prov);
  });

  $(municipeCssSelector).change(function() {
    // console.log("Municipio cambiado");
    var muni = this.value;
    onMuniSelect(muni);
  });

  // Restore values on update
  if (!isNaN(prevProv) && prevProv >= 0) {
    $(provinceCssSelector).val(prevProv);
    changeMuni(prevProv);
  }
  if (!isNaN(prevMuni) && prevMuni >= 0) {
    $(municipeCssSelector).val(prevMuni);
  }

};
