/* global Meteor */

// Define App Constants

if (Meteor.App) {
  throw new Meteor.Error('Meteor.App already defined? see lib/constants.js');
}

Meteor.App = {
  NAME: '',
  SUBNAME: '',
  DESCRIPTION: ''
};
