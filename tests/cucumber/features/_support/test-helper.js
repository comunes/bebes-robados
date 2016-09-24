/* global randomUsername:true, expect, randomPassword:true, randomEmail:true, goHome:true, phantomJs:true, appName:true
 process */

randomUsername = function () {
  return Math.random().toString(16).substring(7);
};

randomPassword = function () {
  return randomUsername();
};

randomEmail = function () {
  return randomUsername() + '@example.com';
};

goHome = function (client) {
  client.url(process.env.ROOT_URL);
  client.waitForVisible('.Home');
  expect(client.isVisible('.Home')).toBe(true);
  // Close alert
  if (client.isVisible('.bert-content')) {
    client.click('.bert-content');
  }
  if (client.isVisible('#acceptCookies')) {
    client.click('#acceptCookies');
  }
};

// PHANTOMJS=1 chimp --watch --ddp=http://localhost:3000  --browser=phantomjs # to avoid some phantomjs specific tests that
// do not fails in chrome/firefox
phantomJs = process.env.PHANTOMJS;

appName = 'REUNE: Red Ciudadana de Búsqueda de Bebes Robados';
