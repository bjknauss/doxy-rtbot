var _ = require('lodash');
var Twit = require('twit');
var TwitRest = require('./twit-rest');
var debug = require('debug')('TwitStream');


function TwitStream(twit, twitRest, settings){
    this.twit = twit;
    this.twitRest = twitRest;
    this.follows = settings['follows'];
    this.mediaOnly = settings['mediaOnly'];
    this.retweets = settings['retweets'];
    this.favorites = settings['favorites'];
    this.stream = null;
}

TwitStream.prototype.init = function(){
    var params = {stringify_friend_ids: true};
    this.stream = this.twit.stream('user', params);
    this.stream.on('tweet', this.tweetHandler.bind(this));
    debug("init complete.");
}

TwitStream.prototype.tweetHandler = function(tweet){
    var tweetAuthor = tweet['user'];
    var tweetAuthorId = tweetAuthor['id_str'];
    var tweetId = tweet['id_str'];
    var isRetweeted = tweet['retweeted'];
    if(this.mediaCheck(tweet)){
        if(this.retweetCheck(tweet)){
            this.twitRest.queueRetweet(tweetId);
        }
        if(this.favoriteCheck(tweet)){
            this.twitRest.queueFavorite(tweetId);
        }
    }
}

TwitStream.prototype.mediaCheck = function(tweet){
    if(this.mediaOnly){
        if(!_.has(tweet, 'extended_entities.media')){
            return false;
        }
    }
    return true;
}

TwitStream.prototype.retweetCheck = function(tweet){
    var tweetAuthor = tweet['user'];
    var tweetAuthorId = tweetAuthor['id_str'];
    debug("rtcheck: %s", tweetAuthorId);
    if(this.retweets){
        if(tweet['retweeted'] !== true && _.includes(this.follows, tweetAuthorId)){
            return true;
        }
    }
    return false;
}

TwitStream.prototype.favoriteCheck = function(tweet){
    var tweetAuthor = tweet['user'];
    var tweetAuthorId = tweetAuthor['id_str'];
    if(this.favorites){
        if(tweet['favorited'] !== true && _.includes(this.follows, tweetAuthorId)){
            return true;
        }
    }
    return false;
}

module.exports = TwitStream;