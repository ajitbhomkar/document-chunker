# Document Chunking and Processing Application

## Overview

This project is a document chunking and processing application. It allows users to upload documents, split them into chunks, optionally send these chunks to the OpenAI API for processing, and then store the chunks in a database. The project consists of a backend server built with Node.js and Express, and a frontend built with React.

## Project Structure

- **Backend**:
  - **server.js**: Main server file that handles file uploads, chunking, and storing chunks in the database.
  - **chunking.js**: Contains the logic for splitting documents into chunks.
  - **models.js**: Defines the Sequelize models for the database.
  - **database.js**: Contains functions for saving and retrieving chunks from the database.

- **Frontend**:
  - **FileUpload.tsx**: React component for uploading files.
  - **DocumentViewer.tsx**: React component for viewing the chunks of a document.
  - **FileUpload.css**: CSS file for styling the file upload component.
  - **DocumentViewer.css**: CSS file for styling the document viewer component.

## Run the server:
node server.js

## Navigate to the frontend directory:
cd ../document-chunker

## Install dependencies:
npm install

## Run the frontend application:

npm start



## Usage
Upload a Document:

Navigate to the file upload page.
Select a file to upload.
Set the chunk size and chunk overlap.
Optionally, choose to send the chunks to OpenAI for processing.
Click the upload button.
View Document Chunks:


## Code Explanation
Backend
server.js: Handles file uploads, validates chunk parameters, reads the file content, splits it into chunks, optionally sends chunks to OpenAI, and stores the chunks in the database.
chunking.js: Uses the RecursiveCharacterTextSplitter from the langchain library to split the document text into chunks.
models.js: Defines the Sequelize models for the Document and Chunk tables.
Frontend
FileUpload.tsx: Provides a file upload interface, allows users to set chunk parameters, and handles the file upload process.
DocumentViewer.tsx: Fetches and displays the chunks of a document, with pagination controls for navigating through the chunks.



