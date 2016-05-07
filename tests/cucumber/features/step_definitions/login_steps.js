module.exports = function () {
  require("../_support/test-helper.js");

  var username;
  var email;
  var passwd;

  var generateUserData = function () {
    username = randomUsername();
    email = randomEmail();
    passwd = randomPassword();
  };

  var createAccountAndLogin = function (callback, auth) {
    // https://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
    goHome(client);
    auth.logout(client);
    generateUserData();
    auth.createAccount(username, email, passwd);
    auth.checkCurrentUser(username);
    callback();
  };

  this.Given(/^que me logeo con el usuario de pruebas$/, function (callback) {
    goHome(client);
    this.AuthenticationHelper.logout();
    this.AuthenticationHelper.loginUsername("test", email, "testtest");
    this.AuthenticationHelper.checkCurrentUser("test");
    callback();
  });

  this.Given(/^que tengo una cuenta y estoy logeado con ella$/, function (callback) {
    createAccountAndLogin(callback, this.AuthenticationHelper);
  });

  this.Given(/^I have an account and I logged in$/, function (callback) {
    createAccountAndLogin(callback, this.AuthenticationHelper);
  });

  this.Given(/^I am signed out$/, function (callback) {
    goHome(client);
    this.AuthenticationHelper.logout();
    callback();
  });

  this.Given(/^que no estoy logeado$/, function (callback) {
    goHome(client);
    this.AuthenticationHelper.logout();
    callback();
  });

  this.Given(/^que estoy en la página inicial$/, function (callback) {
    goHome(client);
    expect(client.getTitle()).toBe(appName);
    callback();
  });

  this.Given(/^I am on the home page$/, function (callback) {
    goHome(client);
    expect(client.getTitle()).toBe(appName);
    callback();
  });

  this.When(/^I click on sign in link$/, function (callback) {
    var doesExist = client.waitForExist('li#login-dropdown-list a');
    expect(doesExist).toBe(true);
    client.click('li#login-dropdown-list a');
    callback();
  });

  this.When(/^I enter my name and password$/, function (callback) {
    this.AuthenticationHelper.loginUsername(username, email, passwd);
    callback();
  });

  this.When(/^I enter my email and password$/, function (callback) {
    this.AuthenticationHelper.loginEmail(username, email, passwd);
    callback();
  });

  this.Then(/^I should be logged in$/, function (callback) {
    this.AuthenticationHelper.checkCurrentUser(username);
    // this.AuthenticationHelper.logout();
    callback();
  });

  this.Given(/^que me registro con cierto nombre de usuario, contraseña y correo$/, function (callback) {
    generateUserData();
    this.AuthenticationHelper.registerUsername(username, email, passwd, true);
    callback();
  });

  this.Given(/^debo estar registrado$/, function (callback) {
    this.AuthenticationHelper.checkCurrentUser(username);
    callback();
  });

  this.Given(/^debo estar autenticado$/, function (callback) {
    this.AuthenticationHelper.checkCurrentUser(username);
    callback();
  });

  this.When(/^I enter incorrect authentication information$/, function (callback) {
    this.AuthenticationHelper.loginUsername("foo", "foo", "foo", true);
    callback();
  });

  this.Then(/^I should see a user not found error$/, function (callback) {
    client.waitForVisible('#login-dropdown-list > div > div.alert.alert-danger');
    // close dialog
    client.click("li#login-dropdown-list a");
    callback();
  });

  this.Then(/^I can edit my profile$/, function (callback) {
    // pending();
    client.url(process.env.ROOT_URL + "/yo");
    // goHome(client);
    // this.AuthenticationHelper.loginEmail(username, email, passwd);
    // client.waitForExist('li#login-dropdown-list');
    // expect(client.isVisible('li#login-dropdown-list')).toBe(true);
    // client.click('li#login-dropdown-list');
    // client.waitForVisible('#login-buttons-open-change-settings');

    // client.click('#login-buttons-open-change-settings');
    client.waitForVisible('.UserUpdate');
    client.waitForExist('input[name="profile.dni"]');
    client.setValue('input[name="profile.dni"]', "00000000N");
    client.waitForVisible('.btn-form-submit');
    client.click(".btn-form-submit");
    callback();
  });

  this.Given(/^I register with some name, password and email$/, function (callback) {
    generateUserData();
    this.AuthenticationHelper.registerUsername(username, email, passwd, true);
    callback();
  });

  this.Then(/^I should be registered$/, function (callback) {
    this.AuthenticationHelper.checkCurrentUser(username);
    callback();
  });

  this.Given(/^I register with some name, password and email but without accept conditions$/, function (callback) {
    generateUserData();
    this.AuthenticationHelper.logout();
    this.AuthenticationHelper.registerUsername(username, email, passwd, false);
    callback();
  });

  this.Then(/^I shouldn't be registered$/, function (callback) {
    this.AuthenticationHelper.logout();
    expect(this.AuthenticationHelper.isNotLogged(client)).toBe(true);
    callback();
  });

};
