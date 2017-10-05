/* global Meteor, AdCampaigns */

import {currentAdCampaign} from '/lib/functions.js';

Meteor.publish('AdCampaigns', function () {
  return AdCampaigns.find();
});

Meteor.publish('myCampaigns', function () {
  return AdCampaigns.find({ group: currentAdCampaign,
                            user: this.userId });
});
