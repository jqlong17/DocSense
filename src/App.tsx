import React, { useState } from 'react';
import { Upload, MessageSquare, Settings } from 'lucide-react';
import ChatPanel from './components/ChatPanel';
import AnalysisPanel from './components/AnalysisPanel';

function App() {
  const [documents, setDocuments] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setDocuments(Array.from(event.target.files));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 左侧面板 */}
      <div className="w-1/3 p-4 bg-white shadow-md">
        <div className="mb-4">
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center">
            <Upload className="mr-2" size={20} />
            上传文档
          </label>
          <input id="file-upload" type="file" multiple onChange={handleFileUpload} className="hidden" />
        </div>
        <ChatPanel documents={documents} />
      </div>

      {/* 右侧面板 */}
      <div className="w-2/3 p-4">
        <AnalysisPanel documents={documents} />
      </div>
    </div>
  );
}

export default App;