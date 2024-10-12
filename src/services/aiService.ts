import axios from 'axios';

// API配置
const API_URL = '/v1/chat/completions';
const API_KEY = import.meta.env.VITE_AI_API_KEY; // 使用环境变量

// 增加日志，检查API_KEY和API_URL是否正确加载
console.log('Loaded API Key:', API_KEY ? 'Loaded' : 'Not Loaded');
console.log('Request URL:', API_URL);

// 消息接口定义
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 支持的AI模型类型
export type ModelType = 
  | 'moonshot-v1-8k'
  | 'moonshot-v1-32k'
  | 'moonshot-v1-128k'
  | 'moonshot-v1-auto'
  | 'GPT-3.5'
  | 'claude-v1'
  | 'PaLM2'
  | 'Mistral'
  | 'ByteDance-DouBao'
  | 'Baidu-ERNIE'
  | 'Aliyun-QianWen'
  | 'iFlytek-XingHuo'
  | 'Zhipu-ChatGLM'
  | 'Qihoo-ZhiNao'
  | 'Tencent-HunYuan'
  | 'Moonshot-Kimi';

// 调用AI的函数
export async function callAI(messages: Message[], model: ModelType) {
  try {
    console.log('[API Call] 开始调用 AI');
    const response = await axios.post(API_URL, {
      model,
      messages,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      timeout: 60000 // 增加超时时间
    });

    console.log('[API Call] AI 调用成功:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[API Call] 调用 AI 时发生错误:', error);
      console.error('[API Call] 请求配置:', error.config);
      console.error('[API Call] 请求详情:', error.request);
      console.error('[API Call] 响应详情:', error.response ? error.response.data : '无响应');
    } else {
      console.error('[API Call] 未知错误:', error);
    }
    throw error;
  }
}
