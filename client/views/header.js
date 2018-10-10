/* global Template Router $ siteSettings Dispatcher TAPi18n Meteor */

import {undef} from '/imports/lib/functions.js';

Template.header.helpers({
  siteName: function () {
    return siteSettings.get('site-main-name');
  },
  siteSubName: function () {
    var subname = siteSettings.get('site-main-subname');
    return undef(subname)? '': TAPi18n.__(subname);
  }
});

Template.header.onRendered(function () {
});

// From no maintained:
// https://github.com/chrisallenmoore/bootstrap3-navbar-active-links
Template.onRendered(function () {
  var path = Router.current().location.get().path;
  var paths = path.replace(/(\/[A-Za-z\-]+)/g, function (m, $1, idx, str) {
    return str.slice(0, idx || str.length).replace(/\/$/, '') + ',';
  }).replace(/\,$/, '').split(',');

  // find only links in bootstrap navbar
  var $navbarAnchors = $('.navbar a');
  var $lang = $('.navbar li.activelang a');
  paths.forEach(function (item) {
    $navbarAnchors.parent('li').removeClass('active');
    $navbarAnchors.removeClass('active').filter('[href="' + item + '"]').parent('li').addClass('active');
  });
  $lang.parent('li').addClass('active');
});

Template.header.events(Dispatcher.events);

Template.i18nmenu.events({
  // set language to selected option's tag
  'click .tap-i18n-dropdown ul li a' : function () {
    if (Meteor.user()) {
      Meteor.users.update(Meteor.userId(), {$set: {"profile.lang": this.tag}});
    }
    return TAPi18n.setLanguageAmplify(this.tag);
  }
});
