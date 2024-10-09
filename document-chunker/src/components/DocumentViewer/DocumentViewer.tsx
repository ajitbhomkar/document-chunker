import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DocumentViewer.css'; // Import the CSS file

interface Chunk {
  id: number;
  documentId: string;
  chunkText: string;
  openAIData?: any;
}

const DocumentViewer: React.FC<{ documentId: string }> = ({ documentId }) => {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const chunksPerPage = 10;

  useEffect(() => {
    if (documentId) {
      axios.get(`http://localhost:8000/chunks/${documentId}`)
        .then(response => {
          console.log(response.data, "data");
          setChunks(response.data);
          setCurrentPage(1); // Reset to first page on new fetch
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [documentId]);

  // Calculate the current chunks to display
  const indexOfLastChunk = currentPage * chunksPerPage;
  const indexOfFirstChunk = indexOfLastChunk - chunksPerPage;
  const currentChunks = chunks.slice(indexOfFirstChunk, indexOfLastChunk);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <table className="document-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Document Id</th>
            <th>Chunk Text</th>
            <th>OpenAI Data</th>
          </tr>
        </thead>
        <tbody>
          {currentChunks.map((chunk, index) => (
            <tr key={index}>
              <td>{chunk.id}</td>
              <td>{chunk.documentId}</td>
              <td>{chunk.chunkText}</td>
              <td>
                {chunk.openAIData && (
                  <pre>{JSON.stringify(chunk.openAIData, null, 2)}</pre>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(chunks.length / chunksPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DocumentViewer;