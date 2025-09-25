import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#d9d9d9]">
      <div className="box-border content-start flex flex-col pb-[40px] pt-[32px] px-[32px] size-full relative min-h-[140px]">
        {/* Logo - always at top-left */}
        <div className="flex items-center absolute top-[20px] left-[20px]">
          <Image
            src="/rwa-logo.svg"
            alt="RWA Hub Logo"
            width={120}
            height={24}
            className="h-6 w-auto"
          />
        </div>
        
        {/* QR Codes - centered at bottom, with enough top margin to avoid overlap */}
        <div className="flex space-x-6 justify-center mt-[60px]">
          <div className="text-center">
            <div className="w-28 h-28 bg-white border border-gray-300 rounded-lg flex items-center justify-center mb-2 p-2">
              <Image
                src="/wechat-qr.png"
                alt="微信公众号二维码"
                width={96}
                height={96}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs text-gray-500">微信公众号</span>
          </div>
          
          <div className="text-center">
            <div className="w-28 h-28 bg-white border border-gray-300 rounded-lg flex items-center justify-center mb-2 p-2">
              <Image
                src="/wechat-qr.png"
                alt="微信群二维码"
                width={96}
                height={96}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs text-gray-500">微信群</span>
          </div>
        </div>
        

      </div>
    </footer>
  );
}