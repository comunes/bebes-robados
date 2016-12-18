/* global Template Meteor success alertMessage $ Session Tracker Router SEO _ TAPi18n */

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle (array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

Template.basicLayout.events({
  'click .resend-verification-link': function (event, template) {
    Meteor.call('resendVerificationEmail', function (error, response) {
      if (error) {
        alertMessage(error.reason);
      } else {
        var email = Meteor.user().emails[0].address;
        success(TAPi18n.__('Correo de verificación enviado a ') + email);
      }
    });
  }
});

Template.basicLayout.onRendered(function () {
  // http://stackoverflow.com/questions/21203111/bootstrap-3-collapsed-menu-doesnt-close-on-click
  $(document).on('click', '.navbar-collapse.in', function (e) {
    if ($(e.target).is('a') && $(e.target).attr('class') !== 'dropdown-toggle') {
      $(this).collapse('hide');
    }
  });
});

Template.basicLayout.helpers({
  template: function () {
    var route = Router.current();
    return route ? route.lookupTemplate() : 'home';
  },
  photos: function () {
    var ph = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99]);
    ph[100] = 100;
    return ph;
  }
});

Template.basicLayout.events({
  'load #lorem-photo-100': function () {
    $('#lorem-photos').show();
  }
});

// https://stackoverflow.com/questions/14036248/meteor-setting-the-document-title
Session.setDefault('DocumentTitle', '');
Session.setDefault('DocumentTitleMain', '');
Tracker.autorun(function () {
  var sessionTitle = Session.get('DocumentTitle');
  var site = Session.get('DocumentTitleMain');
  var newTitle = sessionTitle === site ? sessionTitle
        : (typeof sessionTitle === 'undefined' || sessionTitle.length === 0)
        ? site
        : (sessionTitle + ' - ' + site);
  // console.log(newTitle);
  _.defer(function () {
    document.title = newTitle;
    SEO.set({ title: newTitle, meta: { 'description': newTitle + '. ' + Meteor.App.DESCRIPTION } });
  });
});
