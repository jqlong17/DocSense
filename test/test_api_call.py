#!/usr/bin/env python3
import requests
import json

# API配置
API_URL = 'https://p33279i881.vicp.fun/v1/chat/completions'
API_KEY = 'sk-hw8jl0AvZ3SoFFPZ6a103bC7C15943569fC66002437c7f09'

# 测试消息
messages = [
    {"role": "system", "content": "你是一个有帮助的助手。"},
    {"role": "user", "content": "你好，请告诉我今天的日期。"}
]

# 准备请求payload
payload = {
    "model": "moonshot-v1-8k",
    "messages": messages,
    "stream": False
}

# 设置请求头
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {API_KEY}'
}

def test_api_call():
    try:
        print("开始测试API调用...")
        response = requests.post(API_URL, json=payload, headers=headers, timeout=30)
        
        print("原始响应内容:", response.text)  # 打印原始响应内容
        
        if response.status_code == 200:
            print("API调用成功！")
            print("响应状态码:", response.status_code)
            try:
                json_response = response.json()  # 尝试解析 JSON
                print("响应内容:")
                print(json.dumps(json_response, ensure_ascii=False, indent=2))
            except json.JSONDecodeError as e:
                print("JSON解析错误:", e)
        else:
            print(f"API调用失败。状态码: {response.status_code}")
            print("响应内容:")
            print(response.text)
    
    except requests.exceptions.RequestException as e:
        print(f"发生错误: {e}")

if __name__ == "__main__":
    test_api_call()
