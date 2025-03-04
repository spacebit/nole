"use client";

import React from "react";
import Image from "next/image";
import ConnectButton from "./ConnectButton";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
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
        <Link href="/" className="text-gray-800 hover:text-black">
          Minter
        </Link>
        <span className="text-gray-400 cursor-not-allowed">Marketplace (Coming Soon)</span>
      </nav>

      {/* Connect Button */}
      <div className="flex items-center">
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
