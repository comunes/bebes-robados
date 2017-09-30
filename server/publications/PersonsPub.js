/* global Persons Meteor personPhotos personAttachs check Roles */
Meteor.publish('Persons', function () {
  var isAdmin = Roles.userIsInRole(this.userId, ['admin']);
  if (isAdmin) {
    return Persons.find();
  } else {
    return Persons.find({validated: true});
  }
});

Meteor.publish('PersonsForHome', function () {
  return Persons.find({validated: true});
});

// https://github.com/CollectionFS/Meteor-CollectionFS#storing-fsfile-references-in-your-objects
Meteor.publish('personAndFiles', function (id) {
  check(id, String);
  var person = Persons.find({_id: id});
  if (person.count() > 0) {
    var familiar = person.fetch()[0].familiar;
    check(familiar, String);
    var userFamiliar = Meteor.users.find({_id: familiar});
    var personFetch = person.fetch()[0];
    return [
      person,
      userFamiliar,
      personPhotos(personFetch),
      personAttachs(personFetch, this.userId)
    ];
  } else {
    // empty cursor
    return Persons.find({limit: 0});
  }
});

// TODO: id param can be removed
Meteor.publish('personsOfThisUser', function (id) {
  return Persons.find({familiar: this.userId});
});

Meteor.publish('personAndFilesViaSlug', function (slug) {
  check(slug, String);
  var person = Persons.find({slug: slug});
  if (person.count() > 0) {
    var familiar = person.fetch()[0].familiar;
    check(familiar, String);
    var userFamiliar = Meteor.users.find({_id: familiar});
    var personFetch = person.fetch()[0];
    return [
      person,
      userFamiliar,
      personPhotos(personFetch),
      personAttachs(personFetch, this.userId)
    ];
  } else {
    // empty cursor
    return Persons.find({limit: 0});
  }
});
