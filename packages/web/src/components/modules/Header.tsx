'use client';

import React from 'react';
import Image from 'next/image';
import ConnectButton from './ConnectButton';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div className="flex items-center">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={40}
          height={40}
          className="h-10 w-auto"
        />
      </div>

      <div className="flex-1 flex justify-center">
        {/* The menu will be here */}
      </div>

      <div className="flex items-center">
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
