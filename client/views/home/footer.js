/* global Template thisYear Dispatcher */

import {thisYear} from '/imports/lib/functions.js';

Template.homeFooter.helpers({
  thisYear: function () {
    return thisYear;
  }
});

Template.homeFooter.events(Dispatcher.events);
