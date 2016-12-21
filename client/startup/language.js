/* global Meteor Session TAPi18n getUserLanguage console Tracker */
Meteor.startup(function () {
  Tracker.autorun(function () {
    var lang = getUserLanguage();
    Session.set("showLoadingIndicator", true);
    console.log("Language: " + lang);
    TAPi18n.setLanguage(lang)
      .done(function () {
        Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });
    accountsUIBootstrap3.setLanguage(lang);

    // Más: http://www.webtutoriales.com/articulos/trabajando-con-moment-js
    // http://momentjs.com/docs/#/customization/relative-time/
    moment.locale(lang);
    $.fn.datepicker.defaults.language = lang;
  });
});
