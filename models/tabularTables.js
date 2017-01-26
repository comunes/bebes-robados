/* global TabularTables:true,moment, tabLanguageEs:true,renderDate:true,
 isValidLatLng,renderSexo:true, renderSexoAlt:true, renderGeo:true,renderAprox:true,
 decorateNacAprox:true,setEmptyTable:true, renderNuevo:true,renderFamiliar:true, Tabular, isNew, $, Persons, AdCampaigns
 renderCheckbox:true Meteor Template abuseReports Roles siteSettings TAPi18n */
// https://github.com/aldeed/meteor-tabular
// Comparison: http://reactive-table.meteor.com/

TabularTables = {};

// https://datatables.net/reference/option/
var tabLanguageEs = {
  'sProcessing': TAPi18n.__('Procesando'),
  'sLengthMenu': TAPi18n.__('Mostrar _MENU_ resultados'),
  'sZeroRecords': TAPi18n.__('No se encontraron resultados'),
  'sEmptyTable': TAPi18n.__('Ningún dato disponible'),
  'sInfo': TAPi18n.__('Mostrando del _START_ al _END_ de un total de _TOTAL_'),
  'sInfoEmpty': TAPi18n.__('Mostrando del 0 al 0 de un total de 0'),
  'sInfoFiltered': TAPi18n.__('(filtrado de un total de _MAX_)'),
  'sInfoPostFix': '',
  'sSearch': TAPi18n.__('Buscar') + ':',
  'sUrl': '',
  'sInfoThousands': ',',
  'sLoadingRecords': TAPi18n.__('Cargando'),
  'oPaginate': {
    'sFirst': TAPi18n.__('Primero'),
    'sLast': TAPi18n.__('Último'),
    'sNext': TAPi18n.__('Siguiente'),
    'sPrevious': TAPi18n.__('Anterior')
  },
  'oAria': {
    'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
    'sSortDescending': ': Activar para ordenar la columna de manera descendente'
  }
};

setEmptyTable = function (text) {
  tabLanguageEs.sEmptyTable = text;
  TabularTables.Persons.options.language = tabLanguageEs;
};

renderDate = function (val) {
  // http://momentjs.com/docs/#/displaying/
  if (val instanceof Date) {
    return moment(val).format('D-MMM-YYYY');
  } else {
    return '';
  }
};

var renderDateTime = function (val) {
  // http://momentjs.com/docs/#/displaying/
  if (val instanceof Date) {
    return moment(val).format('DD-MMM-YYYY H:m');
  } else {
    return '';
  }
};

var sexosAbrev = {'Hombre': '♂',
                  'Mujer': '♀', Desconocido: '?', Otro: TAPi18n.__('Otro') };
var sexosAbrevAlt = {'Hombre': '♂',
                     'Mujer': '♀', Desconocido: '', 'Otro': '' };

renderSexo = function (val) {
  return sexosAbrev[val];
};

renderSexoAlt = function (val) {
  return sexosAbrevAlt[val];
};

var abrev = { true: '≈', false: '', undefined: '' };

renderAprox = function (val) {
  return abrev[val];
};

decorateNacAprox = function (val, type, doc) {
  var date = renderDate(val, type, doc);
  return abrev[doc.fechaNacimientoEsAprox] + date;
};

var abrevBebeOFamilia = {true: TAPi18n.__('bebe'), false: TAPi18n.__('familia')};

var renderBuscasBebe = function (val) {
  return abrevBebeOFamilia[val];
};

// var renderGeo = function (val) {
//   return isValidLatLng(val)
//          ? '<i title="Geolocalizado" class="fa fa-map-marker"></i>' : '';
// };

renderNuevo = function (val) {
  return isNew(val) ? '<span class="label label-warning">' + TAPi18n.__('Nuevo') + ' </span>' : '';
};

renderFamiliar = function (val, type, doc) {
  // var hasFam = typeof doc.familiar === 'string';
  var hasFam = typeof val === 'string';
  var quien = doc.buscasBebe ? (hasFam ? val : '&nbsp;') : TAPi18n.__('Hijo/a');
  return quien;
  // return '<a href="/persona/' + doc.familiar + '" title="Ir a la página del/la ' +
  //       quien + '">' + quien + '</a>';
};

