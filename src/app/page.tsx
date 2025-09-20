'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import AIChatResponsive from './components/AIChatResponsive';
import ParticleSystem from './components/ParticleSystem';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialQuery, setChatInitialQuery] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(480);

  // 处理搜索栏的AI问答
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setChatInitialQuery(searchQuery);
      setIsChatOpen(true);
    }
  };

  // 处理快速问题点击
  const handleQuickQuestion = (question: string) => {
    setChatInitialQuery(question);
    setIsChatOpen(true);
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e as any);
    }
  };

  return (
    <main 
      className="min-h-screen bg-black text-white relative overflow-hidden transition-all duration-300"
      style={{
        paddingRight: typeof window !== 'undefined' && isChatOpen && window.innerWidth >= 1024 ? `${sidebarWidth}px` : '0'
      }}
    >
      {/* Background Elements */}
      <ParticleSystem />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 animate-pulse"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/5 to-transparent rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
      
      {/* Floating Geometric Shapes */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rotate-45 animate-bounce opacity-70" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
      <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s', animationDuration: '2.5s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rotate-12 animate-bounce opacity-50" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
      <div className="absolute bottom-1/3 left-1/3 w-10 h-2 bg-gradient-to-r from-cyan-400 to-teal-500 animate-pulse opacity-40" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
      
      {/* Hero Background Image - Extended to cover entire page */}
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: `url('/hero-background.png')`
        }}
      ></div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero Section */}
      <section className="relative z-20 pt-20 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            <span 
              className="bg-gradient-to-r from-[#A98242] via-[#FFDCA3] to-[#A98242] bg-clip-text text-transparent"
              style={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: 'clamp(28px, 5vw, 64px)',
                lineHeight: '120%',
                textAlign: 'center'
              }}
            >
              RWA Hub——你的RWA AI助手
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-12 px-4">
            一站式提供RWA知识、服务与资源撮合
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-6 md:mb-8 px-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="地产RWA有哪些公司..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 md:px-8 py-4 md:py-6 bg-white border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 shadow-lg text-base md:text-lg pr-20 md:pr-24"
                />
                <div className="absolute right-3 md:right-6 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 md:space-x-3">
                  <button 
                    type="button"
                    className="p-1.5 md:p-2 hover:bg-gray-100 rounded transition-colors"
                    title="语音输入"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  <button 
                    type="submit"
                    className="p-1.5 md:p-2 hover:bg-gray-100 rounded transition-colors"
                    title="开始AI问答"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          {/* Quick Questions */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 mb-12 md:mb-16 px-4">
            <button 
              onClick={() => handleQuickQuestion('RWA是什么？')}
              className="px-4 md:px-6 py-2.5 md:py-3 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 rounded-full transition-all shadow-lg backdrop-blur-sm text-sm md:text-base"
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                lineHeight: '100%',
                textAlign: 'center',
                color: '#D9D9D9'
              }}
            >
              RWA是什么？
            </button>
            <button 
              onClick={() => handleQuickQuestion('RWA和传统融资有什么区别？')}
              className="px-4 md:px-6 py-2.5 md:py-3 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 rounded-full transition-all shadow-lg backdrop-blur-sm text-sm md:text-base"
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                lineHeight: '100%',
                textAlign: 'center',
                color: '#D9D9D9'
              }}
            >
              RWA和传统融资有什么区别？
            </button>
            <button 
              onClick={() => handleQuickQuestion('企业出海时，如何利用RWA提升融资效率？')}
              className="px-4 md:px-6 py-2.5 md:py-3 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 rounded-full transition-all shadow-lg backdrop-blur-sm text-sm md:text-base"
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                lineHeight: '100%',
                textAlign: 'center',
                color: '#D9D9D9'
              }}
            >
              企业出海时，如何利用RWA提升融资效率？
            </button>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="relative z-20 px-4 md:px-8 lg:px-16 pb-20 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* 资产方 */}
          <div className="text-center p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#A98242] via-[#FFDCA3] to-[#A98242] bg-clip-text text-transparent">资产方</h3>
            <h4 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">拥有现实资产的企业或个人</h4>
            <p className="text-gray-300 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
              希望通过区块链方式实现资产上链，
              提升资产流动性与融资效率。
            </p>
            <button className="bg-green-500 hover:bg-green-400 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base w-full sm:w-auto">
              我要融资
            </button>
          </div>

          {/* 服务方 */}
          <div className="text-center p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#A98242] via-[#FFDCA3] to-[#A98242] bg-clip-text text-transparent">服务方</h3>
            <h4 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">专业服务提供方</h4>
            <p className="text-gray-300 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
              包括律所、会计事务所、审计、托
              管、评估公司，以及技术服务团队。
            </p>
            <button className="bg-purple-500 hover:bg-purple-400 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base w-full sm:w-auto">
              我要接单
            </button>
          </div>

          {/* 资金方 */}
          <div className="text-center p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#A98242] via-[#FFDCA3] to-[#A98242] bg-clip-text text-transparent">资金方</h3>
            <h4 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">投资机构或资金提供方</h4>
            <p className="text-gray-300 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
              寻求优质、安全的RWA项目进行
              投资与配置，获取稳定回报。
            </p>
            <button className="bg-orange-500 hover:bg-orange-400 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base w-full sm:w-auto">
              我要投资
            </button>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="relative z-10 h-4 bg-gradient-to-r from-[#A98242] via-[#FFDCA3] to-[#A98242]"></div>

      {/* New Section: 如何玩转RWA Hub社区 */}
      <section className="relative z-10 bg-white text-black py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
            <Link href="/community" className="inline-flex items-center bg-gray-100 rounded-full px-4 md:px-6 py-2.5 md:py-3 mb-6 md:mb-8 hover:bg-gray-200 transition-colors cursor-pointer group">
              <span className="text-gray-800 text-base md:text-lg font-medium">如何玩转RWA Hub社区？</span>
              <div className="ml-2 md:ml-3 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* 关于我们 */}
            <div className="rounded-2xl p-6 md:p-8 text-center" style={{background: 'linear-gradient(180deg, #F6E9D5 0%, #DDC8A3 100%)'}}>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6" style={{background: 'linear-gradient(180deg, #F6E9D5 0%, #DDC8A3 100%)'}}>
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">关于我们</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                了解RWA Hub的愿景、使命和团队
              </p>
            </div>

            {/* RWA活动 */}
            <div className="rounded-2xl p-6 md:p-8 text-center" style={{background: 'linear-gradient(180deg, #F6E9D5 0%, #DDC8A3 100%)'}}>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6" style={{background: 'linear-gradient(180deg, #F6E9D5 0%, #DDC8A3 100%)'}}>
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">RWA活动</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                线上/线下活动、聚焦政策解读、项目路演、产业合作，帮助社区成员拓展商务与资源
              </p>
            </div>

            {/* 共享空间 */}
            <div className="rounded-2xl p-6 md:p-8 text-center" style={{background: 'linear-gradient(180deg, #F6E9D5 0%, #DDC8A3 100%)'}}>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6" style={{background: 'linear-gradient(180deg, #F6E9D5 0%, #DDC8A3 100%)'}}>
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">共享空间</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                如果你有空余的会议、办公场所或活动场地，可以免费或收费提供给RWA团队使用的长期使用，一起参与真实世界资产的创新与合作
              </p>
            </div>

            {/* 获得能量值 */}
            <div className="rounded-2xl p-6 md:p-8 text-center" style={{background: 'linear-gradient(180deg, #F6E9D5 0%, #DDC8A3 100%)'}}>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6" style={{background: 'linear-gradient(180deg, #F6E9D5 0%, #DDC8A3 100%)'}}>
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">获得能量值</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                学习、分享、贡献
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section - 来RWA Hub，为未来储值 */}
      <section className="relative bg-black flex items-center justify-center overflow-hidden py-24">
        {/* Background Image/Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#A98242] via-[#FFDCA3] to-[#A98242] bg-clip-text text-transparent">
            来RWA Hub，为未来储值
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12 leading-relaxed">
            关于RWA的一切，这一个AI就够了
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors duration-300 min-w-[200px]">
              立即注册
            </button>
            <button className="bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors duration-300 min-w-[200px]">
              已有账户？登录
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-green-500 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 bg-yellow-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2s' }}></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-green-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s', animationDuration: '1.5s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-5 h-5 bg-yellow-300 rounded-full opacity-30 animate-ping" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
        
        {/* Additional Floating Elements */}
        <div className="absolute top-10 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.2s', animationDuration: '2.5s' }}></div>
        <div className="absolute bottom-10 left-10 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '1.5s', animationDuration: '2s' }}></div>
        <div className="absolute top-2/3 left-10 w-4 h-4 bg-purple-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
      </section>

      {/* AI Chat Component */}
      <AIChatResponsive 
        isOpen={isChatOpen} 
        onClose={() => {
          setIsChatOpen(false);
          setChatInitialQuery('');
        }} 
        initialQuery={chatInitialQuery}
      />
    </main>
  );
}
