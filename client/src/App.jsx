import React, {lazy} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Groups = lazy(() => import('./pages/Groups'));
const Chat = lazy(() => import('./pages/Chat'));
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/groups" element={<Groups/>} />
        <Route path="/chat/:chatId" element={<Chat/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  )
}

export default App