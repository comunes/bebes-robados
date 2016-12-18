/* global Meteor siteSettings */
Meteor.publish('settings', function () {
  return siteSettings.find();
});
