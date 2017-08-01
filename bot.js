var _ = require('lodash');
var Twit = require('twit');
var debug = require('debug')('bot');

var TwitRest = require('./twit-rest');
var TwitStream = require('./twit-stream');

function Bot(settings, tokens){
    this.settings = settings;
    this.tokens = tokens;
    this.twit = new Twit(tokens);
    this.twitRest = new TwitRest(this.twit, settings['intervalPeriod']);
    this.twitRest.start();
    this.twitStream = new TwitStream(this.twit, this.twitRest, this.settings);
    this.twitStream.init();
}

module.exports = Bot;