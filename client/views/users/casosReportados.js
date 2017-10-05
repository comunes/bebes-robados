/* global Template Persons */

Template.casosReportados.helpers({
  tieneBebes: function () {
    return Persons.find({ familiar: this.user._id }).count() > 0;
  },
  tieneFechaNacimiento: function (bebe) {
    return typeof bebe.fechaNacimiento !== 'undefined';
  },
  bebes: function () {
    return Persons.find({ familiar: this.user._id });
  }
});
