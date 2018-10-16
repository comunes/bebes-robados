Package.describe({
  name: 'hitchcott:app-dump',
  version: '0.4.3',
  summary: 'In-app Backup and Restore for your Mongo Database',
  git: 'https://github.com/hitchcott/app-dump',
  documentation: 'README.md'
});

Npm.depends({
  "moment": "2.18.1",
  "busboy": "0.2.14",
  "mongodb-backup": "1.6.9",
  "mongodb-restore": "1.6.2"
});

Package.onUse(function(api) {

  api.versionsFrom('1.0.3.2');

  // SERVER
  api.use([
    'coffeescript',
    'iron:router', // for REST endpoint only
    'accounts-password'
  ], ['server']);

  api.addFiles([
    'app-dump-server.coffee'
  ], ['server']);

  // CLIENT
  api.use([
    'coffeescript',
    'templating',
    'less@2.7.9',
    'reactive-var'
  ], ['client']);

  api.addFiles([
    'app-dump-ui.html',
    'app-dump-ui.coffee',
    'app-dump-ui.less'
  ], ['client']);

  api.export('appDump', ['server'])

});
