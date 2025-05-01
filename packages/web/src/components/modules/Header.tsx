"use client";

import React from "react";
import Image from "next/image";
import ConnectButton from "./ConnectButton";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex justify-center space-x-6 text-lg font-bold">
        <Link href="/app" className="text-gray-800 hover:text-black">
          Minter
        </Link>
        <span className="text-gray-400 cursor-not-allowed">Market (soon)</span>
      </nav>

      {/* Connect Button */}
      <div className="flex items-center">
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
