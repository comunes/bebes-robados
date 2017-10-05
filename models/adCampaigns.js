/* global AdCampaigns:true, Mongo, Schema:true, SimpleSchema, currentAdCampaign, Roles _ */

import {currentAdCampaign} from '/lib/functions.js';

AdCampaigns = new Mongo.Collection('AdCampaigns');

Schema.AdCampaign = new SimpleSchema({
  // current campaign 1
  group: { type: Number, optional: false, autoValue: function () { return currentAdCampaign; }, index: 1 },
  user: { type: String, optional: false,
          autoValue: function () {
            if (this.isInsert) {
              return this.userId;
            }
          }, index: 1
        },
  bebe: { type: String, optional: false },
  photo: { type: String, optional: true },
  photoHD: { type: String, optional: true },
  // jcrop coord + photoHD para usar en otras escalas
  coords: { type: Object, optional: true },
  text: { type: String, optional: true },
  participate: { type: Boolean, optional: false, index: 1 },
  validated: { type: Boolean, optional: false, index: 1 }
});

AdCampaigns.attachSchema(Schema.AdCampaign);

AdCampaigns.allow({
  // TODO: more perms here
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    if (Roles.userIsInRole(userId, ['admin'])) {
      return true;
    }
    // Only allow validate campagins to admins but allow other editions
    if (doc.user === userId) {
      return true;
    }
    return false;
  },
  remove: function (userId, doc) {
    if (Roles.userIsInRole(userId, ['admin']) || doc.user === userId) {
      return true;
    }
    return false;
  }
});
