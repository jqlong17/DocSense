import React, { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import AnalysisPanel from './components/AnalysisPanel';

function App() {
  // 存储上传的文档
  const [documents, setDocuments] = useState<File[]>([]);
  const [fileContents, setFileContents] = useState<string[]>([]); // 新增状态

  // 处理文件上传
  const handleUpload = (files: FileList) => {
    console.log('[File Upload] 开始处理文件上传:', files);
    setDocuments(Array.from(files));
    console.log('[File Upload] 文件上传完成，当前文档列表:', documents);
  };

  // 处理文件内容更新
  const handleFilesChange = (files: string[]) => {
    setFileContents(files);
  };

  return (
    <div className="flex h-screen">
      {/* 左侧聊天面板 */}
      <div className="w-1/3 p-4 border-r" data-testid="chat-panel">
        <ChatPanel 
          documents={documents} 
          onUpload={handleUpload} 
          onFilesChange={handleFilesChange} // 传递回调函数
        />
      </div>
      {/* 右侧分析面板 */}
      <div className="w-2/3 p-4" data-testid="analysis-panel">
        <AnalysisPanel 
          documents={documents} 
          fileContents={fileContents} 
          selectedModel="moonshot-v1-8k" 
        />
      </div>
    </div>
  );
}

export default App;
