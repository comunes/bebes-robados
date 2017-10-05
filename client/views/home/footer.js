/* global Template thisYear Dispatcher */

import {thisYear} from '/lib/functions.js';

Template.homeFooter.helpers({
  thisYear: function () {
    return thisYear;
  }
});

Template.homeFooter.events(Dispatcher.events);
