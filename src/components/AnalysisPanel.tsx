import React, { useState, useEffect, useRef } from 'react';
import { callAI, Message as AIMessage, ModelType } from '../services/aiService';
import ReactMarkdown from 'react-markdown';
import { Settings, Plus } from 'lucide-react';

interface AnalysisPanelProps {
  documents: File[];
  fileContents?: string[];
  selectedModel: ModelType;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ documents, fileContents = [], selectedModel }) => {
  const [prompts, setPrompts] = useState<Record<string, string>>({
    '标签': ''
  });
  const [activeTab, setActiveTab] = useState<string>(Object.keys(prompts)[0]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTabName, setNewTabName] = useState<string>(activeTab);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTime, setLoadingTime] = useState<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAIResponse = async (tab: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setLoadingTime(0);
    const interval = setInterval(() => setLoadingTime(prev => prev + 1), 1000);

    const prompt = prompts[tab];
    const messages: AIMessage[] = [
      ...fileContents.map(content => ({ role: 'system', content })),
      { role: 'user', content: prompt }
    ];
    console.log(`[AI Request] 发送到大模型的消息: ${JSON.stringify(messages, null, 2)}`);
    try {
      const response = await callAI(messages, selectedModel, abortController.signal);
      const content = response.choices[0].message.content;
      console.log(`[AI Response] ${tab} 返回的结果: ${content}`);
      // 不覆盖用户的 prompt
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(`Error fetching ${tab} data:`, error);
      }
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fileContents.length > 0) {
      Object.keys(prompts).forEach(fetchAIResponse);
    }
  }, [fileContents, prompts, selectedModel]);

  const handleSavePrompt = () => {
    if (documents.length === 0) {
      console.log('保存操作取消：没有文档加载。');
      setIsModalOpen(false);
      return;
    }

    if (newTabName.trim() !== '' && newTabName !== activeTab) {
      setPrompts(prev => {
        const updatedPrompts = { ...prev };
        updatedPrompts[newTabName] = updatedPrompts[activeTab];
        delete updatedPrompts[activeTab];
        return updatedPrompts;
      });
      setActiveTab(newTabName);
    }

    console.log('保存操作执行：调用大模型。');
    fetchAIResponse(newTabName || activeTab);
    setIsModalOpen(false);
    setNewTabName('');
  };

  const handleAddTab = () => {
    const newTab = `标签${Object.keys(prompts).length + 1}`;
    setPrompts(prev => ({ ...prev, [newTab]: '' }));
    setActiveTab(newTab);
  };

  const handleDeleteTab = (tab: string) => {
    if (Object.keys(prompts).length > 1) {
      setPrompts(prev => {
        const updatedPrompts = { ...prev };
        delete updatedPrompts[tab];
        return updatedPrompts;
      });
      setActiveTab(Object.keys(prompts).filter(t => t !== tab)[0]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center border-b">
        <div className="flex">
          {Object.keys(prompts).map((tab) => (
            <div key={tab} className="flex items-center relative group">
              <button
                className={`px-6 py-2 ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab(tab)}
                data-testid={`tab-button-${tab}`}
              >
                {tab}
              </button>
              {Object.keys(prompts).length > 1 && (
                <button
                  onClick={() => handleDeleteTab(tab)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button onClick={handleAddTab} className="p-2 text-green-500">
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center p-2">
        <button onClick={() => setIsModalOpen(true)} className="p-2" data-testid="settings-button">
          <Settings size={20} />
          设置
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4" data-testid="content-area">
        {loading ? (
          <div>AI分析中...({loadingTime}s)</div>
        ) : (
          <ReactMarkdown>{prompts[activeTab]}</ReactMarkdown>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" data-testid="modal-overlay">
          <div className="bg-white p-4 rounded shadow-lg w-[36rem]" data-testid="settings-dialog">
            <h2 className="text-lg font-bold mb-2">配置预设提示</h2>
            <textarea
              value={prompts[activeTab]}
              onChange={(e) => setPrompts(prev => ({ ...prev, [activeTab]: e.target.value }))}
              className="border p-2 w-full h-[12rem] mb-4 text-left align-top"
              placeholder="输入预设提示..."
              data-testid="prompt-input"
            />
            <input
              type="text"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              className="border p-2 w-full mb-4"
              placeholder="输入新的标签名称..."
              data-testid="tab-name-input"
            />
            <div className="flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded mr-2" data-testid="cancel-button">
                取消
              </button>
              <button onClick={handleSavePrompt} className="px-4 py-2 bg-blue-500 text-white rounded" data-testid="save-button">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
