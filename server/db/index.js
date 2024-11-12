const db = require('./db');


const Answer = require('./models/Answer');
const UserScore = require('./models/UserScore');

const User = require('./models/User');

// Associations:



// Associations between User and UserScore
User.hasMany(UserScore);
UserScore.belongsTo(User);



module.exports = {
  db,
  models: {
    User,
    Answer,
    UserScore,
  },
};
