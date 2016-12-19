/* global siteSettings:true, Mongo, SimpleSchema, Roles siteSettingsTypes Meteor Session
 defaultCreatedAt Session */

siteSettings = new Mongo.Collection('siteSettings');

siteSettings.get = function (name) {
  var setting = siteSettings.findOne({
    name: name
  });
  return typeof setting === 'object' ? setting.value : void 0;
};

siteSettings.getSchema = function (type) {
  return new SimpleSchema({
    name: {
      type: String,
      autoform: { readonly: true, disabled: true }
    },
    type: {
      type: String
    },
    createdAt: defaultCreatedAt,
    value: siteSettingsTypes[type].value
  });
};

siteSettings.observe = function (name, callback) {
  siteSettings.find({name: name}).observe({
    added: function (document) {
      callback(document.value);
    }
  });
};

siteSettings.observe('site-main-subname',
                     function (value) {
                       var main = siteSettings.get('site-main-name');
                       Meteor.App['NAME'] = main;
                       Meteor.App['SUBNAME'] = value;
                       if (Meteor.isClient) {
                         Session.set('SiteName', value);
                       }
                     });

siteSettings.observe('site-main-description',
                     function (value) { Meteor.App['DESCRIPTION'] = value; });

siteSettings.allow({
  insert: function (userId, doc) {
    return false;
  },
  update: function (userId, doc, fields, modifier) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove: function (userId, doc) {
    return false;
  }
});
