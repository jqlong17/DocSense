import React, { useState } from 'react';

interface AnalysisPanelProps {
  documents: File[];
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ documents }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: '摘要' },
    { id: 'keywords', label: '关键词' },
    { id: 'sentiment', label: '情感分析' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 ${
              activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {activeTab === 'summary' && (
          <div>
            <h2 className="text-xl font-bold mb-4">文档摘要</h2>
            {documents.length > 0 ? (
              <ul>
                {documents.map((doc, index) => (
                  <li key={index}>{doc.name}</li>
                ))}
              </ul>
            ) : (
              <p>没有上传的文档</p>
            )}
          </div>
        )}
        {activeTab === 'keywords' && (
          <div>
            <h2 className="text-xl font-bold mb-4">关键词分析</h2>
            <p>这里将显示文档的关键词分析结果</p>
          </div>
        )}
        {activeTab === 'sentiment' && (
          <div>
            <h2 className="text-xl font-bold mb-4">情感分析</h2>
            <p>这里将显示文档的情感分析结果</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;