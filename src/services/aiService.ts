import axios from 'axios';

const API_URL = 'https://p33279i881.vicp.fun/v1/chat/completions';
const API_KEY = 'sk-hw8jl0AvZ3SoFFPZ6a103bC7C15943569fC66002437c7f09';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

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

export async function callAI(messages: Message[], model: ModelType = 'moonshot-v1-8k'): Promise<string> {
  console.log(`[API Call] 开始调用 AI 模型: ${model}`);
  console.log('[API Call] 发送的消息:', JSON.stringify(messages, null, 2));

  try {
    const payload = {
      model: model,
      messages: messages,
      stream: false
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    };

    console.log('[API Call] 发送请求到:', API_URL);
    console.log('[API Call] 请求头:', JSON.stringify(headers, null, 2));
    console.log('[API Call] 请求体:', JSON.stringify(payload, null, 2));
    console.time('API Response Time');
    
    const response = await axios.post(API_URL, payload, { 
      headers,
      timeout: 30000, // 设置30秒超时
    });
    
    console.timeEnd('API Response Time');

    if (response.status === 200) {
      console.log('[API Call] 成功接收响应');
      console.log('[API Call] 响应内容:', response.data.choices[0].message.content);
      return response.data.choices[0].message.content;
    } else {
      console.error(`[API Call] 请求失败: ${response.status} ${response.statusText}`);
      throw new Error(`请求失败：${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('[API Call] 调用 AI 时发生错误:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('[API Call] 响应数据:', error.response.data);
        console.error('[API Call] 响应状态:', error.response.status);
        console.error('[API Call] 响应头:', error.response.headers);
      } else if (error.request) {
        console.error('[API Call] 请求配置:', error.config);
        console.error('[API Call] 请求详情:', error.request);
      }
      console.error('[API Call] 错误消息:', error.message);
      throw new Error(`网络请求失败: ${error.message}`);
    } else {
      console.error('[API Call] 非 Axios 错误:', error);
      throw new Error('未知错误，请查看控制台日志');
    }
  }
}