"use client";

import { FaTelegramPlane, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-6 mt-auto">
      <div className="container mx-auto flex justify-center space-x-6">
        <a
          href="https://t.me/andreevmaks"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-200 transition-colors"
        >
          <FaTelegramPlane size={28} />
        </a>
        <a
          href="https://github.com/Maksandre/nole-nfts"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-200 transition-colors"
        >
          <FaGithub size={28} />
        </a>
        <a
          href="https://linkedin.com/in/maxick"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-200 transition-colors"
        >
          <FaLinkedin size={28} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
