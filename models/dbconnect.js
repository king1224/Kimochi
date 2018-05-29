var mongoose = require('mongoose');
mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://uidd2018_groupH:71222217@127.0.0.1:27017/uidd2018_groupH')
        .then(() => console.log('connection successful'))
        .catch((err) => console.error(err));
