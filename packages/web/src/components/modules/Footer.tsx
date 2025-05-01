"use client";

import { FaTelegramPlane, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-neutral-800 text-white py-6 mt-auto">
      <div className="container mx-auto flex justify-center space-x-6">
        <a
          href="https://t.me/crypto_nole"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-200 transition-colors"
        >
          <FaTelegramPlane size={28} />
        </a>
        <a
          href="https://github.com/spacebit"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-200 transition-colors"
        >
          <FaGithub size={28} />
        </a>
        <a
          href="https://www.linkedin.com/company/spacebit-crypto"
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
