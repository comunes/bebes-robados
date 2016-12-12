/* global Template TAPi18n Meteor */
Template.accessDenied.helpers({
    "alert": function () {
      var msgBase = TAPi18n.__("Inicia sesión o regístrate en este sitio para participar");
      var other = Meteor.settings.public.isProduction ? "": TAPi18n.__("También puedes usar el usuario de pruebas 'test' con contraseña 'testtest'");
      return msgBase + " " + other;
    }
});
