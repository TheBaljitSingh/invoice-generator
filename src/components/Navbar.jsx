import React, { useEffect, useState } from 'react';
import { FaGithub, FaInstagram } from "react-icons/fa";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`px-24 py-4 sticky top-0 z-50 transition-all duration-500 
  flex justify-between items-center 
  ${scrolled 
    ? "bg-black/60 backdrop-blur-md shadow-2xl animate-waterBlur" 
    : "bg-black/30 backdrop-blur-sm"
  } bg-black`}>

      
      <div className='text-white font-bold text-xl'>Invoice Generator</div>
      <div className='flex gap-4 items-center text-white'>
        <a href="https://github.com/TheBaljitSingh" className="hover:text-gray-400 transition-colors">
          <FaGithub size={24} />
        </a>
        {/* <a href="#" className="hover:text-pink-500 transition-colors">
          <FaInstagram size={24} />
        </a> */}
      </div>
    </div>
  );
}
