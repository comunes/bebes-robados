/* global abuseReports:true, Mongo, Schema:true, SimpleSchema, Roles TAPi18n */

import {defaultCreatedAt, defaultUpdateAt} from '/lib/functions.js';

abuseReports = new Mongo.Collection('abuseReports');

Schema = {};

Schema.abuseReports = new SimpleSchema({
  reported: {
    type: String,
    label: 'Reportado',
    optional: false,
    index: 1
  },
  reporter: {
    type: String,
    optional: false,
    label: 'Informante',
    autoValue: function () {
      if (this.isInsert) {
        return this.userId;
      }
    },
    index: 1
  },
  text: {
    type: String,
    label: TAPi18n.__('¿Qué problema quiere reportar sobre este usuario/a?'),
    optional: false,
    autoform: {
      afFieldInput: {
        type: 'textarea',
        rows: '10'
      }
    }
  },
  createdAt: defaultCreatedAt,
  updatedAt: defaultUpdateAt
});

abuseReports.attachSchema(Schema.abuseReports);

abuseReports.allow({
  // TODO: more perms here
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove: function (userId, doc) {
    return Roles.userIsInRole(userId, ['admin']);
  }
});
