import axios from 'axios';

const API_URL = 'https://p33279i881.vicp.fun/v1/chat/completions';
const API_KEY = 'sk-hw8jl0AvZ3SoFFPZ6a103bC7C15943569fC66002437c7f09';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callAI(messages: Message[], model: string = 'gpt-3.5-turbo') {
  try {
    const response = await axios.post(
      API_URL,
      {
        model,
        messages,
        stream: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_KEY,
        },
        timeout: 30000, // 设置30秒超时
      }
    );

    if (response.status === 200 && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('API返回了意外的响应格式');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 服务器响应了，但状态码不在 2xx 范围内
        console.error('API响应错误:', error.response.status, error.response.data);
        throw new Error(`API响应错误: ${error.response.status}`);
      } else if (error.request) {
        // 请求已经发出，但没有收到响应
        console.error('未收到API响应:', error.message);
        throw new Error('未能连接到API服务器，请检查您的网络连接');
      } else {
        // 在设置请求时发生了错误
        console.error('API请求错误:', error.message);
        throw new Error('发送API请求时出错');
      }
    } else {
      // 处理非Axios错误
      console.error('未知错误:', error);
      throw new Error('发生未知错误');
    }
  }
}