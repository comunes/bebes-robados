/* global EditableText Meteor Roles success */

EditableText.useTransactions = true;

/* Se usa con afterUpdate="afterUpdateMsg" en la platilla pero no se que devolver para que no de un error */
EditableText.registerCallbacks({
  afterUpdateMsg: function (doc) {
    success('Página guardada');
  }
});

EditableText.saveOnFocusout = true;

EditableText.userCanEdit = function (doc, Collection) {
  return Roles.userIsInRole(Meteor.userId(), ['admin']);
};
