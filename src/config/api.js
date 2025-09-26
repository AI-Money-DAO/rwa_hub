// API配置文件 - 支持开发环境和生产环境切换

// 获取环境变量中的API地址，如果没有则使用默认值
const getDefaultApiUrl = () => {
  // 优先使用环境变量
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // 服务端渲染时也要检查环境变量
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // 最后使用默认值（开发环境）
  // return 'http://127.0.0.1:2026';
  return 'http://www.ce182.com';
};

// API配置管理 - 简化版本，使用URL配置
const defaultConfig = {
  url: getDefaultApiUrl(),
  timeout: 30000, // 增加到30秒，适应流式请求
  retryAttempts: 3
};

// 当前环境
let currentEnv = 'development';

// API配置类
class ApiConfig {
  constructor() {
    this.config = { ...defaultConfig };
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      // 检查是否在浏览器环境中
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('api_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.config = { ...defaultConfig, ...parsed };
        }
      }
    } catch (error) {
      console.warn('Failed to load API config from storage:', error);
      this.config = { ...defaultConfig };
    }
  }

  saveToStorage() {
    try {
      // 检查是否在浏览器环境中
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('api_config', JSON.stringify(this.config));
      }
    } catch (error) {
      console.warn('Failed to save API config to storage:', error);
    }
  }

  getConfig() {
    return {
      ...this.config,
      baseURL: this.getBaseURL(),
      wsURL: this.getWebSocketURL()
    };
  }

  getBaseURL() {
    return this.config.url;
  }

  getWebSocketURL() {
    const url = new URL(this.config.url);
    const wsProtocol = url.protocol === 'https:' ? 'wss' : 'ws';
    return `${wsProtocol}://${url.host}`;
  }

  setServer(serverAddress) {
    try {
      // 验证URL格式
      let url;
      if (serverAddress.startsWith('http://') || serverAddress.startsWith('https://')) {
        url = serverAddress;
      } else {
        // 假设是 IP:端口 格式，添加 http:// 前缀
        url = `http://${serverAddress}`;
      }

      // 验证URL是否有效
      new URL(url);

      this.config = {
        ...this.config,
        url
      };

      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Invalid server address:', error);
      return false;
    }
  }

  resetConfig() {
    this.config = { ...defaultConfig };
    this.saveToStorage();
  }
}

// 创建全局实例
const apiConfig = new ApiConfig();

// 导出配置实例和便捷方法
export { apiConfig };
export const getApiConfig = () => apiConfig.getConfig();
export const getBaseURL = () => apiConfig.getBaseURL();
export const setServer = (serverUrl) => apiConfig.setServer(serverUrl);

// API端点常量
export const API_ENDPOINTS = {
  CHAT: '/api/v3/chat',
  TEST_CONNECTION: '/api/v3/test/connection',
  USER_INFO: '/api/v3/user/info',
  WORKSPACES: '/api/v3/workspaces',
  CONFIG: '/api/v3/config',
  CONVERSATIONS: '/api/v3/conversations',
  USER_CONVERSATIONS: '/api/v3/users',
  HEALTH: '/health'
};

// HTTP方法常量
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

// 响应状态常量
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export default apiConfig;