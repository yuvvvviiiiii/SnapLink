
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SignUp, SignIn, Dashboard, Settings, Analytics } from './pages';
import { Toaster } from 'react-hot-toast';
import Links from './pages/links/links';

function App() {
  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/links' element={<Links/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/analytics' element={<Analytics/>}/>
      </Routes>
    </BrowserRouter>
    <Toaster/>
    </>
  )
}

export default App
