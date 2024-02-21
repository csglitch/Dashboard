import { createSignal, type Component, onMount } from 'solid-js';
import styles from './App.module.css';
import SignUpForm from './form/signup';
import './App.scss'
import LoginForm from './form/login';
import AdminPage from "./dashboard/Admin"

function App(){;
  const[isSignup,setIsSignup]= createSignal(false);
  const[isLogin, setIsLogin]= createSignal(false);
  

  const toggleFormMode=()=>{
    setIsSignup(!isSignup());
  };

  const checkToken = async () => {
    try {
      const response = await fetch('http://localhost:4000/validate', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsLogin(true);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error checking token');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4000/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsLogin(false);
        setIsSignup(true);
      }
    } catch (error) {
      console.error('Logout failed');
    }
  };

  onMount(() => {
    checkToken();
  });
  return (
    <div class={styles.App}>
     
   { isLogin() ?(
    <>     
    <AdminPage/>
    <button onClick={handleLogout}>Logout</button>
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
