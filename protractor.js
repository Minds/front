require('babel/register');

var BASE_URL = process.env.minds_base_url ? process.env.minds_base_url : 'http://dev.minds.io/';
var BROWSERS = require('./sauce.conf');
var aliases = BROWSERS.aliases;

var _browsers = process.env.browsers ? process.env.browsers : ['DESKTOP'];

exports.config = {
	baseUrl: BASE_URL,
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

	onPrepare: function() {
		browser.ignoreSynchronization = true;
    browser.driver.get(BASE_URL);
		if(BASE_URL == 'https://new.minds.com/')
    	browser.manage().addCookie('beta', 'angular2', '/', 'new.minds.com');

	},
	specs: [
		'./tests/e2e/helpers.js',
		'./tests/e2e/*.js'
	],
	exclude: [],
  multiCapabilities: aliases[_browsers].map(function(alias){
    console.log('testing: ' + BROWSERS.customLaunchers[alias].browserName);
    var b = BROWSERS.customLaunchers[alias];
    b.name = BROWSERS.customLaunchers[alias].browserName + ' (' + b.version + ') test';
    return b;
  }),
	framework: 'jasmine2',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 60000
	}
};
