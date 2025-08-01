import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen ">
      {/* Radial gradient on right side */}

      <Navbar />
      <main className="flex-grow">{children}</main>
      {/* <Footer /> */}
    </div>
  )
}

export default MainLayout
