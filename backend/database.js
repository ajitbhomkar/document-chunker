// database.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Document = sequelize.define('Document', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  upload_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

const Chunk = sequelize.define('Chunk', {
  document_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  chunk_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  chunk_parameters: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

async function saveChunks(filename, chunks) {
  await sequelize.sync();
  const document = await Document.create({ filename });
  for (const chunk of chunks) {
    await Chunk.create({
      document_id: document.id,
      chunk_text: chunk.text,
      chunk_parameters: chunk.parameters,
    });
  }
}

async function getChunks() {
  return await Chunk.findAll();
}

module.exports = { saveChunks, getChunks };