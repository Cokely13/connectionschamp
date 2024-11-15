const Sequelize = require('sequelize');
const db = require('../db');

const Answer = db.define('answer', {
  number: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  strikes: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  correct: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  }
},
  {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'number'],
      },
    ],
  }
);

module.exports = Answer;
