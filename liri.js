//env
require("dotenv").config();

//requires
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var cmd = require('node-cmd');
var fs = require('fs');
var keys = require('./keys.js');

//api keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//global variables
var reset = '\x1b[0m';
var green = '\x1b[32m';

//twitter
if (process.argv[2] === 'my-tweets') {
    var params = { screen_name: 'BlakeMa25421763' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            var tweetCount = tweets.length;
            if (tweetCount < 20) {
                for (var i = 0; i < tweetCount; i++) {
                    console.log(green + 'Tweet ' + (i + 1) + ': ' + reset + tweets[i].text);
                }
            } else {
                for (var i = 0; i < 20; i++) {
                    if (typeof tweets[i].text != 'undefined') console.log(tweets[i].text);
                }
            }
        }
    });
}

//spotify
if (process.argv[2] === 'spotify-this-song') {
    var track = process.argv[3];
    if (track === undefined) {
        spotify
            .request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
            .then(function (data) {
                console.log(green + 'Artist   --  ' + reset + data.artists[0].name);
                console.log(green + 'Name     --  ' + reset + data.name);
                console.log(green + 'Preview  --  ' + reset + data.preview_url);
                console.log(green + 'Album    --  ' + reset + data.album.name);
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
    } else {
        spotify.search({ type: 'track', query: track, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
                console.log(green + 'Artist   --  ' + reset + data.tracks.items[0].artists[i].name);
            }
            console.log(green + 'Name     --  ' + reset + data.tracks.items[0].name);
            console.log(green + 'Preview  --  ' + reset + data.tracks.items[0].preview_url);
            console.log(green + 'Album    --  ' + reset + data.tracks.items[0].album.name);

        });
    }
}

//OMDB
if (process.argv[2] === 'movie-this') {
    var movie = process.argv[3];
    if (movie === undefined) movie = 'Mr. Nobody';
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + movie, function(err, res, body) {
        var body = JSON.parse(body);
        console.log(green + 'Title        --  ' + reset + body.Title);
        console.log(green + 'Year         --  ' + reset + body.Year);
        console.log(green + 'IMDB Rating  --  ' + reset + body.Ratings[0].Value);
        if (body.Ratings.length > 1) console.log(green + 'RT Rating    --  ' + reset + body.Ratings[1].Value);
        console.log(green + 'Country      --  ' + reset + body.Country);
        console.log(green + 'Language     --  ' + reset + body.Language);
        console.log(green + 'Plot         --  ' + reset + body.Plot);
        console.log(green + 'Actors       --  ' + reset + body.Actors);
    })
}

//random.txt as arguments
if (process.argv[2] === 'do-what-it-says') {
    fs.readFile('./random.txt', 'utf-8', (err, data) => {
        data = data.split(',');
        var argv3 = data[0];
        var argv4 = data[1];
        cmd.get('node liri.js ' + argv3 + ' ' + argv4, (err, data) => {
                console.log(data);
            });
    })
}