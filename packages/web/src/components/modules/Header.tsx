"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ConnectButton from "./ConnectButton";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinkClass = (href: string) => {
    const base = "transition-colors font-medium px-1";
    const isActive = pathname === href;

    return `${base} ${
      isActive
        ? "text-black border-b-2 border-black"
        : "text-gray-800 hover:text-black hover:border-b hover:border-gray-300"
    }`;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" aria-label="Home">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/app" className={navLinkClass("/app")}>
            Minter
          </Link>
          <span className="text-gray-400 cursor-not-allowed">
            Market (soon)
          </span>
        </nav>

        {/* Connect Button */}
        <div className="hidden md:flex">
          <ConnectButton />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-black transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4 pt-2 space-y-2">
          <Link
            href="/app"
            className={navLinkClass("/app")}
            onClick={() => setIsMenuOpen(false)}
          >
            Minter
          </Link>
          <span className="block text-gray-400">Market (soon)</span>
          <div className="pt-2">
            <ConnectButton />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
