/*global module expect client process  */
module.exports = function () {

  var urls;

  this.Given(/^una lista de urls de API y contenidos$/, function (table, callback) {
    urls = table.raw();
    callback();
  });

  var search = function(callback, reverse) {
    for (var i = 0; i < urls.length; i++){
      client.url(process.env.ROOT_URL + urls[i][0]);
      client.waitForText("body", urls[i][1], undefined, reverse);
    }
    callback();
  };

  this.Given(/^verifico que al acceder a las urls aparecen esos contenidos$/, function (callback) {
    search(callback, false);
  });


  this.Given(/^verifico que al acceder a las urls no aparecen esos contenidos$/, function (callback) {
    search(callback, true);
  });

}
