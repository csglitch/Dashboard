

import { createSignal } from 'solid-js';
import './login.scss';
interface LoginFormProps{
  isLogin: boolean;
  setIsLogin:(value:boolean)=>void
}

const  LoginForm = (props:LoginFormProps ) => {
  const [loginData, setloginData] = createSignal({
    email: "",
    password: "",
  });
  const { isLogin, setIsLogin } = props;
  const handleFormSubmit = async (e: Event) => {
    e.preventDefault();
    if (!/^[\w.%+-]+@bajajfinserv\.in$/.test(loginData().email)) {
        console.error("Please enter a valid email address with the domain @bajajfinserv.in.");
        return; 
      }
      try {
        const response = await fetch('http://localhost:4000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData()),
          credentials: 'include'
        });
        const message = await response.json();
        if (message.status) {
          console.log(message);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
       setIsLogin(true) ;
console.log('Login Form Submitted', loginData());
 };


 

  return (
    <div class="form_wrapper">
  <div class="form_container">
    <div class="title_container">
      <h2>Login</h2>
    </div>
    <div class="row clearfix">
      <div class="">
    <form onSubmit={handleFormSubmit}>
    <div class="input_field"> 
           
      <input
        type="email"
        placeholder="Email"
        value={loginData().email}
        onInput={(e) => setloginData({ ...loginData(), email: e.target.value })}
                  required />
            {!/^[\w.%+-]+@bajajfinserv\.in$/.test(loginData().email)&& (
              <p class="error">Please enter a valid email address with the domain @bajajfinserv.in</p>
            )}
    </div>
      <input
        type="password"
        placeholder="Password"
        value={loginData().password}
        onChange={(e) => setloginData({ ...loginData(), password: e.target.value })}
      required/>
   
       <input class="button" type="submit" value="Login" />
          
    </form>
    </div>
    
    </div>
 
    </div>
  </div>
  );
}

export default LoginForm;


