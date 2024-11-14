const db = require('./db');


const Answer = require('./models/Answer');
const Message = require('./models/Message');
const User = require('./models/User');

// Associations:

Message.belongsTo(User);
User.hasMany(Message);



User.hasMany(Answer)
Answer.belongsTo(User)



module.exports = {
  db,
  models: {
    User,
    Answer,
    Message
  },
};
