import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MainLayout = ({children})=>{
    return(
        < >
        <Navbar/>
        <main className='min-h-screen px-4 py-8'>{children}
        </main>
        <Footer/>
        </>
    )
}

export default MainLayout;