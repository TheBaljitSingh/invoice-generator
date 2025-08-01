import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import MainLayout from './layouts/MainLayout';
import Home from "./pages/Home";

function App() {

  return (
   <Router>
    <MainLayout>
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
    </MainLayout>

   </Router>
  )
}

export default App
