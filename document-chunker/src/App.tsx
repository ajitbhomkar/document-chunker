import React, { useState } from 'react';
import FileUpload from './components/FileIUpload/FileUpload';
import DocumentViewer from './components/DocumentViewer/DocumentViewer';


const App: React.FC = () => {
  const [documentId, setDocumentId] = useState<string | null>(null);

  const handleUploadComplete = (uploadedDocumentId: string) => {
    setDocumentId(uploadedDocumentId);
  };

  return (
    <div>
      <FileUpload onUploadComplete={handleUploadComplete} />
      {documentId && <DocumentViewer documentId={documentId} />}
    </div>
  );
};

export default App;