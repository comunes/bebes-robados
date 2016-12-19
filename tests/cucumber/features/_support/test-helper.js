/* global randomUsername:true, expect, randomPassword:true, randomEmail:true, goHome:true, phantomJs:true, appName:true
 process */

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(size)
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < size; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

randomUsername = function () {
  return makeid(7);
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

appName = 'REUNE: Citizen Search Network for Stolen Babies';
