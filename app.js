/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    request = require('request'),
    cfenv = require('cfenv'),
    fs = require('fs'),
    request = require('request'),
    xhr = require('xhr'),
    SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');





var vcapLocal = null;
var appEnv = null;
var appEnvOpts = {};



var app = express();
var db;

var cloudant;

var fileToUpload;

var dbname = "materiais";
var database;


var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));


app.get('/', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    res.render('index.html');
})





fs.stat('./vcap-local.json', function (err, stat) {
    if (err && err.code === 'ENOENT') {
        // file does not exist
        console.log('No vcap-local.json');
        initializeAppEnv();
    } else if (err) {
        console.log('Error retrieving local vcap: ', err.code);
    } else {
        vcapLocal = require("./vcap-local.json");
        console.log("Loaded local VCAP", vcapLocal);
        appEnvOpts = {
            vcap: vcapLocal
        };
        initializeAppEnv();
    }
});


// get the app environment from Cloud Foundry, defaulting to local VCAP
function initializeAppEnv() {
    appEnv = cfenv.getAppEnv(appEnvOpts);
    if (appEnv.isLocal) {
        require('dotenv').load();
    }
    if (appEnv.services.cloudantNoSQLDB) {
        initCloudant();
    } else {
        console.error("No Cloudant service exists.");
    }
}


function initCloudant() {
    var cloudantURL = appEnv.services.cloudantNoSQLDB[0].credentials.url || appEnv.getServiceCreds("gerdau-cloudantNoSQLDB").url;
    var Cloudant = require('cloudant')({
        url: cloudantURL,
        plugin: 'retry',
        retryAttempts: 10,
        retryTimeout: 500
    });
    // Create the accounts Logs if it doesn't exist
    Cloudant.db.create(dbname, function (err, body) {
        if (err && err.statusCode == 412) {
            console.log("Database already exists: ", dbname);
        } else if (!err) {
            console.log("New database created: ", dbname);
        } else {
            console.log('Cannot create database!');
        }
    });
    database = Cloudant.db.use(dbname);
}




app.post('/speech', multipartMiddleware, function (req, res) {

    // console.log(req.files.file);
    var audio = req.files.file;
    var model = "pt-BR_BroadbandModel";

        fs.readFile(audio.path, (err, data) => {


            fs.writeFile('audio.wav', data);

            var speech_to_text = new SpeechToTextV1({
                username: '3f50b4c8-403d-4a55-b6cc-9c86264ec80a',
                password: 'Ba6rsyJURj11'
            });

            var files = ['audio.wav'];
            for (var file in files) {
                var params = {
                    audio: fs.createReadStream(files[file]),
                    content_type: 'audio/wav',
                    model: model,
                    timestamps: true,
                    word_alternatives_threshold: 0.9,
                    keywords: ['colorado'],
                    keywords_threshold: 0.5
                };

                speech_to_text.recognize(params, function (error, transcript) {
                    if (error)
                        console.log('Error:', error);
                    else
                        var translated = (transcript['results'][0]['alternatives'][0]['transcript'] != null) ? transcript['results'][0]['alternatives'][0]['transcript'] : null;
                    res.send((translated));
                    console.log((translated));
                });
            }
        })
});









http.createServer(app).listen(app.get('port'), '0.0.0.0', function () {
    console.log('Express server listening on port ' + app.get('port'));
});