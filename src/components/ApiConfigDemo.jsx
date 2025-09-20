'use client';

import React, { useState, useEffect } from 'react';
import { apiConfig, setServer } from '../config/api';
import { apiClient } from '../utils/apiClient';
import { chatService } from '../services/chatService';

export default function ApiConfigDemo() {
  const [currentConfig, setCurrentConfig] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState(null);
  const [serverInput, setServerInput] = useState('');

  useEffect(() => {
    // 获取当前配置
    setCurrentConfig(apiConfig.getConfig());
  }, []);

  const handleServerChange = () => {
    if (serverInput.trim()) {
      setServer(serverInput.trim());
      setCurrentConfig(apiConfig.getConfig());
      setTestResult(null);
      setChatResponse(null);
      setServerInput('');
    }
  };

  const resetToDefault = () => {
    apiConfig.resetConfig();
    setCurrentConfig(apiConfig.getConfig());
    setTestResult(null);
    setChatResponse(null);
  };

  const testConnection = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const result = await apiClient.testConnection();
      setTestResult({
        success: true,
        data: result,
        message: '连接测试成功！'
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        message: '连接测试失败'
      });
    } finally {
      setLoading(false);
    }
  };

  const testChatAPI = async () => {
    setLoading(true);
    setChatResponse(null);
    
    try {
      const response = await chatService.sendMessage({
        user_id: '213',
        messages: [{
          role: 'user',
          content: '你好，这是一个API测试消息',
          content_type: 'text'
        }],
        stream: false
      });
      
      setChatResponse({
        success: true,
        data: response,
        message: '聊天API测试成功！'
      });
    } catch (error) {
      setChatResponse({
        success: false,
        error: error.message,
        message: '聊天API测试失败'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentConfig) {
    return <div className="p-4">加载配置中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          API 配置管理演示
        </h1>
        
        {/* 当前配置显示 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">当前配置</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">服务器地址:</span> 
              <span className="ml-2 text-blue-600">{currentConfig.url}</span>
            </div>
            <div>
              <span className="font-medium">WebSocket地址:</span> 
              <span className="ml-2 text-green-600">{currentConfig.wsURL}</span>
            </div>
            <div>
              <span className="font-medium">超时时间:</span> 
              <span className="ml-2">{currentConfig.timeout}ms</span>
            </div>
            <div>
              <span className="font-medium">重试次数:</span> 
              <span className="ml-2">{currentConfig.retryAttempts}</span>
            </div>
          </div>
        </div>

        {/* 服务器配置 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">服务器配置</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={serverInput}
              onChange={(e) => setServerInput(e.target.value)}
              placeholder="输入服务器地址，如: 127.0.0.1:2026 或 https://api.example.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleServerChange();
                }
              }}
            />
            <button
              onClick={handleServerChange}
              disabled={!serverInput.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              应用
            </button>
            <button
              onClick={resetToDefault}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              重置
            </button>
          </div>
          <p className="text-sm text-gray-500">
            支持格式：IP:端口 (如 127.0.0.1:2026) 或完整URL (如 https://api.example.com)
          </p>
        </div>

        {/* 测试按钮 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">API测试</h3>
          <div className="flex gap-3">
            <button
              onClick={testConnection}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '测试中...' : '测试连接'}
            </button>
            <button
              onClick={testChatAPI}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '测试中...' : '测试聊天API'}
            </button>
          </div>
        </div>

        {/* 测试结果 */}
        {testResult && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">连接测试结果</h3>
            <div className={`p-4 rounded-lg ${
              testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {testResult.message}
              </div>
              {testResult.success && testResult.data && (
                <div className="mt-2 text-sm text-gray-600">
                  <div>服务器: {testResult.data.server}</div>
                  <div>状态: {testResult.data.status}</div>
                  <div>时间: {new Date(testResult.data.timestamp).toLocaleString()}</div>
                </div>
              )}
              {!testResult.success && (
                <div className="mt-2 text-sm text-red-600">
                  错误: {testResult.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 聊天API测试结果 */}
        {chatResponse && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">聊天API测试结果</h3>
            <div className={`p-4 rounded-lg ${
              chatResponse.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className={`font-medium ${chatResponse.success ? 'text-green-800' : 'text-red-800'}`}>
                {chatResponse.message}
              </div>
              {chatResponse.success && chatResponse.data && (
                <div className="mt-2 text-sm text-gray-600">
                  <div>对话ID: {chatResponse.data.conversation_id}</div>
                  <div>AI回复: {chatResponse.data.message?.content}</div>
                  <div>Token使用: {chatResponse.data.usage?.total_tokens}</div>
                </div>
              )}
              {!chatResponse.success && (
                <div className="mt-2 text-sm text-red-600">
                  错误: {chatResponse.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">使用说明</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 选择不同环境会自动切换对应的API地址</li>
            <li>• 可以输入自定义API地址进行测试</li>
            <li>• 配置会自动保存到localStorage中</li>
            <li>• 测试连接可以验证API服务是否正常</li>
            <li>• 测试聊天API可以验证完整的聊天功能</li>
          </ul>
        </div>
      </div>
    </div>
  );
}