'use client';

import Link from 'next/link';

export default function CommunityPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E9E9E9' }}>
      {/* Main Content */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="flex flex-col items-center px-4 md:px-6 lg:px-0 gap-2 w-full max-w-7xl mx-auto lg:absolute lg:w-[1920px] lg:left-0 lg:top-[139px] lg:min-h-[3200px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start w-full h-full">
            {/* Left Content */}
            <div className="space-y-3 md:space-y-4 lg:space-y-3 order-1 lg:order-1 flex flex-col justify-start h-full lg:pl-16 xl:pl-20">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                  在这里，每一次学习、分享、贡献，都会为你积累能量值。
                </h1>
                
                <div className="space-y-2 md:space-y-3 lg:space-y-2">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3 lg:mb-2">
                      能量值是 RWA Hub 的专属积分，可以用于：
                    </h2>
                    <ul className="space-y-1 md:space-y-2 lg:space-y-1">
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
                    <ul className="space-y-2 md:space-y-3 mb-6">
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
                    
                    <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base leading-relaxed">
                      简单来说，你在社区的每一次参与，都是为自己攒下一份长期的价值。
                    </p>
                    <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base leading-relaxed">
                      无论是学习RWA知识，还是贡献智慧与经验，你的努力都会沉淀为实实在在的能量值。
                    </p>
                    <p className="text-gray-800 font-medium text-sm md:text-base mb-0">
                      加入我们，用能量值点亮你的RWA之旅！
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Illustration */}
            <div className="flex justify-center items-center order-2 lg:order-2 lg:h-full lg:min-h-screen lg:py-16">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                {/* 3D Earth with Buildings Illustration */}
                <div className="relative">
                  {/* Main Earth Globe */}
                  <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 mx-auto relative">
                    {/* Earth Base - replaced with sq.png */}
                    <img 
                      src="/sq.png" 
                      alt="RWA Hub" 
                      className="w-full h-full object-cover"
                    />
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