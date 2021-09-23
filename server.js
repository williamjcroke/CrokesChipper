var express = require('express');
var fs = require('fs');
var os = require('os');
var https = require('https'); 
var http  = require('http');  
var platform = require('./routes/server_nodejs/platform.js');
var runtime = platform.configure(); 
var secrets  = require('./secrets.js');  

//DB init ----------

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var myCollections = {};
var mDB;

mDB = secrets.mongodb.connectionStr();

var db = MongoClient.connect(mDB, function(err, db) {
    if(err)
        throw err;
    console.log("connected to the mongoDB at: " + runtime.mongodb);

    myCollections.categories = db.collection('categories');
    myCollections.items = db.collection('items');
    myCollections.discounts = db.collection('discounts');
 
});

//--------------------

var compression = require('compression');
var toobusy = require('toobusy-js'); 
var bodyParser = require('body-parser'); 

var helmet = require('helmet');
var connectionListener = false;
var app = express();
app.use(compression());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(helmet());
				
app.use(function(req, res, next) {
  if (toobusy()) {
     res.status(503).send("<p><p>&nbsp&nbsp<h1>The server is busy, please try later, possibly in about 30 seconds.</h1>");
  } else {
    next();
  }
});

console.log(runtime);

if (runtime.isLocalHost) {  
		console.log("*** Using temp SSL keys on the nodejs server");
	 	var privateKey   = fs.readFileSync('ssl/test-key.pem');
	 	var certificate  = fs.readFileSync('ssl/test-cert.pem'); 

    var localCertOptions = { 
        key: privateKey, 
        cert: certificate, 
        requestCert: false, 
        rejectUnauthorized: false 
    }; 		
		

    https.createServer (localCertOptions, app).listen (runtime.port, function () { 
	   console.log(new Date().toISOString());
       console.log (runtime.architecture + ' server startup ok on port: ' + runtime.port); 

    }); 
		
 		
}   else {

    app.set('port', runtime.port);
    
    if (runtime.architecture === "bluemix")
    {
        app.listen(runtime.port, function() {
            
            console.log (runtime.architecture + ' server startup ok on port: ' + runtime.port); 
        }); 
    }
    else 
        if (runtime.architecture === "heroku")
    { 
        app.listen(runtime.port, function() {
            console.log (runtime.architecture + ' server startup ok on port: ' + runtime.port); 
        });             
    }       
}

//Server logging and use ----------

app.use(bodyParser.json());

app.enable('trust proxy');
 
app.use (function (req, res, next) {
        if (req.secure) {
                next();
        } else {
				console.log("redirecting from http to https");
                res.redirect('https://' + req.headers.host + req.url);
        }
});

app.use(
			"/",
			express.static(__dirname + '/_ngClient')
				); 
app.use(
			"/js_thirdparty",
			express.static(__dirname + '/js_thirdparty')  
				); 				

console.log(__dirname + '/_ngClient');

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next(); 
    }
});

//--------------------

//DB Functions --------------------

//CATEGORIES ---

function findCategories(cb) {
        myCollections.categories.find().toArray(cb);
    }
 
function getCategories(req, res, cb) {
    findCategories(function(err, results) {
     
    if(err)
        {
            console.log("error:");
            console.log(err.message);
            res.status(404);
            res.json({"error": err.message});
        } 

    res.status(200);
    res.json(results);  
    });
    }

app.get('/api/v1/categories', function(req, res) { 
  
    console.log('GET /api/items');
    
    getCategories(req,res);
});

app.post('/api/categories', function(req, res) { 
  
    console.log('POST /api/items');
 
    getCategories(req,res);
});

//ITEMS ---

function findItems(cb) {
        myCollections.items.find().toArray(cb);
    }
 
function getItems(req, res, cb) {
    findItems(function(err, results) {
     
    if(err)
        {
            console.log("error:");
            console.log(err.message);
            res.status(404);
            res.json({"error": err.message});
        } 

    res.status(200);
    res.json(results);  
    });
    }

app.get('/api/v1/items', function(req, res) { 
  
    console.log('GET /api/items');
    
    getItems(req,res);
});

app.post('/api/items', function(req, res) { 
  
    console.log('POST /api/items');
 
    getItems(req,res);
});


//SPECIALS ---

function findDiscounts(cb) {
        myCollections.discounts.find().toArray(cb);
    }
 
function getDiscounts(req, res, cb) {
    findDiscounts(function(err, results) {
     
    if(err)
        {
            console.log("error:");
            console.log(err.message);
            res.status(404);
            res.json({"error": err.message});
        } 
    
    res.status(200);
    res.json(results);  
    });
    }

app.get('/api/v1/discounts', function(req, res) { 
  
    console.log('GET /api/discounts');
    
    getDiscounts(req,res);
});

app.post('/api/discounts', function(req, res) { 
  
    console.log('POST /api/discounts');
 
    getDiscounts(req,res);
});

//Errors ----------

app.use(function(req, res, next) {
	console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
 
    var err = new Error('Route Not Found, are you using the correct http verb / is it defined?');
    err.status = 404;
		 
    next(err);
});

//--------------------