// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-mocha-reporter'),
      require('karma-jasmine-order-reporter'),
    ],
    // webpack: { node: { fs: 'empty', } },
    client:{
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: true, // run tests in the same order every time
        seed: process.env['SEED'] // set seed from env
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },

    reporters: ['mocha', 'jasmine-order'],
    mochaReporter: {
      ignoreSkipped: true,
    },    
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--window-size=1920,1080',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222',
        ],
      }
    },
    singleRun: true,
		captureTimeout: 210000,
    browserNoActivityTimeout: 210000,
		browserDisconnectTimeout: 210000,
    browserDisconnectTolerance: 3
  });
};
