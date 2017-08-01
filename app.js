var _ = require('lodash');
var Bot = require('./bot');
var config = require('./bot-config.json');


var settings = config['settings'];
var tokens = config['tokens'];

_.each(tokens, (token) => {
    var bot = new Bot(settings, token);
});