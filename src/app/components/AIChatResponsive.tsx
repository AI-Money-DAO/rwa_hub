'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import chatService from '../../services/chatService.js';
import { matchQuestion } from '../../utils/presetAnswers.js';
import './animations.css';

interface Message {
  id: string;
  type?: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isUser?: boolean;
  isTyping?: boolean;
  isLoading?: boolean;
}

interface AIChatResponsiveProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function AIChatResponsive({ isOpen, onClose, initialQuery }: AIChatResponsiveProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // 新增：正在生成状态
  const [currentTypingId, setCurrentTypingId] = useState<string | null>(null); // 新增：当前正在打字的消息ID
  const [sidebarWidth, setSidebarWidth] = useState(600);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 新增：打字效果的timeout引用

  // 从localStorage加载对话ID和消息历史
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConversationId = localStorage.getItem('ai_chat_conversation_id');
      const savedMessages = localStorage.getItem('ai_chat_messages');
      
      if (savedConversationId) {
        setConversationId(savedConversationId);
      }
      
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          setMessages(parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        } catch (error) {
          console.error('Failed to parse saved messages:', error);
        }
      }
    }
  }, []);

  // 保存对话ID到localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && conversationId) {
      localStorage.setItem('ai_chat_conversation_id', conversationId);
    }
  }, [conversationId]);

  // 保存消息历史到localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem('ai_chat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // 开始新对话
  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ai_chat_conversation_id');
      localStorage.removeItem('ai_chat_messages');
    }
  };

  // 新增：停止生成函数
  const stopGeneration = () => {
    // 中断流式请求
    chatService.abortCurrentRequest();
    
    setIsGenerating(false);
    setIsLoading(false);
    setCurrentTypingId(null);
    
    // 清除打字效果的timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    // 如果有正在生成的消息，标记为已完成
    if (currentTypingId) {
      setMessages(prev => prev.map(msg => 
        msg.id === currentTypingId 
          ? { ...msg, isGenerating: false, isLoading: false, isTyping: false }
          : msg
      ));
    }
  };

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化时如果有查询，将其设置到输入框中并自动发送
  useEffect(() => {
    if (isOpen && initialQuery) {
      try {
        // 尝试解析JSON格式的预设回答
        const parsedQuery = JSON.parse(initialQuery);
        if (parsedQuery.question && parsedQuery.presetAnswer) {
          // 有预设回答的情况
          setInputValue(parsedQuery.question);
          // 自动发送问题并显示预设回答
          setTimeout(() => {
            handleSendMessageWithPreset(parsedQuery.question, parsedQuery.presetAnswer);
          }, 100);
        } else {
          // 普通查询
          setInputValue(initialQuery);
        }
      } catch (error) {
        // 不是JSON格式，按普通查询处理
        setInputValue(initialQuery);
      }
    }
  }, [isOpen, initialQuery]);

  // 聚焦输入框
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // 拖拽调整宽度
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 500;
      const maxWidth = 800;
      
      setSidebarWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // 调用后端API获取AI流式回复
  const getAIStreamResponse = async (userMessage: string, aiMessageId: string): Promise<void> => {
    setIsGenerating(true);
    setCurrentTypingId(aiMessageId);
    
    // 使用本地变量来跟踪这次请求的状态
    let isCurrentRequestActive = true;
    
    try {
      // 如果没有conversationId，先生成一个临时的用于创建userId
      const tempConversationId = conversationId || Date.now().toString();
      const userId = `user_${tempConversationId}`;
      
      await chatService.sendStreamMessage({
        userId: userId,
        messages: [{
          role: 'user',
          content: userMessage,
          content_type: 'text'
        }],
        conversationId: conversationId || undefined,
        onChunk: async (chunk: any) => {
          // 检查当前请求是否仍然活跃
          if (!isCurrentRequestActive) {
            return;
          }
          
          if (chunk.type === 'delta') {
            // 更新AI消息内容
            setMessages(prev => prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: chunk.fullContent, isLoading: false, isTyping: true }
                : msg
            ));
          }
        },
        onComplete: async (result: any) => {
          // 检查当前请求是否仍然活跃
          if (!isCurrentRequestActive) {
            return;
          }
          
          // 流式响应完成
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, content: result.fullContent, isLoading: false, isTyping: false }
              : msg
          ));
          
          setIsGenerating(false);
          setCurrentTypingId(null);
          
          // 更新对话ID
          if (result.conversationId) {
            setConversationId(result.conversationId);
          }
        },
        onError: async (error: any) => {
          // 检查当前请求是否仍然活跃
          if (!isCurrentRequestActive) {
            return;
          }
          
          // 检查是否是用户主动停止的请求
          if (error.name === 'AbortError' || error.name === 'GracefulAbortError') {
            // 用户主动停止，不显示错误消息，保持当前内容，也不输出到控制台
            setMessages(prev => prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, isLoading: false, isTyping: false }
                : msg
            ));
          } else {
            // 真正的服务错误才输出到控制台
            console.error('Stream error:', error);
            setMessages(prev => prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: '抱歉，服务暂时不可用，请稍后再试。', isLoading: false, isTyping: false }
                : msg
            ));
          }
          setIsGenerating(false);
          setCurrentTypingId(null);
        }
      });
    } catch (error: any) {
      // 检查当前请求是否仍然活跃
      if (!isCurrentRequestActive) {
        return;
      }
      
      // 检查是否是用户主动停止的请求
      if (error.name === 'AbortError' || error.name === 'GracefulAbortError') {
        // 用户主动停止，不显示错误消息，保持当前内容，也不输出到控制台
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, isLoading: false, isTyping: false }
            : msg
        ));
      } else {
        // 真正的服务错误才输出到控制台
        console.error('AI stream response error:', error);
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: '抱歉，服务暂时不可用，请稍后再试。', isLoading: false, isTyping: false }
            : msg
        ));
      }
      setIsGenerating(false);
      setCurrentTypingId(null);
    } finally {
      // 标记当前请求为非活跃状态
      isCurrentRequestActive = false;
      // 确保清理loading状态
      setIsLoading(false);
    }
  };

  // 模拟打字效果的函数
  const simulateTyping = (text: string, messageId: string) => {
    console.log('simulateTyping 开始:', { text: text.substring(0, 50) + '...', messageId });
    
    // 优化：根据文本长度动态调整输出策略
    const textLength = text.length;
    let chunkSize = 1; // 默认单字符输出
    let interval = 20; // 默认间隔
    
    // 根据文本长度优化输出策略 - 长文本和超长文本只提升25%
    if (textLength > 3000) {
      // 超超长文本：适度提升25%
      chunkSize = 2;
      interval = 15; // 从20ms减少到15ms，提升约25%
    } else if (textLength > 2000) {
      // 超长文本：适度提升25%
      chunkSize = 2;
      interval = 15; // 从20ms减少到15ms，提升约25%
    } else if (textLength > 1000) {
      // 长文本：适度提升25%
      chunkSize = 1;
      interval = 15; // 从20ms减少到15ms，提升约25%
    } else if (textLength > 500) {
      // 中等文本：保持原有效果
      chunkSize = 1;
      interval = 20;
    } else {
      // 短文本：保持原有效果
      chunkSize = 1;
      interval = 25;
    }
    
    const words = text.split('');
    let currentIndex = 0;
    let isTypingActive = true; // 使用局部变量控制打字状态
    
    setCurrentTypingId(messageId);
    setIsGenerating(true);
    
    const typeNextChunk = () => {
      // 检查是否被停止 - 使用局部变量和状态检查
      if (!isTypingActive) {
        console.log('打字被停止 (局部变量):', { isTypingActive, messageId });
        return;
      }
      
      if (currentIndex < words.length) {
        // 批量输出多个字符以提升速度
        const endIndex = Math.min(currentIndex + chunkSize, words.length);
        const currentText = words.slice(0, endIndex).join('');
        
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: currentText, isTyping: true }
            : msg
        ));
        
        currentIndex = endIndex;
        typingTimeoutRef.current = setTimeout(typeNextChunk, interval);
      } else {
        // 打字完成
        console.log('打字完成:', messageId);
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isTyping: false }
            : msg
        ));
        setIsGenerating(false);
        setCurrentTypingId(null);
        isTypingActive = false;
      }
    };
    
    // 添加停止打字的清理函数
    const stopTyping = () => {
      isTypingActive = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
    
    // 开始打字
    typeNextChunk();
    
    // 返回停止函数以便外部调用
    return stopTyping;
  };

  // 处理带预设回答的消息发送
  const handleSendMessageWithPreset = async (question: string, presetAnswer: string) => {
    console.log('handleSendMessageWithPreset 被调用:', { question, presetAnswer });
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date(),
    };

    console.log('添加用户消息:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // 添加AI回复消息
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    };

    console.log('添加AI消息:', aiMessage);
    setMessages(prev => [...prev, aiMessage]);

    // 优化：减少初始延迟，让用户更快看到回答开始显示
    setTimeout(() => {
      console.log('开始模拟打字效果:', { presetAnswer, aiMessageId });
      simulateTyping(presetAnswer, aiMessageId);
    }, 200); // 从500ms减少到200ms
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content) return;

    // 首先检查是否匹配预设问题
    const matchedQuestion = matchQuestion(content);
    if (matchedQuestion) {
      // 如果匹配到预设问题，使用预设答案
      handleSendMessageWithPreset(matchedQuestion.question, matchedQuestion.answer);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 添加AI正在输入的消息
    const aiMessageId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '思考中...',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, loadingMessage]);

    // 调用流式API获取AI回复
    await getAIStreamResponse(content, aiMessageId);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'RWA是什么？',
    'RWA和传统融资有什么区别？',
    'RWA融资，是属于偏债权融资还是偏股权融资？'
  ];

  // 移动端组件 - 全屏模式
  const MobileChat = () => (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            title="返回"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-white">RWA Hub AI</h1>
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[95%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {message.isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>思考中...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{message.content}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 输入区域 */}
      <div className="p-3 bg-gray-800 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的问题..."
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-500"
          />
          <button
            onClick={() => isGenerating ? stopGeneration() : handleSendMessage()}
            disabled={(!inputValue.trim() && !isGenerating)}
            className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? '停止' : '发送'}
          </button>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  // 全屏聊天组件
  return (
    <div className="fixed inset-0 bg-black text-white z-50 flex flex-col">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
        <h2 className="text-lg font-semibold text-white">RWA AI 助手</h2>
        <div className="flex gap-2 items-center">
          <button
            onClick={startNewConversation}
            className="text-gray-400 hover:text-white transition-colors flex items-center justify-center"
            title="开始新对话"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors flex items-center justify-center -translate-y-1"
            title="收起对话框"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-gradient-to-br from-black via-gray-900 to-black relative">
        {/* 背景装饰 - 调整为金色主题 */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-amber-500/5 pointer-events-none"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '2s'}}></div>
        
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          {messages.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              {/* 美化后的AI图标 - 调整为金色主题 */}
              <div className="w-20 h-20 bg-gradient-to-br from-amber-600 via-yellow-400 to-amber-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl animate-pulse">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 animate-slide-up">RWA AI 助手</h3>
              <p className="text-gray-400 mb-8 text-lg animate-slide-up" style={{animationDelay: '0.2s'}}>有什么可以帮助您的吗？</p>
              
              {/* 快速问题 - 调整为金色主题 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      console.log('快速问题被点击:', question);
                      const matchedQuestion = matchQuestion(question);
                      console.log('匹配结果:', matchedQuestion);
                      if (matchedQuestion) {
                        console.log('使用预设答案');
                        handleSendMessageWithPreset(matchedQuestion.question, matchedQuestion.answer);
                      } else {
                        console.log('使用AI回答');
                        handleSendMessage(question);
                      }
                    }}
                    className="p-4 bg-gradient-to-br from-gray-800/80 to-gray-700/80 hover:from-gray-700/90 hover:to-gray-600/90 rounded-xl text-left text-gray-300 hover:text-white transition-all duration-300 border border-amber-600/20 hover:border-amber-500/50 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm animate-slide-up"
                    style={{animationDelay: `${0.4 + index * 0.1}s`}}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
                      <span>{question}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}>
                  {message.type === 'user' ? (
                    // 用户消息：直接显示文字
                    <div className="max-w-[95%] text-right">
                      <div className="text-white/90 text-sm leading-relaxed break-words whitespace-pre-wrap mb-1">
                        {message.content}
                      </div>
                      <div className="text-white/50 text-xs">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    ) : (
                    // AI消息：保持原有的头像和气泡样式
                    <div className="flex max-w-[95%] items-start">
                      {/* AI头像 - 可点击收起 */}
                      <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 bg-gradient-to-br from-amber-700 via-yellow-500 to-amber-700 -ml-2 hover:from-amber-800 hover:via-yellow-600 hover:to-amber-800 transition-all duration-300 cursor-pointer"
                        title="收起对话框"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm">
                          <svg className="w-5 h-5 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </button>
                      
                      {/* AI消息气泡 */}
                      <div className="rounded-2xl px-5 py-4 shadow-lg transition-all duration-300 hover:shadow-xl backdrop-blur-sm bg-gray-800/90 text-white border border-gray-700/50">
                        <div className="text-sm leading-relaxed break-words whitespace-pre-wrap font-medium">{message.content}</div>
                        <div className="text-xs mt-3 font-medium text-amber-300/70">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="p-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                className="w-full bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-white placeholder-gray-400 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-gray-700/90 text-base backdrop-blur-sm transition-all duration-300"
                disabled={isLoading}
              />
              {/* 输入框装饰 */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <button
              onClick={() => isGenerating ? stopGeneration() : handleSendMessage()}
              disabled={(!inputValue.trim() && !isGenerating)}
              className="bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 text-white rounded-full p-3 hover:from-amber-700 hover:via-yellow-500 hover:to-amber-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ring-2 ring-amber-300/20 hover:ring-amber-300/40"
            >
              {isGenerating ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6h12v12H6z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}