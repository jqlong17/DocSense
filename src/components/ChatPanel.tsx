import React, { useState, ChangeEvent } from 'react';
import { callAI, Message as AIMessage, ModelType } from '../services/aiService';
import { Send, Upload, Trash } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatPanelProps {
  documents: File[];
  onUpload: (files: FileList) => void;
  onFilesChange: (files: string[]) => void; // 新增回调函数
}

const ChatPanel: React.FC<ChatPanelProps> = ({ documents, onUpload, onFilesChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelType>('moonshot-v1-8k');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleModelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value as ModelType;
    console.log('[User Action] 用户切换模型:', newModel);
    setSelectedModel(newModel);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log('[User Action] 用户上传文件:', e.target.files);
      onUpload(e.target.files);
      setUploadStatus('上传中...');

      Array.from(e.target.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target?.result as string;
          setFileContents((prev) => {
            const newContents = [...prev, fileContent];
            onFilesChange(newContents); // 更新文件内容
            return newContents;
          });
          setUploadedFiles((prev) => [...prev, file]);
          setUploadStatus('上传成功！');
          setMessages((prev) => [...prev, { role: 'system', content: `文件 ${file.name} 上传成功！` }]);
          setTimeout(() => setUploadStatus(null), 3000);
        };
        reader.onerror = () => {
          setUploadStatus('上传失败');
        };
        reader.readAsText(file); // 确保读取文件内容
      });
    }
  };

  const handleDeleteFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setFileContents((prev) => {
      const newContents = prev.filter((_, i) => i !== index);
      onFilesChange(newContents); // 更新文件内容
      return newContents;
    });
  };

  const handleSend = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: AIMessage = { role: 'user', content: inputValue };
    const combinedMessages = [
      ...fileContents.map(content => ({ role: 'system', content })),
      ...messages,
      userMessage
    ];

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await callAI(combinedMessages, selectedModel);
      const aiMessage: AIMessage = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI 响应错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded">
            <span>{file.name}</span>
            <button onClick={() => handleDeleteFile(index)} className="text-red-500">
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <strong>{msg.role === 'user' ? '用户' : 'AI'}:</strong>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
        {uploadStatus && <div className="text-center">{uploadStatus}</div>}
      </div>
      
      <div className="flex mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          className="flex-grow border rounded-l px-2 py-1"
        />
        <button 
          onClick={handleSend} 
          className={`px-4 py-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'} text-white`}
          disabled={isLoading}
        >
          <Send size={20} />
        </button>
      </div>
      
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
