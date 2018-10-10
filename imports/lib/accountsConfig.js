/* global Accounts Meteor ServiceConfiguration process */

Accounts.config({
  // Don't send notifications in tests
  sendVerificationEmail: Meteor.isServer ? !process.env.PHANTOMJS : true
});

// Instead of a long name
// meteor-accounts-ui-bootstrap-3/login_buttons.js
if (Meteor.isClient) {
  Accounts._loginButtons.displayName = function () {
    var user = Meteor.user();
    if (!user) {
      return '';
    }
    if (user.username) {
      return user.username;
    }
    if (user.emails && user.emails[0] && user.emails[0].address) {
      return user.emails[0].address;
    }
    return '';
  };
}

if (Meteor.isServer) {
  var bebes_g_key = process.env.BEBES_GOOGLE_KEY;
  var bebes_g_secret = process.env.BEBES_GOOGLE_SECRET;

  var bebes_t_key = process.env.BEBES_TWITTER_KEY;
  var bebes_t_secret = process.env.BEBES_TWITTER_SECRET;

  if (bebes_g_key) {
    if (ServiceConfiguration.configurations.find({'service': 'google'}).count() == 0) {
      ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: bebes_g_key,
        secret: bebes_g_secret
      });
    } else {
      ServiceConfiguration.configurations.update(
        {service: 'google'}, {
          $set: {
            clientId: bebes_g_key,
            secret: bebes_g_secret
          }
        }
      );
    }
  }

  if (bebes_t_key) {
    if (ServiceConfiguration.configurations.find({'service': 'twitter'}).count() == 0) {
      ServiceConfiguration.configurations.insert({
        service: 'twitter',
        loginStyle: 'popup',
        consumerKey: bebes_t_key,
        secret: bebes_t_secret
      });
    } else {
      ServiceConfiguration.configurations.update(
        {service: 'twitter'}, {
          $set: {
            loginStyle: 'popup',
            consumerKey: bebes_t_key,
            secret: bebes_t_secret
          }
        }
      );
    }
  }
}
