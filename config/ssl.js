const fs = require('fs');

//ssl license

var keyPath = './ssl/private.key';
var certPath = './ssl/certificate.crt';
//var caPath = './ssl/ca_bundle.crt';

var hskey = fs.readFileSync(keyPath);
var hscert = fs.readFileSync(certPath);
//var cabun = fs.readFileSync(caPath);

var options = {
   //     ca:cabun,
        key: hskey,
        cert: hscert
               };

//ssl object

var ssl = {};

ssl.options = options;

module.exports = ssl;
