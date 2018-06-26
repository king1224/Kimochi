var mongoose = require('mongoose');
var MailSchema = new mongoose.Schema({
          msg: String,
          pic: String,
          },
          {collection :'Mailtest'}                          
);


module.exports = mongoose.model('Mailtest',MailSchema);
