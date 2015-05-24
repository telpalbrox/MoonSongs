// server.js
console.log('loading server...');
// configurando todas las herramientas necesarias
var express = require('express'); // libreria encargada de gestionar peticiones http
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose'); // libreria encargada de conecar con la base de datos MongoDB
var bodyParser = require('body-parser'); // libreria para recibir json
var cors = require('cors');
var fs = require('fs');
var log4js = require('log4js');

log4js.configure('config/log4js.json', {});
var expressLogger = log4js.getLogger('express');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');

if(process.env.NODE_ENV === 'test') {
  // log4js.clearAppenders();
}

// configurando bd
var configDB = require('./config/database.js');
mongoose.connect(configDB.url, function(err) {
  if (err) {
    errorLogger.error('[Could not connect to MongoDB!] | ' +
    '[Error: ' + err + ']');
    process.exit(1);
  }
});

var connect = require('connect');

// configurando herramientas de la libreria express
// if(process.env.NODE_ENV != 'test') app.use(morgan('dev')); // registra cada peticion a la consola
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());
app.use(log4js.connectLogger(expressLogger, { level: 'auto' }));



// configurando modelos
require('./app/models/song');
require('./app/models/user');

// configurando direcciones
require('./app/routes.js')(app);
require('./config/updatedatabase.js')(fs);

// lanzando servidor
app.listen(port);

// Expose app
exports = module.exports = app;

mainLogger.trace('MoonSongs is up, listening on port: ' + port);
