import axios from 'axios';
import React, { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import ProtectRoute from './components/auth/ProtectRoute';
import { LayoutLoader } from './components/layout/Loaders';
import { server } from './constants/config';
import { authState } from './recoil/atoms';
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


const App = () => {
  const [userAuth, setUserAuth] = useRecoilState(authState);
  const { user,loader } = userAuth;
  useEffect(() => {
    axios.get(`${server}/api/v1/user/me`)
    .then(res => {
        console.log(user);
      }).catch(err => {
        setUserAuth(prevState => ({
          ...prevState,
          user: null,
          loader: false,
        }));
      })
  }, [])
  return loader ? (
    <LayoutLoader/>
  ) : (
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
      <Toaster position='bottom-center'/>
    </Router>
  )
}

export default App