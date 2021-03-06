var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
          name: String,
          password: String,
          mails:{
            userPost:[{mail_id:String}],
            userGet:[{
              mail_id:String,
              isread: Boolean,
              islike: Boolean,
              iscollect: Boolean,
              time:Date
            }],
            unrecv:[{
              mail_id:String,
              isread: Boolean,
              islike: Boolean,
              iscollect: Boolean,
              time:Date
            }]
          }
                                     },
          {collection :'User'}                          
                                     );


module.exports = mongoose.model('User',UserSchema);
