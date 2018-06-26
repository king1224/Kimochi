var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
          name: String,
          password: String,
          mails:{
            userPost:[{mail_id:String}],
            userGet:[{
              mail_id:String,
              isread: Boolean,
              time:Date
            }],
            unrecv:[{
              mail_id:String,
              isread: Boolean,
              time:Date
            }]
          }
                                     },
          {collection :'Usertest'}                          
                                     );


module.exports = mongoose.model('Usertest',UserSchema);
