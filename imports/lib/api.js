/* global Router UniHTML parseInt addApiRoute:true */
// Based in:
// http://meteorpedia.com/read/REST_API
// https://github.com/awatson1978/rest-api/blob/master/webapp/lib/rest/api.posts.js

export const addApiRoute = function (path, collection, onlyFields, param, fetchMany) {
  if (!onlyFields) {
    onlyFields = {};
  }
  if (!fetchMany) {
    fetchMany = false;
  }

  Router.route('/api/find' + path, function () {
    var results;
    if (param) {
      var filter = { };
      var p = UniHTML.purify(this.params[param]);
      // console.log(p);
      filter[param] = isFinite(p) ? parseInt(p, 10) : p;
      // console.log(filter);
      if (fetchMany) {
        results = collection.find(filter, onlyFields).fetch();
      } else {
        results = collection.findOne(filter, onlyFields);
      }
    } else {
      results = collection.find({}, onlyFields).fetch();
    }
    this.response.statusCode = 200;
    this.response.setHeader('Content-Type', 'application/json');
    this.response.setHeader('Access-Control-Allow-Origin', '*');
    this.response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // null function for replace, indent 2
    this.response.end(JSON.stringify(results, null, 2));
  }, {where: 'server'});
};
