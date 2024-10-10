import React, { useState, ChangeEvent } from 'react';
import { Send, Upload } from 'lucide-react';
import { callAI, Message as AIMessage, ModelType } from '../services/aiService';

// 删除这行，因为我们已经从 aiService 导入了 ModelType
// type ModelType = 'moonshot-v1-8k' | 'moonshot-v1-32k' | 'moonshot-v1-128k' | 'moonshot-v1-auto';

interface ChatPanelProps {
  documents: File[];
  onUpload: (files: FileList) => void;
}

interface Message {
  text: string;
  isUser: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ documents, onUpload }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>('moonshot-v1-8k');

  // handleSend 函数保持不变

  const handleModelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value as ModelType;
    console.log('[User Action] 用户切换模型:', newModel);
    setSelectedModel(newModel);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log('[User Action] 用户上传文件:', e.target.files);
      onUpload(e.target.files);
      // 添加上传成功的提示
      setMessages(prev => [...prev, { text: "文件上传成功！", isUser: false }]);
    }
  };

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      console.log('[User Action] 用户发送消息:', input);
      const newMessages = [...messages, { text: input, isUser: true }];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      try {
        console.log('[Chat Panel] 准备调用 AI');
        const aiMessages: AIMessage[] = newMessages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }));

        console.log('[Chat Panel] 选择的模型:', selectedModel);
        const response = await callAI([
          { role: 'system', content: '你是一个有帮助的助手，正在分析用户上传的文档。' },
          ...aiMessages
        ], selectedModel);

        console.log('[Chat Panel] AI 响应:', response);
        setMessages(prev => [...prev, { text: response, isUser: false }]);
      } catch (error) {
        console.error('[Chat Panel] AI 响应错误:', error);
        let errorMessage = '抱歉，处理您的请求时出现了错误。';
        if (error instanceof Error) {
          errorMessage = `错误: ${error.message}`;
        }
        setMessages(prev => [...prev, { text: errorMessage, isUser: false }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 消息显示区域保持不变 */}
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      
      {/* 输入区域和按钮 */}
      <div className="flex mb-2">
        <input
          type="text"
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          className="flex-grow border rounded-l px-2 py-1"
          placeholder="输消息..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          className={`px-4 py-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'} text-white`}
          disabled={isLoading}
        >
          <Send size={20} />
        </button>
      </div>
      
      {/* 新增的上传和模型选择区域 */}
      <div className="flex justify-between items-center">
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            multiple
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded"
          >
            <Upload size={20} className="mr-2" />
            上传文档
          </label>
        </div>
        <select
          value={selectedModel}
          onChange={handleModelChange}
          className="px-4 py-2 border rounded"
        >
          <option value="moonshot-v1-8k">Moonshot v1 8k</option>
          <option value="moonshot-v1-32k">Moonshot v1 32k</option>
          <option value="moonshot-v1-128k">Moonshot v1 128k</option>
          <option value="moonshot-v1-auto">Moonshot v1 Auto</option>
          <option value="GPT-3.5">OpenAI GPT-3.5</option>
          <option value="claude-v1">Anthropic Claude</option>
          <option value="PaLM2">Google PaLM2</option>
          <option value="Mistral">Mistral</option>
          <option value="ByteDance-DouBao">ByteDance DouBao</option>
          <option value="Baidu-ERNIE">Baidu ERNIE</option>
          <option value="Aliyun-QianWen">Aliyun QianWen</option>
          <option value="iFlytek-XingHuo">iFlytek XingHuo</option>
          <option value="Zhipu-ChatGLM">Zhipu ChatGLM</option>
          <option value="Qihoo-ZhiNao">Qihoo ZhiNao</option>
          <option value="Tencent-HunYuan">Tencent HunYuan</option>
          <option value="Moonshot-Kimi">Moonshot Kimi</option>
        </select>
      </div>
    </div>
  );
};

export default ChatPanel;