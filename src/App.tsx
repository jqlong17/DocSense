import React, { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import AnalysisPanel from './components/AnalysisPanel';

function App() {
  const [documents, setDocuments] = useState<File[]>([]);

  const handleUpload = (files: FileList) => {
    setDocuments(Array.from(files));
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 border-r">
        <ChatPanel documents={documents} onUpload={handleUpload} />
      </div>
      <div className="w-2/3 p-4">
        <AnalysisPanel documents={documents} />
      </div>
    </div>
  );
}

export default App;