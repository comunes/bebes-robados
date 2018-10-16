module.exports = {
  // - - - - CHIMP - - - -
  watch: false,
  watchTags: '@watch',
  offline: false,

  // - - - - CUCUMBER - - - -
  path: './tests/cucumber/features',

  // jsonOutput: 'chimp-output.json',

  // '- - - - DEBUGGING  - - - -
  log: 'info',
  debug: false,
  seleniumDebug: false,
  webdriverLogLevel: false,
  // debugBrkCucumber: 5858,
  webdriverio: {
    waitforTimeout: 10000,
    // You can commment this if want to see chrome in action
    /* desiredCapabilities: {
      chromeOptions: {
        args: ['headless', 'disable-gpu'],
      },
      isHeadless: true,
    }, */
  },

};
