// app/routes/uploads.routes.js
console.log('loading uploads routes...');

var uploads = require('../controllers/uploads.controller.js');
var multer = require('multer');
var jwtauth = require('../middleware/jwtauth');

module.exports = function(app) {
  app.use(multer({
    dest: './uploads/',
    onFileUploadComplete: function(file) {
      console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
  }));

  app.route('/api/upload')
    .post(jwtauth.allowUserType('canUpload'), uploads.upload);
};
