import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#d9d9d9]">
      <div className="box-border content-start flex items-center justify-between pb-[160px] pt-[32px] px-[32px] size-full">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/rwa-logo.svg"
            alt="RWA Hub Logo"
            width={120}
            height={24}
            className="h-6 w-auto"
          />
        </div>
        
        {/* QR Codes */}
        <div className="flex space-x-6">
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
        
        {/* Copyright */}
        <div className="text-sm text-gray-500">
          © 2025 RWA Hub
        </div>
      </div>
    </footer>
  );
}