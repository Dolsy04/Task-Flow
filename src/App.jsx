import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import  ProtectedRoute  from "./supabase/protectedRoute"
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signupPage";
import EmailVerificationAlert from './pages/emailVerification';
import UpdatePasswordPage from "./pages/updatePasswordPage";
import DashBoardPage from "./pages/dashboardPage";
import OverviewPage from "./pages/overviewPage";
import TaskContent from "./components/taskContent";
import PendingTaskPage from "./pages/pendingTaskPage";
import DoneTaskPage from "./pages/doneTaskPage";
import DoingTaskPage from "./pages/doingTaskPage";
import SettingPage from "./pages/settingPage";
import Profile from "./pages/profilePage";
import { supabase } from './supabase/supabase';
import { useAuth } from './supabase/authContext';
import Loader from './components/ui/loader';


function App() {
  const { user, isLoading } = useAuth();
  
  if (isLoading){
      return <div className="w-full h-screen flex items-center justify-center">
          <Loader />
      </div>;
  }
  



  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
    <Routes>
      <Route path="/" element={ <LoginPage /> } />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/emailverification" element={<EmailVerificationAlert />} />
      <Route path="/updatepassword" element={<UpdatePasswordPage />} />

      <Route path='/dashboard' element={
        <ProtectedRoute>
          <DashBoardPage />
        </ProtectedRoute>
      }>
        <Route index element={<OverviewPage />}/>
        <Route path="task" element={<TaskContent />}/>
        <Route path="pendingPage" element={<PendingTaskPage />}/>
        <Route path="donePage" element={<DoneTaskPage />}/>
        <Route path="doingPage" element={<DoingTaskPage />}/>
        <Route path="settingPage" element={<SettingPage />}/>
        <Route path="profilePage" element={<Profile />}/>

      </Route>
    </Routes>
    </>
  )
}

export default App
