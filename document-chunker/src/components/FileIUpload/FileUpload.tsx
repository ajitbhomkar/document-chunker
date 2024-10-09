import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './FileUpload.css'; // Import the CSS file

const FileUpload: React.FC<{ onUploadComplete: (documentId: string) => void }> = ({ onUploadComplete }) => {
  const [chunkSize, setChunkSize] = useState(1000); // Example value
  const [chunkOverlap, setChunkOverlap] = useState(200); // Example value
  const [sendToOpenAI, setSendToOpenAI] = useState(true); // Example value

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles, "acceptedFiles"); // Debugging: Check acceptedFiles

    if (acceptedFiles.length === 0) {
      console.error("No files were accepted.");
      return;
    }

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('chunkSize', chunkSize.toString());
    formData.append('chunkOverlap', chunkOverlap.toString());
    formData.append('sendToOpenAI', sendToOpenAI.toString()); // Include sendToOpenAI

    // Log the contents of the FormData object
    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(key, value);
    });

    axios.post('http://localhost:8000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      console.log(response.data, "response data");
      onUploadComplete(response.data.filename);
    }).catch(error => {
      console.error(error);
    });
  }, [chunkSize, chunkOverlap, sendToOpenAI, onUploadComplete]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="file-upload-container">
      <div className="form-group">
        <label htmlFor="chunkSize">Chunk Size</label>
        <input
          type="number"
          id="chunkSize"
          value={chunkSize}
          onChange={(e) => setChunkSize(Number(e.target.value))}
          placeholder="Chunk Size"
        />
      </div>
      <div className="form-group">
        <label htmlFor="chunkOverlap">Chunk Overlap</label>
        <input
          type="number"
          id="chunkOverlap"
          value={chunkOverlap}
          onChange={(e) => setChunkOverlap(Number(e.target.value))}
          placeholder="Chunk Overlap"
        />
      </div>
      <div className="form-group">
        <input
          type="checkbox"
          id="sendToOpenAI"
          checked={sendToOpenAI}
          onChange={(e) => setSendToOpenAI(e.target.checked)}
        />
        <label htmlFor="sendToOpenAI">Send to OpenAI</label>
      </div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & drop a file here, or click to select one</p>
      </div>
    </div>
  );
};

export default FileUpload;