TabularTables.Persons = new Tabular.Table({
  name: 'Persons',
  collection: Persons,
  language: tabLanguageEs,
  fnPreDrawCallback: function () {
    // console.log('Searching');
  },
  fnDrawCallback: function () {
    // console.log('Not searching');
  },
  createdRow: function (row, data, dataIndex) {
    if (isNew(data.updatedAt)) {
      $(row).addClass('row-high');
    }
  },
  // displayLength: 20,
  // https://datatables.net/examples/basic_init/table_sorting.html
  // order: [[1, 'desc'], [ 0, 'desc' ]],
  order: [[ 0, 'desc' ]],
  // https://datatables.net/examples/basic_init/scroll_x.html
  scrollX: true,
  stateSave: true,
  columns: [
    {data: 'createdAt', title: 'Creado'},
    {data: 'updatedAt', title: 'Actualizado'},
    {data: 'validated', title: 'Publicado'},
    {title: '...',
     tmpl: Meteor.isClient && Template.bebeAdminOps, className: 'column-center',
     tmplContext: function (rowData) {
       return {
         item: rowData
       };
     }
    },
    {data: 'parentesco', title: '¿Quién?', render: renderFamiliar, className: 'column-center'},
    {data: 'buscasBebe', title: 'Busca',
     render: renderBuscasBebe, className: 'column-center'},
    {data: 'nombreCompleto', title: 'Nombre del niño/a'},
    {data: 'sexo', title: 'Sexo', render: renderSexo,
     className: 'column-center'},

    {data: 'fechaNacimientoEsAprox', title: '',
     render: renderAprox, visible: false },
    {data: 'fechaNacimiento', title: 'Fecha nacimiento',
     render: decorateNacAprox },
    {data: 'nombreCompletoMadre', title: 'Nombre de la madre'},
    {data: 'nombreCompletoPadreOConyuge', title: 'Nombre del cónyuge'},
    {data: 'lugarNacimiento', title: 'Lugar de nacimiento'},
    {data: 'lugarNacimientoProvinciaNombre', title: 'Provincia'},
    {data: 'lugarNacimientoMunicipioNombre', title: 'Municipio'},
    // {data: 'lugarNacimientoLongitud', title: 'Geo1'},
   // {data: 'lugarNacimientoLongitud', title: 'Geo', render: renderGeo,
    // className: 'column-center' },
    // {data: 'updatedAt', title: '', render: renderNuevo, width: '1px',
    // className: column-updated-at' },
    {data: 'nombreCompletoMedico', title: 'none', visible: false},
    {data: 'nombreCompletoMatrona', title: 'none', visible: false},
    {data: 'nombreCompletoEnfermera', title: 'none', visible: false},
    {data: 'nombreOtroPersonalMedico', title: 'none', visible: false},
    {data: 'nombreFuncionariosRegCivil', title: 'none', visible: false},
    {data: 'nombreFuncionariosCementario', title: 'none', visible: false},
    {data: 'nombreTrabajadoresFuneraria', title: 'none', visible: false},
    {data: 'nombreOtrosFuncionariosOTrabajadores', title: 'none',
     visible: false},
    {data: 'cementerioEnterrado', title: 'Cementerio', visible: false},
    {data: 'lugarNacimientoLongitud', title: 'Geo', visible: false},
    {data: 'lugarNacimientoLatitud', title: 'Geo', visible: false},
    {data: 'lugarNacimientoPais', title: 'País', visible: false},
    {data: 'familiar', title: 'Familiar', visible: false},
    {data: 'slug', title: 'slug', visible: false}
  ]
});

var renderCheckbox = function (val) {
  return val
    ? '<i class="check-green fa fa-check"></i>'
    : '<i class="check-red fa fa-times"></i>';
};

var renderPhoto = function (val) {
  /* return '<div class="bebepub-main" style="width: 50%; height: 50%; background-image: url(' + val + ')">'; */
  return '<img width="100" src="' + val + '"/>';
};

