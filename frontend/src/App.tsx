import { createSignal, type Component } from 'solid-js';

import { Router, Route, Routes } from 'solid-app-router';
import styles from './App.module.css';
import SignUpForm from './form/signup';
import './App.scss'
import LoginForm from './form/login';
// import LoginForm from './form/login';
import AdminPage from "./dashboard/Admin"
import UsersPage from "./dashboard/User"
import Home from "./dashboard/Home"

function App(){
  const[isSignup,setIsSignup]= createSignal(false);
  const[isLogin, setIsLogin]= createSignal(false);
  

  const toggleFormMode=()=>{
    setIsSignup(!isSignup());
  };


  return (
    <div class={styles.App}>
     
   { isLogin() ?(
    <>     
    <AdminPage/>
    </>
    
   ):(
    <>
   {isSignup() ? <LoginForm isLogin={isLogin()} setIsLogin={setIsLogin}/>:<SignUpForm isSignup={isSignup()} setIsSignup={setIsSignup}/>}
  <button onClick={toggleFormMode}>
    {isSignup() ?  "New user? Sign Up":"Already have an account? Login"};
  </button> 
  </>
   )}
    {/* // 
    //   isAdmin() ?<AdminPage/>:<UsersPage/>
    // } */}
     
  
        
   
   </div>
  // <main>
  //   <Routes>
  //   <Route path="/" element={<Home/>}/>
  //   <Route path="Admin" element={<AdminPage/>}/>
  //   <Route path="User" element={<UsersPage/>}/>
  //   </Routes>
  // </main>
   
  );
};

export default App;
