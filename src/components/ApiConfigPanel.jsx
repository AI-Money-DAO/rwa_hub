'use client';

import React, { useState, useEffect } from 'react';
import apiConfig, { 
  getAvailableEnvironments, 
  getCurrentEnvironmentInfo,
  switchEnvironment,
  setCustomApiUrl,
  setCustomWsUrl,
  resetToDefault
} from '../config/api.js';
import { testConnection } from '../utils/apiClient.js';

const ApiConfigPanel = ({ isOpen, onClose }) => {
  const [currentEnv, setCurrentEnv] = useState(null);
  const [environments, setEnvironments] = useState([]);
  const [customApiUrl, setCustomApiUrlState] = useState('');
  const [customWsUrl, setCustomWsUrlState] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('idle');
  const [connectionResult, setConnectionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 加载配置信息
  const loadConfig = () => {
    const envInfo = getCurrentEnvironmentInfo();
    const envList = getAvailableEnvironments();
    
    setCurrentEnv(envInfo);
    setEnvironments(envList);
    setCustomApiUrlState(envInfo.config.apiBaseUrl || '');
    setCustomWsUrlState(envInfo.config.wsBaseUrl || '');
  };

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  // 切换环境
  const handleEnvironmentSwitch = (envKey) => {
    if (switchEnvironment(envKey)) {
      loadConfig();
      
      // 触发全局配置变化事件
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('rwa_hub_config_changed'));
      }
    }
  };

  // 保存自定义URL
  const handleSaveCustomUrls = () => {
    if (customApiUrl) {
      setCustomApiUrl(customApiUrl);
    }
    if (customWsUrl) {
      setCustomWsUrl(customWsUrl);
    }
    
    loadConfig();
    
    // 触发全局配置变化事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('rwa_hub_config_changed'));
    }
  };

  // 重置为默认配置
  const handleResetToDefault = () => {
    resetToDefault();
    loadConfig();
    
    // 触发全局配置变化事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('rwa_hub_config_changed'));
    }
  };

  // 测试连接
  const handleTestConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('testing');
    setConnectionResult(null);

    try {
      const result = await testConnection();
      setConnectionStatus(result.status);
      setConnectionResult(result);
    } catch (error) {
      setConnectionStatus('error');
      setConnectionResult({
        status: 'error',
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">API 配置管理</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 当前环境信息 */}
          {currentEnv && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">当前环境</h3>
              <div className="text-sm text-blue-700">
                <p><strong>环境:</strong> {currentEnv.name}</p>
                <p><strong>API地址:</strong> {currentEnv.config.apiBaseUrl}</p>
                <p><strong>WebSocket地址:</strong> {currentEnv.config.wsBaseUrl}</p>
                <p><strong>超时时间:</strong> {currentEnv.config.timeout}ms</p>
              </div>
            </div>
          )}

          {/* 环境切换 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">环境切换</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {environments.map((env) => (
                <button
                  key={env.key}
                  onClick={() => handleEnvironmentSwitch(env.key)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    env.current
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {env.name}
                  {env.current && (
                    <span className="block text-xs text-blue-600 mt-1">当前环境</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 自定义URL配置 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">自定义配置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API 基础地址
                </label>
                <input
                  type="url"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrlState(e.target.value)}
                  placeholder="http://127.0.0.1:2026/api/v1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WebSocket 地址
                </label>
                <input
                  type="url"
                  value={customWsUrl}
                  onChange={(e) => setCustomWsUrlState(e.target.value)}
                  placeholder="ws://127.0.0.1:2026"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSaveCustomUrls}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  保存配置
                </button>
                <button
                  onClick={handleResetToDefault}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  重置默认
                </button>
              </div>
            </div>
          </div>

          {/* 连接测试 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">连接测试</h3>
            <div className="space-y-3">
              <button
                onClick={handleTestConnection}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm font-medium flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    测试中...
                  </>
                ) : (
                  '测试连接'
                )}
              </button>

              {/* 连接结果 */}
              {connectionResult && (
                <div className={`p-3 rounded-lg border text-sm ${
                  connectionResult.status === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {connectionResult.status === 'success' ? (
                    <div>
                      <p className="font-medium">✅ 连接成功</p>
                      {connectionResult.data && (
                        <pre className="mt-2 text-xs overflow-x-auto">
                          {JSON.stringify(connectionResult.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">❌ 连接失败</p>
                      <p className="mt-1">{connectionResult.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 使用说明 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">使用说明</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>开发环境:</strong> 本地开发时使用，默认连接 127.0.0.1:2026</li>
              <li>• <strong>测试环境:</strong> 测试部署时使用，连接测试服务器</li>
              <li>• <strong>生产环境:</strong> 正式上线时使用，连接生产服务器</li>
              <li>• <strong>自定义配置:</strong> 可以覆盖当前环境的默认配置</li>
              <li>• <strong>配置持久化:</strong> 自定义配置会保存在浏览器本地存储中</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigPanel;