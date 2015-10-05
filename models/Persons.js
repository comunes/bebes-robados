Schema = {};

Sexs = new Mongo.Collection('Sexs');

Schema.Sexs = new SimpleSchema({
  name: { type: String }
});

Sexs.attachSchema(Schema.Sexs);

if (Meteor.isServer && Sexs.find().count() == 0 ) {
  Sexs.insert({name: "Hombre"});
  Sexs.insert({name: "Mujer"});
  Sexs.insert({name: "Otro"});
  Sexs.insert({name: "Desconocido"});
}

defaultDate = function(label) {
  return  { type: Date, optional: true, label: label, autoform: { type: "bootstrap-datepicker", datePickerOptions: { format: "dd/mm/yyyy", language: "es" } } };
}
defaultMap = function(label) {
  return {
    type: String,
    label: label,
    optional: true,
    autoform: {
      type: 'map',
      afFieldInput: {
        geolocation: false,
        mapType: 'roadmap',
        placeholder: "test",
        searchBox: true,
        autolocate: false,
        defaultLat: 40.4167754,
        defaultLng: -3.7037902,
        zoom: 5,
        googleMap: { language: "es" }
      }}};
};

Persons = new Mongo.Collection('Persons');

Persons.attachSchema(
  new SimpleSchema({
    nombreCompleto: { type: String, label: "Nombre completo del niño/a:" },
    fechaNacimiento: defaultDate("Fecha de nacimiento:"),
    fechaNacimientoEsAprox: { type: Boolean, label: "¿La fecha de nacimiento es aproximada?", autoValue: function() { return false; } },
    sexo: { type: Schema.Sexs, label: "Sexo:" },
    // geocomplete!!! https://atmospherejs.com/jeremy/geocomplete
    lugarNacimiento: defaultMap("Lugar de nacimiento (indique en el mapa el nombre o dirección del hospital si lo conoce):"),
    fechaFallecimiento: defaultDate("Fecha del fallecimiento:"),
    fechaFallecimientoEsAprox: { type: Boolean, label: "¿La fecha del fallecimiento es aproximada?", autoValue: function() { return false; } },
    nombreCompletoMadre: { type: String, optional: true, label: "Nombre completo de la madre:" },
    nombreCompletoPadreOConyuge: { type: String, optional: true, label: "Nombre completo del padre o conyuge:" },
    motivoMuerte: { type: String, optional: true, label: "Motivo de la muerte:" },
    vistoCadaver: {type: Boolean, label: "¿Vio algún miembro de la familia el cadaver?",
                   autoform: { afFieldInput: { type: "boolean-radios", trueLabel: "Sí", falseLabel: "No"}}},
    noVistoCadaverRazon: {
      type: String, optional: true, label: "¿Por qué no lo vio?",
      autoform: {
        type: "select-radio",
        options: function () {
          return [
            {label: "No tuvimos fuerzas para ver el cadáver.", value: "sinfuerzas"},
            {label: "No nos dejaron. El niño estaba muy desfigurado.", value: "desfigurado"},
            {label: "No nos dejaron. Lo habían enterrado sin decir nada a la familia.", value: "enterrado"},
            {label: "No nos dejaron. Otras razones.", value: "otras"}
          ];
        }
      }
    },
    noVistoCadaverOtrasRazones: {type: String, optional: true, label: "¿Qué otras razones?" },
    entierroPorHospital: {type: Boolean, label: "¿Se hizo cargo del entierro el hospital?",
                          autoform: { afFieldInput: { type: "boolean-radios", trueLabel: "Sí", falseLabel: "No"}}},
    entierroPorHospitalMotivos: {
      type: String, optional: true, label: "¿Por qué se hizo cargo del entierro el hospital?",
      autoform: {
        type: "select-radio",
        options: function () {
          return [
            {label: "La familia no disponía de seguro de entierro y el hospital se ofreció a pagar y gestionar el entierro.", value: "sinseguro"},
            {label: "La familia disponía de seguro de entierro pero el hospital ni siquiera preguntó.", value: "conseguro"},
            {label: "Otras razones.", value: "otras"}
          ];
        }
      }
    },
    entierroPorHospitalOtrasRazones: {type: String, optional: true, label: "¿Qué otras razones?" },
    cementerioEnterrado: defaultMap("¿En qué cementerio fue enterrado?"),
    posibilidadPruebasADN: {type: Boolean, label: "¿Esta en una sepultura perpetua con posibilidades de exhumación para realizar pruebas de ADN?", optional: true,
                            autoform: { afFieldInput: { type: "boolean-radios", trueLabel: "Sí", falseLabel: "No"}}},
    sepulturaTemporalPruebasADN: {type: Boolean, label: "¿Está en una sepultura temporal colectiva (5 o más cuerpos) con posibilidades de exhumación para realizar pruebas de ADN?", optional: true,
                                  autoform: { afFieldInput: { type: "boolean-radios", trueLabel: "Sí", falseLabel: "No"}}},
    enOsarioComun: {type: Boolean, label: "¿Está en un osario común?", optional: true,
                    autoform: { afFieldInput: { type: "boolean-radios", trueLabel: "Sí", falseLabel: "No"}}},
    enOsarioComunDesdeFecha: defaultDate("¿Desde que fecha en osario común?"),
    motivosSospecha: {type: String, optional: true, label: "Motivos por el que sospecha de que el niño/a no falleció realmente y pudo ser robado:" },
    nombreCompletoMedico: { type: String, optional: true, label: "Nombre completo del médico:" },
    nombreCompletoMatrona: { type: String, optional: true, label: "Nombre completo de la matrona:" },
    nombreCompletoEnfermera: { type: String, optional: true, label: "Nombre completo de la enfermera:" },
    nombreOtroPersonalMedico: { type: String, label: "Nombre de algún otro miembro del personal médico, de enfermería, de dirección o administración del centro médico:", optional: true },

    nombreFuncionariosRegCivil: { type: String, optional: true, label: "Nombres de funcionarios del Registro Civil:" },
    nombreFuncionariosCementario: { type: String, optional: true, label: "Nombres de funcionarios del cementerio:" },
    nombreTrabajadoresFuneraria: { type: String, optional: true, label: "Nombres de trabajadores de funerarias:" },
    nombreOtrosFuncionariosOTrabajadores: { type: String, optional: true, label: "Nombres de otros funcionarios o trabajadores:" },

    gestionesRealizadasYDocumentos: {type: String, optional: true, label: "Gestiones realizadas y documentos conseguidos:" },
    denunciaEnComisaria: {type: Boolean, optional: true, label: "¿Ha puesto denuncia en la Comisaría?",
                          autoform: { afFieldInput: { type: "boolean-radios", trueLabel: "Sí", falseLabel: "No"}}},
    denunciaEnComisariaEstadoTramitacion: {type: String, optional: true },
    denunciaEnFiscalia: {type: Boolean, optional: true, label: "¿Ha puesto denuncia en la Fiscalía?",
                         autoform: { afFieldInput: { type: "boolean-radios", trueLabel: "Sí", falseLabel: "No"}}},
    denunciaEnFiscaliaEstadoTramitacion: {type: String, optional: true },
    denunciaEnJuzgado: {type: Boolean, optional: true, label: "¿Ha puesto denuncia en el Juzgado?",
                        autoform: { afFieldInput: { type: "boolean-radios", trueLabel: "Sí", falseLabel: "No"}}},
    denunciaEnJuzgadoEstadoTramitacion: {type: String, optional: true }
  })
);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Persons.allow({
    insert : function () {
      return true;
    },
    update : function () {
      return true;
    },
    remove : function () {
      return true;
    }
  });
}
