/* global Meteor Tracker */
Meteor.startup(function () {
  return Tracker.autorun(function () {
    var userId;
    userId = Meteor.userId();
    Meteor.Piwik.setUserInfo(userId);
  });
});
