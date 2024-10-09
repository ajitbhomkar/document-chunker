require('dotenv').config();

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const { Chunk, sequelize } = require('./models');
const { chunkDocument } = require('./chunking'); // Import the chunking module

const app = express();
const port = 8000;

// Enable CORS
app.use(cors());

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const chunkSize = parseInt(req.body.chunkSize, 10);
    const chunkOverlap = parseInt(req.body.chunkOverlap, 10);
    const additionalParam = req.body.additionalParam;
    const sendToOpenAI = req.body.sendToOpenAI === 'true';

    // Validate chunkSize and chunkOverlap
    if (chunkOverlap >= chunkSize) {
      return res.status(400).json({ error: "chunkOverlap must be less than chunkSize" });
    }

    const content = fs.readFileSync(file.path, 'utf-8');

    // Use LangChain to split the text into chunks
    const chunks = await chunkDocument(content, { chunkSize, chunkOverlap }); // Await the promise
    console.log(chunks, "chunks");
    console.log(Array.isArray(chunks), "Array.isArray(chunks)");

    if (!Array.isArray(chunks)) {
      return res.status(500).json({ error: "Failed to split text into chunks" });
    }

    for (let chunk of chunks) {
      let openAIData = null;

      // Optionally send chunk to OpenAI
      if (sendToOpenAI) {
        console.log('Sending chunk to OpenAI:', chunk);
        try {
          const openAIResponse = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003', // Specify the model here
            prompt: chunk,
            max_tokens: 50
          }, {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
          });
          openAIData = openAIResponse.data;
        } catch (error) {
          console.error('Error sending chunk to OpenAI:', error);
        }
      }

      await Chunk.create({ documentId: file.filename, chunkText: chunk, additionalParam, openAIData });
    }

    res.json({ filename: file.filename, chunks: chunks.length });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/chunks/:documentId', async (req, res) => {
  const documentId = req.params.documentId;
  try {
    const chunks = await Chunk.findAll({ where: { documentId } });
    res.json(chunks);
  } catch (error) {
    console.error('Error fetching chunks:', error);
    res.status(500).json({ error: 'Error fetching chunks' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});