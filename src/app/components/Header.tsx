'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 flex items-center justify-between px-4 md:px-8 lg:px-16 py-4 md:py-6">
      <div className="flex items-center">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/rwa-logo.svg"
            alt="RWA Hub Logo"
            width={232}
            height={36}
            className="h-6 md:h-9 w-auto"
          />
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
        <Link href="/" className="text-white hover:text-yellow-400 transition-colors border border-yellow-400 px-3 py-1.5 xl:px-4 xl:py-2 rounded-md text-sm xl:text-base">
          首页
        </Link>
        <a href="#" className="text-white hover:text-yellow-400 transition-colors text-sm xl:text-base">
          关于我们
        </a>
        <a href="#" className="text-white hover:text-yellow-400 transition-colors text-sm xl:text-base">
          社区
        </a>
      </div>

      {/* Desktop Right Section */}
      <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm xl:text-base">中文</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm xl:text-base">English</span>
        </div>
        <a href="#" className="text-white hover:text-yellow-400 transition-colors text-sm xl:text-base">
          登录
        </a>
        <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 xl:px-6 xl:py-2 rounded-md font-medium transition-colors text-sm xl:text-base">
          注册
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden text-white p-2 relative z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-15 right-0 w-48 bg-black/95 backdrop-blur-sm border border-gray-700 rounded-bl-lg shadow-xl z-[100]">
          <div className="px-3 py-3 space-y-2">
            <Link 
              href="/" 
              className="block text-white hover:text-yellow-400 transition-colors border border-yellow-400 px-2 py-1.5 rounded text-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              首页
            </Link>
            <a 
              href="#" 
              className="block text-white hover:text-yellow-400 transition-colors py-1.5 text-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              关于我们
            </a>
            <a 
              href="#" 
              className="block text-white hover:text-yellow-400 transition-colors py-1.5 text-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              社区
            </a>
            
            <div className="border-t border-gray-700 pt-2 space-y-2">
              <div className="flex items-center justify-center space-x-1.5">
                <span className="text-white text-xs">中文</span>
                <span className="text-gray-400 text-xs">|</span>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer text-xs">EN</span>
              </div>
              <a 
                href="#" 
                className="block text-white hover:text-yellow-400 transition-colors py-1.5 text-center text-xs"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                登录
              </a>
              <button 
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded font-medium transition-colors text-xs"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                注册
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}