/* global Meteor, AdCampaigns, check, Persons */
 // https://stackoverflow.com/questions/13151879/publish-certain-information-for-meteor-users-and-more-information-for-meteor-use
// https://stackoverflow.com/questions/14802627/cannot-access-other-users-email-addresses-in-meteor-app

Meteor.publish('allUsers', function () {
  return Meteor.users.find({});
});

var publicUserFields = {fields: {'emails': 1, 'username': 1, 'profile.name': 1, 'profile.redesSociales': 1}};

var allUserFields = {fields: {'emails': 1, 'username': 1, 'profile.dni': 1, 'profile.name': 1, 'profile.redesSociales': 1}};

Meteor.publish('allUserData', function () {
  return Meteor.users.find({}, publicUserFields);
});

Meteor.publish('some-user', function (username) {
  check(username, String);
  var user;
  user = Meteor.users.find({username: username}, publicUserFields);
  if (user.count() === 0) {
    user = Meteor.users.find({_id: username}, publicUserFields);
  }
  return user;
});

Meteor.publish('me', function () {
  var user = Meteor.users.find({_id: this.userId}, allUserFields);
  return user;
});

Meteor.publish('myReports', function () {
  var persons = Persons.find({familiar: this.userId});
  return persons;
});
