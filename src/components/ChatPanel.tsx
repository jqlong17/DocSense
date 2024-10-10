import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { callAI } from '../services/aiService';

interface ChatPanelProps {
  documents: File[];
}

const ChatPanel: React.FC<ChatPanelProps> = ({ documents }) => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const newMessages = [...messages, { text: input, isUser: true }];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      try {
        const aiMessages = newMessages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant' as 'user' | 'assistant',
          content: msg.text
        }));

        const response = await callAI([
          { role: 'system', content: '你是一个有帮助的助手，正在分析用户上传的文档。' },
          ...aiMessages
        ]);

        setMessages(prevMessages => [...prevMessages, { text: response, isUser: false }]);
      } catch (error) {
        let errorMessage = '抱歉，处理您的请求时出现了错误。';
        if (error instanceof Error) {
          errorMessage = `错误: ${error.message}`;
        }
        console.error('AI响应错误:', error);
        setMessages(prevMessages => [...prevMessages, { text: errorMessage, isUser: false }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow border rounded-l px-2 py-1"
          placeholder="输入消息..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          className={`px-4 py-2 rounded-r ${isLoading ? 'bg-gray-400' : 'bg-blue-500'} text-white`}
          disabled={isLoading}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;