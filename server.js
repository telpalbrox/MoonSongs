// server.js
console.log('loading server...');
// configurando todas las herramientas necesarias
var express = require('express'); // libreria encargada de gestionar peticiones http
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose'); // libreria encargada de conecar con la base de datos MongoDB
var morgan = require('morgan'); // libreria para registrar las peticiones http
var bodyParser = require('body-parser'); // libreria para recibir json
var cors = require('cors');
var fs = require('fs');

// configurando bd
var configDB = require('./config/database.js');
mongoose.connect(configDB.url, function(err) {
  if (err) {
    console.error('Could not connect to MongoDB!');
    console.error(err);
    process.exit(1);
  }
});

var connect = require('connect');
var serveStatic = require('serve-static');

// configurando herramientas de la libreria express
if(process.env.NODE_ENV != 'test') app.use(morgan('dev')); // registra cada peticion a la consola
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

var qt = require('quickthumb');
app.use('/private/music', qt.static(__dirname + '/music')); // Use quickthumb

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

console.log('The magic happens on port ' + port);
