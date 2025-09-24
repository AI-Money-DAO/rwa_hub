import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#d9d9d9]">
      <div className="box-border content-start flex items-end justify-between pb-[40px] pt-[32px] px-[32px] size-full relative">
        {/* Logo - moved more to top-left */}
        <div className="flex items-center absolute top-[20px] left-[20px]">
          <Image
            src="/rwa-logo.svg"
            alt="RWA Hub Logo"
            width={120}
            height={24}
            className="h-6 w-auto"
          />
        </div>
        
        {/* QR Codes - moved to bottom center, slightly up */}
        <div className="flex space-x-6 mx-auto mb-[5px]">
          <div className="text-center">
            <div className="w-20 h-20 bg-white border border-gray-300 rounded-lg flex items-center justify-center mb-2 p-2">
              <Image
                src="/wechat-qr.png"
                alt="微信公众号二维码"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs text-gray-500">微信公众号</span>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-white border border-gray-300 rounded-lg flex items-center justify-center mb-2 p-2">
              <Image
                src="/wechat-qr.png"
                alt="微信群二维码"
                width={64}
                height={64}
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