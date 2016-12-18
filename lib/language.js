/* global navigator getUserLanguage:true Meteor */

getUserLanguage = function () {
  // Put here the logic for determining the user language
  // https://themeteorchef.com/snippets/i18n-and-meteor/#tmc-language-switching

  // If the user is logged in, retrieve their saved language
  var lang;
  if (Meteor.user()) {
    lang = Meteor.user().profile.lang;
  }
  var browserLang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
  return lang || browserLang;
};
