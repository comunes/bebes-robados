/* global Template $ success alertMessage Router Meteor AutoForm TAPi18n */

Template.abuseAdd.helpers({
  username: function () { return this.data.username; }
});

AutoForm.hooks({
  addAbuseForm: {
    after: {
      // Replace `formType` with the form `type` attribute to which this hook applies
      insert: function (error, result) {
        if (typeof error === 'undefined') {
          success(TAPi18n.__('Informe de abuso guardado'));
          Router.go('home');
          AutoForm.resetForm('addAbuseForm');
          Meteor.apply(
            'sendNotifToRole',
            ['admin',
             TAPi18n.__('Nuevo informe de abuso'),
             TAPi18n.__('Hay un nuevo informe de abuso proporcionado por un usuario') +
             TAPi18n.__('Para más información accede al área de administración')],
            true);
          $('#usar').collapse('hide');
        } else {
          alertMessage(error);
          console.log('Error inserting ' + error);
        }
      }
    }
  }
});
