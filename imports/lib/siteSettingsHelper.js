/* global Meteor Template siteSettings */
if (Meteor.isClient) {
  Template.registerHelper('siteSetting', function (options) {
    var name, ref;
    name = void 0;
    if (typeof options === 'string') {
      name = options;
    } else if (options != null ? (ref = options.hash) != null ? ref.name : void 0 : void 0) {
      name = options.hash.name;
    }
    return siteSettings.get(name);
  });
}
