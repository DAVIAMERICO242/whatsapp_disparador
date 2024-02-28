
import {Login} from './pages/login/Login'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Painel} from './pages/logged/Painel'
import {RedirectAuthBased} from './RedirectAuthBased'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/" element={<RedirectAuthBased/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/painel" element={<Painel/>}/>
        {/* Add other routes here */}
      </Routes>
    </Router>
    </>
  )
}

export default App
