const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Chunk = sequelize.define('Chunk', {
  documentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  chunkText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  additionalParam: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  openAIData: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

sequelize.sync();

module.exports = { Chunk, sequelize };