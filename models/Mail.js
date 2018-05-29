var mongoose = require('mongoose');
var MailSchema = new mongoose.Schema({
          msg: String,
          pic: String,
                                     },
          {collection :'Mail'}                          
                                     );


module.exports = mongoose.model('Mail',MailSchema);
