/* global Meteor Session TAPi18n getUserLanguage console Tracker */
import { T9n } from "meteor-accounts-t9n";
import { getUserLanguage } from '/imports/lib/language';

import en from 'meteor-accounts-t9n/build/en';
import es from 'meteor-accounts-t9n/build/es';
import ca from 'meteor-accounts-t9n/build/ca';
import fr from 'meteor-accounts-t9n/build/fr';

Meteor.startup(function () {

  // Def language
  T9n.map['en'] = en;
  T9n.map['es'] = es;
  T9n.map['fr'] = fr;
  T9n.map['ca'] = ca;

  T9n.setLanguage('es');

  Tracker.autorun(function () {
    var lang = getUserLanguage();
    // we use short lang code
    lang = lang.substr(0,2);
    Session.set("showLoadingIndicator", true);
    console.log("Language: " + lang);
    if (lang === 'gl' || lang === 'eu') {
      T9n.setLanguage('es');
    } else {
      T9n.setLanguage(lang);
    }
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
