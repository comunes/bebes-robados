/* global Accounts check Meteor */
// https://stackoverflow.com/questions/26799150/meteor-accounts-via-external-services-dont-set-user-username

var generate_username = function (username) {
  var count;
  username = username.toLowerCase().trim().replace(' ', '').replace('.', '');
  count = Meteor.users.find({'username': username}).count();
  if (count === 0) {
    return username;
  } else {
    return username + (count + 1).toString();
  }
};

var setEmail = function (user, email) {
  if (email) {
    user.emails = [{address: email, verified: true}];
  }
};

// https://stackoverflow.com/questions/30463958/how-to-extract-username-from-3rd-party-social-logins-via-useraccounts-package
Accounts.onCreateUser(function (options, user) {
  if (user.services) {
    if (user.services.google) {
      var email = user.services.google.email;
      var parts = email.split('@');
      user.username = generate_username(parts[0]);
      if (options && options.profile) {
        options.profile.name = user.services.google.name;
      }
      setEmail(user, email);
    } else if (user.services.twitter) {
      user.username = generate_username(user.services.twitter.screenName);
      if (options && options.profile) {
        options.profile.name = user.services.twitter.screenName;
      }
      setEmail(user, user.services.twitter.email);
    } else if (user.services.facebook) {
      // not tested
      user.username = user.services.facebook.username;
    } else if (user.services.github) {
      user.username = user.services.github.username;
    }
  }
  // console.log(user);
  // console.log(options.profile);

  // We still want the default hook's 'profile' behavior.
  if (options && options.profile) {
    user.profile = options.profile;
  }
  return user;
});

Accounts.emailTemplates.enrollAccount.subject = function (user) {
  return 'Bienvenido/a ' + user.profile.name + ',';
};

Accounts.emailTemplates.enrollAccount.text = function (user, url) {
  return '¡Gracias por participar en nuestra red!' +
       ' Para activar tu cuenta, simplemente pulsa en el link de abajo::\n\n' +
       url;
};

Accounts.emailTemplates.resetPassword.subject = function (user) {
  return 'Resetea tu contraseña en ' + Accounts.emailTemplates.siteName;
};

Accounts.emailTemplates.resetPassword.text = function (user, url) {
  return 'Muy buenas ' + user.profile.username + ',\n\n' +
         'Pulsa en el siguiente enlace para restablecer tu nueva contraseña:\n' +
         url + '\n\n' +
         '¡Por favor, no la vuelvas a olvidar!\n\n\n' +
         'Un saludo\n';
};

Accounts.emailTemplates.verifyEmail.subject = function (user) {
  return 'Verifica tu correo electrónico en ' + Accounts.emailTemplates.siteName;
};

Accounts.emailTemplates.verifyEmail.text = function (user, url) {
  return 'Muy buenas,\n\n' +
    'Para verificar tu cuenta, simplemente pulsa en el siguiente enlace:\n\n' +
    url + '\n\n¡Gracias!';
};

Meteor.methods({
  resendVerificationEmail: function () {
    check(this.userId, String);
    Accounts.sendVerificationEmail(this.userId);
  }
});
