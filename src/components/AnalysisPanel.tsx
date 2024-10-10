import React, { useState, useEffect } from 'react';
import { Settings, Plus } from 'lucide-react';
import { callAI } from '../services/aiService';

interface AnalysisPanelProps {
  documents: File[];
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ documents }) => {
  const [tabs, setTabs] = useState([
    { id: 1, title: '摘要', prompt: '请总结文档的主要内容。' },
    { id: 2, title: '关键点', prompt: '请列出文档中的关键点。' },
    { id: 3, title: '问题', prompt: '请根据文档内容提出一些可能的问题。' },
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [analysisResults, setAnalysisResults] = useState<{[key: number]: string}>({});

  useEffect(() => {
    if (documents.length > 0) {
      analyzeDocuments();
    }
  }, [documents]);

  const analyzeDocuments = async () => {
    const results: {[key: number]: string} = {};
    for (const tab of tabs) {
      try {
        const result = await callAI([
          { role: 'system', content: '你是一个文档分析助手。' },
          { role: 'user', content: `${tab.prompt}\n\n文档内容：[这里应该是文档内容，目前我们还没有实现文档内容的读取]` }
        ]);
        results[tab.id] = result;
      } catch (error) {
        console.error(`分析标签 "${tab.title}" 时出错:`, error);
        results[tab.id] = '分析过程中出现错误。';
      }
    }
    setAnalysisResults(results);
  };

  const addNewTab = () => {
    const newTab = {
      id: tabs.length + 1,
      title: `新标签 ${tabs.length + 1}`,
      prompt: '请分析文档内容。',
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-md rounded-lg">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {tab.title}
          </button>
        ))}
        <button onClick={addNewTab} className="px-4 py-2 bg-gray-200">
          <Plus size={20} />
        </button>
      </div>
      <div className="flex-grow p-4">
        {documents.length === 0 ? (
          <div className="text-center text-gray-500">请上传文档以开始分析</div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{tabs.find((tab) => tab.id === activeTab)?.title}</h2>
              <button className="bg-gray-200 p-2 rounded">
                <Settings size={20} />
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              {analysisResults[activeTab] || '正在分析...'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;