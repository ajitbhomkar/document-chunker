const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter'); // Adjust the path as needed

async function chunkDocument(text, parameters) {
  const { chunkSize, chunkOverlap } = parameters;
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });
  const chunks = await splitter.splitText(text); // Await the promise
  console.log(chunks, "chunks in chunkDocument");
  return chunks;
}

module.exports = { chunkDocument };