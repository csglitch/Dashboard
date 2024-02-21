import { createSignal, type Component } from 'solid-js';
import styles from './App.module.css';
import SignUpForm from './form/signup';
import './App.scss'
import LoginForm from './form/login';
import AdminPage from "./dashboard/Admin"

function App(){;
  const xyz = true;
  const[isSignup,setIsSignup]= createSignal(false);
  const[isLogin, setIsLogin]= createSignal(xyz);
  

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
   
   </div>
  );
};

export default App;
