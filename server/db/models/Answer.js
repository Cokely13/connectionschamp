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
});

module.exports = Answer;
