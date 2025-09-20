'use client';

import Link from 'next/link';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8 order-1 lg:order-1">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                  在这里，每一次学习、分享、贡献，都会为你积累能量值。
                </h1>
                
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">
                      能量值是 RWA Hub 的专属积分，可以用于：
                    </h2>
                    <ul className="space-y-2 md:space-y-3">
                      <li className="flex items-start space-x-3">
                        <span className="text-gray-600 mt-1 text-sm md:text-base">▶</span>
                        <span className="text-gray-700 text-sm md:text-base">抵扣平台服务费用</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-gray-600 mt-1 text-sm md:text-base">▶</span>
                        <span className="text-gray-700 text-sm md:text-base">使用广告位资源</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-gray-600 mt-1 text-sm md:text-base">▶</span>
                        <span className="text-gray-700 text-sm md:text-base">项目发行及相关费用</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-gray-600 mt-1 text-sm md:text-base">▶</span>
                        <span className="text-gray-700 text-sm md:text-base">以及平台未来开放的更多合规权益</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
                      这些合规权益包括：
                    </h3>
                    <ul className="space-y-2 md:space-y-3">
                      <li className="flex items-start space-x-3">
                        <span className="text-gray-600 mt-1 text-sm md:text-base">▶</span>
                        <span className="text-gray-700 text-sm md:text-base">在合规框架下，能量值可能与 RWA 项目服务打通，用于支持资产上链、流转等应用；</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-gray-600 mt-1 text-sm md:text-base">▶</span>
                        <span className="text-gray-700 text-sm md:text-base">未来可出可能探索在合规渠道中，将能量值映射到 RWA 生态，帮助用户参与更多价值增值的场景。</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
                      那么，如何获得能量值呢？
                    </h3>
                    <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base">你可以通过：</p>
                    <ul className="space-y-2 md:space-y-3">
                      <li className="flex items-start space-x-3">
                        <span className="text-gray-600 mt-1 text-sm md:text-base">▶</span>
                        <span className="text-gray-700 text-sm md:text-base">为AI提供语料，共建高质量知识库</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-gray-600 mt-1 text-sm md:text-base">▶</span>
                        <span className="text-gray-700 text-sm md:text-base">参与话题讨论，保障信息真实可靠</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-gray-600 mt-1 text-sm md:text-base">▶</span>
                        <span className="text-gray-700 text-sm md:text-base">加入平台合作，一起推动项目落地</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-gray-600 mt-1 text-sm md:text-base">▶</span>
                        <span className="text-gray-700 text-sm md:text-base">通过平台签单，创造真实业务场景</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                    <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base">
                      简单来说，你在社区的每一次参与，都是为自己攒下一份长期的价值。
                    </p>
                    <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base">
                      无论是学习RWA知识，还是贡献智慧与经验，你的努力都会沉淀为实实在在的 能量值。
                    </p>
                    <p className="text-gray-800 font-semibold text-sm md:text-base">
                      加入我们，用能量值点亮你的RWA之旅！
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Illustration */}
            <div className="flex justify-center items-center order-2 lg:order-2">
              <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-lg">
                {/* 3D Earth with Buildings Illustration */}
                <div className="relative">
                  {/* Main Earth Globe */}
                  <div className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 mx-auto relative">
                    {/* Earth Base */}
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 via-blue-500 to-blue-600 relative overflow-hidden shadow-2xl">
                      {/* Grid Pattern */}
                      <div className="absolute inset-0 opacity-30">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                            </pattern>
                          </defs>
                          <rect width="100" height="100" fill="url(#grid)" />
                        </svg>
                      </div>
                      
                      {/* RWA Hub Text in Center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-white font-bold text-base md:text-lg">RWA</div>
                          <div className="text-white font-bold text-base md:text-lg">Hub</div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Buildings and Elements */}
                    {/* Building 1 - Top Left */}
                    <div className="absolute -top-6 md:-top-8 -left-6 md:-left-8 transform -rotate-12">
                      <div className="w-12 h-16 md:w-16 md:h-20 bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg shadow-lg">
                        <div className="w-full h-1.5 md:h-2 bg-gray-300 rounded-t-lg"></div>
                        <div className="grid grid-cols-3 gap-0.5 md:gap-1 p-1.5 md:p-2">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-300 rounded-sm opacity-80"></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Building 2 - Top Right */}
                    <div className="absolute -top-4 md:-top-6 -right-8 md:-right-10 transform rotate-12">
                      <div className="w-10 h-18 md:w-12 md:h-24 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg shadow-lg">
                        <div className="w-full h-1.5 md:h-2 bg-blue-300 rounded-t-lg"></div>
                        <div className="grid grid-cols-2 gap-0.5 md:gap-1 p-1.5 md:p-2">
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-200 rounded-sm opacity-80"></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Building 3 - Bottom Left */}
                    <div className="absolute -bottom-3 md:-bottom-4 -left-10 md:-left-12 transform rotate-6">
                      <div className="w-11 h-14 md:w-14 md:h-18 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg shadow-lg">
                        <div className="w-full h-1.5 md:h-2 bg-purple-300 rounded-t-lg"></div>
                        <div className="grid grid-cols-2 gap-0.5 md:gap-1 p-1.5 md:p-2">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-pink-200 rounded-sm opacity-80"></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Building 4 - Bottom Right */}
                    <div className="absolute -bottom-4 md:-bottom-6 -right-6 md:-right-8 transform -rotate-6">
                      <div className="w-14 h-17 md:w-18 md:h-22 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg shadow-lg">
                        <div className="w-full h-1.5 md:h-2 bg-green-300 rounded-t-lg"></div>
                        <div className="grid grid-cols-3 gap-0.5 md:gap-1 p-1.5 md:p-2">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-lime-200 rounded-sm opacity-80"></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Floating Icons */}
                    {/* Laptop */}
                    <div className="absolute top-10 md:top-12 -left-12 md:-left-16 transform rotate-12">
                      <div className="w-6 h-4 md:w-8 md:h-6 bg-gray-700 rounded-t-lg shadow-md">
                        <div className="w-full h-3 md:h-4 bg-blue-400 rounded-t-lg border border-gray-600"></div>
                      </div>
                    </div>

                    {/* Mobile Phone */}
                    <div className="absolute top-16 md:top-20 -right-11 md:-right-14 transform -rotate-12">
                      <div className="w-3 h-6 md:w-4 md:h-8 bg-gray-800 rounded-lg shadow-md">
                        <div className="w-full h-4 md:h-6 bg-white rounded-lg m-0.5 border"></div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="absolute bottom-12 md:bottom-16 -left-11 md:-left-14 transform rotate-45">
                      <div className="w-5 h-6 md:w-6 md:h-8 bg-white rounded shadow-md border">
                        <div className="w-3 h-0.5 md:w-4 md:h-1 bg-gray-300 rounded mx-1 mt-1"></div>
                        <div className="w-2 h-0.5 md:w-3 md:h-1 bg-gray-300 rounded mx-1 mt-1"></div>
                        <div className="w-3 h-0.5 md:w-4 md:h-1 bg-gray-300 rounded mx-1 mt-1"></div>
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="absolute bottom-10 md:bottom-12 -right-12 md:-right-16 transform -rotate-45">
                      <div className="w-6 h-4 md:w-8 md:h-6 bg-white rounded shadow-md border p-0.5 md:p-1">
                        <div className="flex items-end justify-between h-full">
                          <div className="w-0.5 md:w-1 h-1.5 md:h-2 bg-blue-500 rounded-t"></div>
                          <div className="w-0.5 md:w-1 h-2 md:h-3 bg-green-500 rounded-t"></div>
                          <div className="w-0.5 md:w-1 h-0.5 md:h-1 bg-red-500 rounded-t"></div>
                          <div className="w-0.5 md:w-1 h-3 md:h-4 bg-purple-500 rounded-t"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}