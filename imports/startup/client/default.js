/* global Meteor Bert GoogleMaps $ moment */

import '/imports/lib/mainRoutes.js';

Meteor.startup(function () {
  // https://eternicode.github.io/bootstrap-datepicker/
  $.fn.datepicker.defaults.format = {
    // https://bootstrap-datepicker.readthedocs.io/en/stable/options.html#format
    toDisplay: function (date, format, language) {
      return moment(date).format('d/MM/YYYY');
    },
    toValue: function (date, format, language) {
      return moment(date, ['dd-mm-yy', 'mm-yy', 'dd-MM-yy', 'MM-yy',
                           'dd-mm-yyyy', 'mm-yyyy', 'dd-MM-yyyy', 'MM-yyyy',
                           'dd/mm/yy', 'mm/yy', 'dd/MM/yy', 'MM/yy',
                           'dd/mm/yyyy', 'mm/yyyy', 'dd/MM/yyyy', 'MM/yyyy'
                          ]).toDate();
    }
  };
  $.fn.datepicker.defaults.language = 'es';
  $.fn.datepicker.defaults.autoclose = true;
  $.fn.datepicker.defaults.clearBtn = true;
  $.fn.datepicker.defaults.orientation = 'bottom auto';

  // https://github.com/uxsolutions/bootstrap-datepicker/tree/master/js/locales
  $.fn.datepicker.dates['es'] = {
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    today: 'Hoy', clear: 'Borrar', weekStart: 1, format: 'd/MM/yyyy'};
  /**
   * Catalan translation for bootstrap-datepicker
   * J. Garcia <jogaco.en@gmail.com>
   */
  $.fn.datepicker.dates['ca'] = {
    days: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"],
    daysShort: ["Diu",  "Dil", "Dmt", "Dmc", "Dij", "Div", "Dis"],
    daysMin: ["dg", "dl", "dt", "dc", "dj", "dv", "ds"],
    months: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
    monthsShort: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"],
    today: "Avui", monthsTitle: "Mesos", clear: "Esborrar", weekStart: 1, format: "dd/mm/yyyy"};
  $.fn.datepicker.dates['gl'] = {
    days: ["Domingo", "Luns", "Martes", "Mércores", "Xoves", "Venres", "Sábado"],
    daysShort: ["Dom", "Lun", "Mar", "Mér", "Xov", "Ven", "Sáb"],
    daysMin: ["Do", "Lu", "Ma", "Me", "Xo", "Ve", "Sa"],
    months: ["Xaneiro", "Febreiro", "Marzo", "Abril", "Maio", "Xuño", "Xullo", "Agosto", "Setembro", "Outubro", "Novembro", "Decembro"],
    monthsShort: ["Xan", "Feb", "Mar", "Abr", "Mai", "Xun", "Xul", "Ago", "Sep", "Out", "Nov", "Dec"],
    today: "Hoxe", clear: "Limpar", weekStart: 1, format: "dd/mm/yyyy" };
  /**
   * French translation for bootstrap-datepicker
   * Nico Mollet <nico.mollet@gmail.com>
   */
  $.fn.datepicker.dates['fr'] = {
    days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    daysShort: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
    daysMin: ["d", "l", "ma", "me", "j", "v", "s"],
    months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    monthsShort: ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
    today: "Aujourd'hui", monthsTitle: "Mois", clear: "Effacer", weekStart: 1, format: "dd/mm/yyyy" };
  /**
   * Basque translation for bootstrap-datepicker
   * Arkaitz Etxeberria <kondi80@gmail.com>
   */
  $.fn.datepicker.dates['eu'] = {
    days: ['Igandea', 'Astelehena', 'Asteartea', 'Asteazkena', 'Osteguna', 'Ostirala', 'Larunbata'],
    daysShort: ['Ig', 'Al', 'Ar', 'Az', 'Og', 'Ol', 'Lr'],
    daysMin: ['Ig', 'Al', 'Ar', 'Az', 'Og', 'Ol', 'Lr'],
    months: ['Urtarrila', 'Otsaila', 'Martxoa', 'Apirila', 'Maiatza', 'Ekaina', 'Uztaila', 'Abuztua', 'Iraila', 'Urria', 'Azaroa', 'Abendua'],
    monthsShort: ['Urt', 'Ots', 'Mar', 'Api', 'Mai', 'Eka', 'Uzt', 'Abu', 'Ira', 'Urr', 'Aza', 'Abe'],
    today: "Gaur", monthsTitle: "Hilabeteak", clear: "Ezabatu", weekStart: 1, format: "yyyy/mm/dd"
  };

  if (!Meteor.settings.public.isProduction) {
    Bert.defaults = {
      hideDelay: 12000
    };
    Bert.alert({
      type: 'success',
      style: 'growl-top-right',
      title: 'Estamos en pruebas',
      message: 'Puedes meter datos de bebes para testear pero ten en cuenta que durante la fase de pruebas los borraremos de tanto en tanto'});
  }
  Bert.defaults = {
    hideDelay: 5500
  };

  Meteor.call('getMapKey', function (error, result) {
    // console.log('Your application is running with google maps ' + result + ' key.');
    if (typeof result !== 'undefined') {
      GoogleMaps.load({ key: result, libraries: 'places'
                        // also accepts an array if you need more than one
                      });
    } else {
      console.log(error);
    }
  });

  console.log('Página cargada a las ' + moment().format('DD-MMMM-YYYY HH:mm:ss'));
});
