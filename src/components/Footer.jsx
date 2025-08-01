import React from 'react';

export default function Footer() {
  return (
    <footer className=" text-gray-600 px-12 py-6 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Tool Name or Logo */}
      
      </div>

      {/* Bottom line */}
      <div className="text-center text-xs text-gray-400 mt-4">
        © {new Date().getFullYear()} InvoiceGenerator — A tool by <a className='hover:text-blue-600 shadow-xl' href="https://www.linkedin.com/in/thebaljitsingh">Baljit Singh</a>.
      </div>
    </footer>
  );
}
