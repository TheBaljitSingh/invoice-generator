import React from 'react'
import { FaGithub, FaInstagram  } from "react-icons/fa";

export default function Navbar() {
  return (
    <div className='px-24 py-6 flex justify-between items-center stickytop-0'>
      <div className='text-black font-bold text-xl'>Inovice Generator</div>
      <div className='flex  gap-4 items-center'>
      <FaGithub /> 
      <FaInstagram />
      </div>

    </div>
  )
}
