import { apiConfig, API_ENDPOINTS, HTTP_METHODS, HTTP_STATUS } from '../config/api.js';

// API客户端类
class ApiClient {
  constructor() {
    this.config = apiConfig;
  }

  // 更新配置
  updateConfig() {
    // 配置会自动从apiConfig获取最新值
  }

  // 构建完整URL
  buildUrl(endpoint) {
    const baseURL = this.config.getBaseURL();
    // 如果endpoint已经包含完整路径，直接拼接
    if (endpoint.startsWith('/')) {
      return `${baseURL}${endpoint}`;
    }
    // 否则添加/api/v1前缀
    return `${baseURL}/api/v1/${endpoint}`;
  }

  // 处理响应
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // 忽略JSON解析错误，使用默认错误消息
        }
      }
      
      throw new Error(errorMessage);
    }

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  }

  // 重试机制
  async withRetry(requestFn, maxRetries = null) {
    const retries = maxRetries || this.config.getConfig().retryAttempts;
    let lastError;

    for (let i = 0; i <= retries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (i === retries) {
          break;
        }

        // 等待一段时间后重试
        const delay = Math.min(1000 * Math.pow(2, i), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  // 通用请求方法
  async request(endpoint, options = {}) {
    const config = this.config.getConfig();
    const url = this.buildUrl(endpoint);
    
    const requestOptions = {
      method: options.method || HTTP_METHODS.GET,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // 添加请求体
    if (options.body && typeof options.body === 'object') {
      requestOptions.body = JSON.stringify(options.body);
    }

    const requestFn = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      try {
        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return await this.handleResponse(response);
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
    };

    return await this.withRetry(requestFn);
  }

  // GET请求
  async get(endpoint, params = {}, options = {}) {
    const url = new URL(this.buildUrl(endpoint));
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    return await this.request(url.pathname + url.search, {
      method: HTTP_METHODS.GET,
      ...options
    });
  }

  // POST请求
  async post(endpoint, data = {}, options = {}) {
    return await this.request(endpoint, {
      method: HTTP_METHODS.POST,
      body: data,
      ...options
    });
  }

  // PUT请求
  async put(endpoint, data = {}, options = {}) {
    return await this.request(endpoint, {
      method: HTTP_METHODS.PUT,
      body: data,
      ...options
    });
  }

  // DELETE请求
  async delete(endpoint, options = {}) {
    return await this.request(endpoint, {
      method: HTTP_METHODS.DELETE,
      ...options
    });
  }

  // PATCH请求
  async patch(endpoint, data = {}, options = {}) {
    return await this.request(endpoint, {
      method: HTTP_METHODS.PATCH,
      body: data,
      ...options
    });
  }

  // 流式请求（用于聊天）- 优化版本
  async streamRequest(endpoint, data = {}, onChunk, options = {}) {
    const controller = new AbortController();
    let isTimeoutAbort = false; // 标记是否是超时导致的中断
    let isGracefulAbort = false; // 标记是否是优雅中止
    
    // 如果传入了外部的AbortSignal，监听它
    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        isGracefulAbort = true; // 标记为优雅中止
        controller.abort();
      });
    }
    
    const timeoutId = setTimeout(() => {
      isTimeoutAbort = true; // 标记为超时中断
      controller.abort();
    }, this.config.getConfig().timeout);

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: HTTP_METHODS.POST,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      // 使用 requestAnimationFrame 来优化渲染性能
      let pendingChunks = [];
      let isProcessing = false;
      
      const processChunks = () => {
        if (pendingChunks.length === 0) {
          isProcessing = false;
          return;
        }
        
        const chunksToProcess = pendingChunks.splice(0, 3); // 批量处理最多3个chunk
        
        Promise.all(chunksToProcess.map(async (chunk) => {
          try {
            await onChunk(chunk);
          } catch (e) {
            console.error('Process chunk error:', e);
          }
        })).then(() => {
          if (pendingChunks.length > 0) {
            requestAnimationFrame(processChunks);
          } else {
            isProcessing = false;
          }
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // 保留不完整的行

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data.trim() === '') continue;

            try {
              const parsed = JSON.parse(data);
              pendingChunks.push(parsed);
              
              // 如果没有正在处理，启动处理流程
              if (!isProcessing) {
                isProcessing = true;
                requestAnimationFrame(processChunks);
              }
            } catch (e) {
              console.error('Parse stream data error:', e, 'Data:', data);
            }
          }
        }
      }
      
      // 处理剩余的chunks
      if (pendingChunks.length > 0) {
        await Promise.all(pendingChunks.map(async (chunk) => {
          try {
            await onChunk(chunk);
          } catch (e) {
            console.error('Process remaining chunk error:', e);
          }
        }));
      }
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        if (isTimeoutAbort) {
          // 真正的超时
          throw new Error(`流式请求超时，超过 ${this.config.getConfig().timeout}ms 未收到响应`);
        } else if (isGracefulAbort) {
          // 优雅中止，创建一个特殊的错误类型
          const gracefulAbortError = new Error('Request gracefully aborted');
          gracefulAbortError.name = 'GracefulAbortError';
          throw gracefulAbortError;
        } else {
          // 用户主动停止，直接抛出AbortError，让上层处理
          throw error;
        }
      }
      
      if (error.message.includes('network error') || error.message.includes('fetch')) {
        throw new Error(`网络连接错误：${error.message}`);
      }
      
      throw error;
    }
  }

  // 上传文件
  async uploadFile(endpoint, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);

    // 添加其他字段
    if (options.fields) {
      Object.keys(options.fields).forEach(key => {
        formData.append(key, options.fields[key]);
      });
    }

    return await this.request(endpoint, {
      method: HTTP_METHODS.POST,
      headers: {
        // 不设置Content-Type，让浏览器自动设置
        ...Object.fromEntries(
          Object.entries(this.defaultHeaders).filter(([key]) => 
            key.toLowerCase() !== 'content-type'
          )
        ),
        ...options.headers
      },
      body: formData,
      ...options
    });
  }

  // 下载文件
  async downloadFile(endpoint, filename, options = {}) {
    const response = await fetch(this.buildUrl(endpoint), {
      method: HTTP_METHODS.GET,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return blob;
  }

  // 健康检查
  async healthCheck() {
    try {
      const response = await this.get('/health', {}, { retry: false, timeout: 5000 });
      return {
        status: RESPONSE_STATUS.SUCCESS,
        data: response
      };
    } catch (error) {
      return {
        status: RESPONSE_STATUS.ERROR,
        error: error.message
      };
    }
  }

  // 测试连接
  async testConnection() {
    try {
      const response = await this.get('/test/connection', {}, { retry: false });
      return {
        status: RESPONSE_STATUS.SUCCESS,
        data: response
      };
    } catch (error) {
      return {
        status: RESPONSE_STATUS.ERROR,
        error: error.message
      };
    }
  }
}

// 创建全局实例
const apiClient = new ApiClient();

// 监听配置变化
if (typeof window !== 'undefined') {
  window.addEventListener('rwa_hub_config_changed', () => {
    apiClient.updateConfig();
  });
}

export default apiClient;

// 便捷的导出方法
export const get = (endpoint, params, options) => apiClient.get(endpoint, params, options);
export const post = (endpoint, data, options) => apiClient.post(endpoint, data, options);
export const put = (endpoint, data, options) => apiClient.put(endpoint, data, options);
export const del = (endpoint, options) => apiClient.delete(endpoint, options);
export const patch = (endpoint, data, options) => apiClient.patch(endpoint, data, options);
export const stream = (endpoint, data, onChunk, options) => apiClient.streamRequest(endpoint, data, onChunk, options);
export const upload = (endpoint, file, options) => apiClient.uploadFile(endpoint, file, options);
export const download = (endpoint, filename, options) => apiClient.downloadFile(endpoint, filename, options);
export const healthCheck = () => apiClient.healthCheck();
export const testConnection = () => apiClient.testConnection();