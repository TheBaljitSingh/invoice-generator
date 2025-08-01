import React from 'react';
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer >
      <div className="text-center text-xs text-gray-300 mt-2 bg-black p-2">
        © {new Date().getFullYear()} InvoiceGenerator — A tool by{" "}
        <a
          href="https://www.linkedin.com/in/thebaljitsingh"
          className="hover:text-white underline transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Baljit Singh
        </a>.
      </div>
    </footer>
  );
}
