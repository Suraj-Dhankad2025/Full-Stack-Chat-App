import React, { lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute';
import { LayoutLoader } from './components/layout/Loaders';
import { Suspense } from 'react';
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Groups = lazy(() => import('./pages/Groups'));
const Chat = lazy(() => import('./pages/Chat'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const ChatManagement = lazy(() => import('./pages/admin/ChatManagement'));
const MessageManagement = lazy(() => import('./pages/admin/MessageManagement'));
let user = true;

const App = () => {
  return (
    <Router>
     <Suspense fallback={<LayoutLoader/>}>
     <Routes>
        <Route element={<ProtectRoute user={user} />}>
          <Route path='/' element={<Home />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/chat/:chatId" element={<Chat />} />
        </Route>
        <Route path="/login" element={
          <ProtectRoute user={!user}>
            <Login />
          </ProtectRoute>} />

          <Route path='/admin' element={<AdminLogin/>}></Route>
          <Route path='/admin/dashboard' element={<Dashboard/>}></Route>
          <Route path='/admin/users' element={<UserManagement/>}></Route>
          <Route path='/admin/chats' element={<ChatManagement/>}></Route>
          <Route path='/admin/messages' element={<MessageManagement/>}></Route>
          <Route path='*' element={<NotFound/>}/>
      </Routes>
     </Suspense>
    </Router>
  )
}

export default App