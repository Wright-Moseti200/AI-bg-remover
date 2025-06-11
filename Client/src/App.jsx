import React from 'react'
import { Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import BuyCredit from './pages/BuyCredit'
import Navbar from './components/Navbar'
import "./App.css"
import Footer from './components/Footer'
import Result from './pages/Result';
const App = () => {
  return (
    <div className='min-h-screen bg-slate-50'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/result' element={<Result/>}/>
        <Route path='/buy' element={<BuyCredit/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