var renderFamiliarDifu = function (val, type, doc) {
  return '<a href="/persona/' + doc.user + '" title="'
    + TAPi18n.__('Ir a la página de este familiar') +'"><i class="fa fa-user"></i></a>';
};

var renderBebeDifu = function (val, type, doc) {
  return '<a href="/bebe/' + doc.bebe + '" title="' + TAPi18n.__('Ir a la página de este bebe') + '"><i class="fa fa-user"></i></a>';
};

var renderPersona = function (slug, name) {
  return '<a href="/persona/' + slug + '" title="' + TAPi18n.__('Ir a la página de esta persona') + '"><i class="fa fa-user"></i> ' + name + '</a>';
};

var renderReported = function (val, type, doc) {
  return renderPersona(doc.reported, doc.reported);
};

var renderReporter = function (val, type, doc) {
  return renderPersona(doc.reporter, '');
};

var renderDesc = function (val, type, doc) {
  return '<span class="text-gray" title="' + doc.name + '"">' + val + '</val>';
};

var renderValue = function (val, type, doc) {
  return '<span title="Pulsa para editar">' + val + '</val>';
};

TabularTables.AdCampagins = new Tabular.Table({
  name: 'AdCampaigns',
  collection: AdCampaigns,
  language: tabLanguageEs,
  // https://datatables.net/examples/basic_init/table_sorting.htmlv
  order: [[4, 'asc']],
  columns: [
    {title: 'Banner', tmpl: Meteor.isClient && Template.difuTabular,
     tmplContext: function (rowData) {
       return {
         item: rowData
       };
     }
    },
    {data: 'user', title: 'Familiar', render: renderFamiliarDifu, className: 'column-center'},
    {data: 'bebe', title: 'Bebe', render: renderBebeDifu, className: 'column-center'},
    {data: 'participate', title: '¿Quiere participar?', render: renderCheckbox,
     className: 'column-center', visible: false },
    {data: 'photo', title: 'Foto ', render: renderPhoto, visible: false},
    {data: 'text', title: 'Texto', visible: false},
    {data: 'validated', title: '¿Validado?', render: renderCheckbox, className: 'column-center'},
    {title: '¿Validar?',
     tmpl: Meteor.isClient && Template.difuValidate, className: 'column-center',
     tmplContext: function (rowData) {
       return {
         item: rowData
       };
     }
    },
    {title: '¿Borrar?',
     tmpl: Meteor.isClient && Template.difuErase, className: 'column-center',
     tmplContext: function (rowData) {
       return {
         item: rowData
       };
     }
    }
  ]});

TabularTables.abuseReports = new Tabular.Table({
  name: 'abuseReports',
  collection: abuseReports,
  language: tabLanguageEs,
  order: [[1, 'desc']],
  columns: [
    {data: 'createdAt', title: 'Fecha', render: renderDateTime, className: 'abuse-date'},
    {data: 'updatedAt', title: 'Actualizado', render: renderDateTime, visible: false},
    {data: 'reported', title: 'Denunciado', render: renderReported, className: 'column-center'},
    {data: 'reporter', title: 'Denuncia', render: renderReporter, className: 'column-center'},
    {data: 'text', title: 'Texto', className: 'abuse-report'}
  ]
});

TabularTables.siteSettings = new Tabular.Table({
  name: 'siteSettings',
  collection: siteSettings,
  language: tabLanguageEs,
  autoWidth: false,
  limit: 500,
  bPaginate: false,
  order: [[0, 'asc']],
  columns: [
    {data: 'createdAt', title: 'Fecha', render: renderDateTime, className: 'abuse-date', visible: false},
    {data: '_id', title: 'ID', visible: false},
    {data: 'name', title: 'Nombre', visible: false},
    {data: 'description', render: renderDesc, title: 'Descripción'},
    {data: 'value', title: 'Valor', render: renderValue, className: 'site-setting-value-column'},
    {data: 'type', title: 'Tipo', visible: false}
  ]
});

// TODO
// https://datatables.net/reference/option/language
// if(Meteor.isClient) {
//   TabularTables.Persons.options.language = { "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/German.json" };
// }
