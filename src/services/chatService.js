import apiClient, { stream } from '../utils/apiClient.js';
import { API_ENDPOINTS } from '../config/api.js';

// 聊天服务类
class ChatService {
  constructor() {
    this.client = apiClient;
    this.currentAbortController = null; // 用于中断当前请求
  }

  /**
   * 中断当前的流式请求
   */
  abortCurrentRequest() {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
  }

  /**
   * 发送普通聊天消息
   * @param {Object} params - 聊天参数
   * @param {string} params.userId - 用户ID
   * @param {Array} params.messages - 消息数组
   * @param {string} [params.conversationId] - 对话ID（可选）
   * @returns {Promise<Object>} 聊天响应
   */
  async sendMessage({ userId, messages, conversationId }) {
    try {
      const response = await this.client.post(API_ENDPOINTS.CHAT, {
        user_id: userId,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          content_type: msg.content_type || 'text'
        })),
        conversation_id: conversationId || null,
        stream: false
      });

      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 发送流式聊天消息 - 优化版本
   * @param {Object} params - 聊天参数
   * @param {string} params.userId - 用户ID
   * @param {Array} params.messages - 消息数组
   * @param {string} [params.conversationId] - 对话ID（可选）
   * @param {Function} params.onChunk - 流式数据回调
   * @param {Function} [params.onComplete] - 完成回调
   * @param {Function} [params.onError] - 错误回调
   * @returns {Promise<void>}
   */
  async sendStreamMessage({ 
    userId, 
    messages, 
    conversationId, 
    onChunk, 
    onComplete, 
    onError 
  }) {
    try {
      // 如果有正在进行的请求，先中断它
      if (this.currentAbortController) {
        this.currentAbortController.abort();
      }
      
      // 创建新的AbortController
      this.currentAbortController = new AbortController();
      
      let fullContent = '';
      let finalConversationId = conversationId;
      
      // 使用防抖机制来优化频繁的UI更新
      let updateTimer = null;
      let pendingContent = '';

      const debouncedUpdate = (content, fullText, convId) => {
        pendingContent = content;
        
        if (updateTimer) {
          clearTimeout(updateTimer);
        }
        
        updateTimer = setTimeout(async () => {
          if (onChunk && pendingContent) {
            await onChunk({
              type: 'delta',
              content: pendingContent,
              fullContent: fullText,
              conversationId: convId
            });
            pendingContent = '';
          }
        }, 16); // 约60fps的更新频率
      };

      await stream(
        API_ENDPOINTS.CHAT,
        {
          user_id: userId,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            content_type: msg.content_type || 'text'
          })),
          conversation_id: conversationId || null,
          stream: true
        },
        async (chunk) => {
          try {
            // 检查是否被中断
            if (this.currentAbortController?.signal.aborted) {
              return;
            }
            
            if (chunk.type === 'message_delta') {
              fullContent += chunk.content;
              finalConversationId = chunk.conversation_id || finalConversationId;
              
              // 使用防抖更新，减少频繁的UI重绘
              debouncedUpdate(chunk.content, fullContent, finalConversationId);
              
            } else if (chunk.type === 'chat_completed') {
              // 清除防抖定时器，立即处理最后的内容
              if (updateTimer) {
                clearTimeout(updateTimer);
                if (pendingContent && onChunk) {
                  await onChunk({
                    type: 'delta',
                    content: pendingContent,
                    fullContent,
                    conversationId: finalConversationId
                  });
                }
              }
              
              finalConversationId = chunk.conversation_id || finalConversationId;
              if (onComplete) {
                await onComplete({
                  conversationId: finalConversationId,
                  fullContent,
                  message: chunk.message
                });
              }
            } else if (chunk.type === 'error') {
              if (updateTimer) {
                clearTimeout(updateTimer);
              }
              if (onError) {
                const errorMessage = chunk.error || 'Unknown stream error occurred';
                await onError(new Error(errorMessage));
              }
            }
          } catch (error) {
            console.error('Stream chunk processing error:', error);
            if (updateTimer) {
              clearTimeout(updateTimer);
            }
            if (onError) {
              await onError(error);
            }
          }
        },
        {
          signal: this.currentAbortController.signal // 传递AbortSignal
        }
      );
    } catch (error) {
      // 如果是中断错误，不需要调用onError
      if (error.name === 'AbortError' || error.name === 'GracefulAbortError') {
        console.log('Stream request was aborted');
        return;
      }
      
      if (onError) {
        await onError(error);
      } else {
        throw error;
      }
    } finally {
      // 清理AbortController
      this.currentAbortController = null;
    }
  }

  /**
   * 获取对话历史
   * @param {string} conversationId - 对话ID
   * @returns {Promise<Object>} 对话历史
   */
  async getConversation(conversationId) {
    try {
      const response = await get(`${API_ENDPOINTS.CONVERSATIONS}/${conversationId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取用户的所有对话
   * @param {string} userId - 用户ID
   * @param {Object} [options] - 查询选项
   * @param {number} [options.limit] - 限制数量
   * @param {number} [options.offset] - 偏移量
   * @returns {Promise<Object>} 对话列表
   */
  async getUserConversations(userId, options = {}) {
    try {
      const endpoint = API_ENDPOINTS.USER_CONVERSATIONS.replace('{user_id}', userId);
      const response = await get(endpoint, options);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 删除对话
   * @param {string} conversationId - 对话ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteConversation(conversationId) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.CONVERSATIONS}/${conversationId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 重命名对话
   * @param {string} conversationId - 对话ID
   * @param {string} title - 新标题
   * @returns {Promise<Object>} 重命名结果
   */
  async renameConversation(conversationId, title) {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.CONVERSATIONS}/${conversationId}`, {
        title
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取用户信息
   * @param {string} [userId] - 用户ID（可选）
   * @returns {Promise<Object>} 用户信息
   */
  async getUserInfo(userId) {
    try {
      const params = userId ? { user_id: userId } : {};
      const response = await get(API_ENDPOINTS.USER_INFO, params);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取工作空间列表
   * @returns {Promise<Object>} 工作空间列表
   */
  async getWorkspaces() {
    try {
      const response = await get(API_ENDPOINTS.WORKSPACES);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取系统配置
   * @returns {Promise<Object>} 系统配置
   */
  async getConfig() {
    try {
      const response = await get(API_ENDPOINTS.CONFIG);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 测试连接
   * @returns {Promise<Object>} 连接测试结果
   */
  async testConnection() {
    try {
      const response = await get(API_ENDPOINTS.TEST_CONNECTION);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 格式化消息
   * @param {string} role - 角色 ('user' | 'assistant')
   * @param {string} content - 内容
   * @param {string} [contentType] - 内容类型
   * @returns {Object} 格式化的消息
   */
  formatMessage(role, content, contentType = 'text') {
    return {
      role,
      content,
      content_type: contentType,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 创建用户消息
   * @param {string} content - 消息内容
   * @returns {Object} 用户消息
   */
  createUserMessage(content) {
    return this.formatMessage('user', content);
  }

  /**
   * 创建助手消息
   * @param {string} content - 消息内容
   * @returns {Object} 助手消息
   */
  createAssistantMessage(content) {
    return this.formatMessage('assistant', content);
  }

  /**
   * 验证消息格式
   * @param {Object} message - 消息对象
   * @returns {boolean} 是否有效
   */
  validateMessage(message) {
    return (
      message &&
      typeof message === 'object' &&
      typeof message.role === 'string' &&
      typeof message.content === 'string' &&
      ['user', 'assistant', 'system'].includes(message.role)
    );
  }

  /**
   * 验证消息数组
   * @param {Array} messages - 消息数组
   * @returns {boolean} 是否有效
   */
  validateMessages(messages) {
    return (
      Array.isArray(messages) &&
      messages.length > 0 &&
      messages.every(msg => this.validateMessage(msg))
    );
  }
}

// 创建全局实例
const chatService = new ChatService();

export default chatService;

// 便捷的导出方法
export const sendMessage = (params) => chatService.sendMessage(params);
export const sendStreamMessage = (params) => chatService.sendStreamMessage(params);
export const getConversation = (conversationId) => chatService.getConversation(conversationId);
export const getUserConversations = (userId, options) => chatService.getUserConversations(userId, options);
export const deleteConversation = (conversationId) => chatService.deleteConversation(conversationId);
export const renameConversation = (conversationId, title) => chatService.renameConversation(conversationId, title);
export const getUserInfo = (userId) => chatService.getUserInfo(userId);
export const getWorkspaces = () => chatService.getWorkspaces();
export const getConfig = () => chatService.getConfig();
export const testConnection = () => chatService.testConnection();
export const createUserMessage = (content) => chatService.createUserMessage(content);
export const createAssistantMessage = (content) => chatService.createAssistantMessage(content);
export const validateMessage = (message) => chatService.validateMessage(message);
export const validateMessages = (messages) => chatService.validateMessages(messages);