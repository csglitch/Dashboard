import { createSignal } from 'solid-js';
import './signup.scss';

import { Link } from 'solid-app-router';
interface SignUpFormProps{
  isSignup:boolean;
  setIsSignup:(value:boolean)=>void;
}

function SignUpForm(props: SignUpFormProps) {
  const [formData, setFormData] = createSignal({
    firstName:"",
    lastName: "",
    email: "",
    mobileNo: "",
    password: "",
   
    
  });
  const { isSignup, setIsSignup } = props;
  const handleSubmit = async (e:Event) => {
    e.preventDefault();
    // if (formData().password !== formData().retypepassword) {
    //   console.error("Passwords do not match!");
    //   return; 
    // }
    // if (!formData().agreeTerms) {
    //   console.error("Please agree to the terms.");
    //   return;}
    
    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData()),
      });
      const message = await response.json();
      if (message.status) {
        console.log(message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }

      if (!/^[\w.%+-]+@bajajfinserv\.in$/.test(formData().email)) {
        console.error("Please enter a valid email address with the domain @bajajfinserv.in.");
        return;
      }
    setIsSignup(true);
    console.log('Signup Form submitted:', formData());
  };
  const validatemobileNo = (value: string) => {
    const mobileNoRegex = /^\d{10}$/; // Matches exactly 10 digits
    return mobileNoRegex.test(value);
  };
  const validateNameLength = (value: string, minLength: number, maxLength: number) => {
    return value.length >= minLength && value.length <= maxLength;
  };

  return (
  
    <div class="form_wrapper">
  <div class="form_container">
    <div class="title_container">
      <h2>Sign Up</h2>
    </div>
    <div class="row clearfix">
      <div class="">
        <form onSubmit={handleSubmit}>
        <div class="row clearfix">
            <div class="col_half">
              <div class="input_field"> <span><i aria-hidden="true" class="fa fa-user"></i></span>
                <input type="text" name="name" placeholder="First Name" 
                 value={formData().firstName}
                 onInput={(e) => setFormData({ ...formData(), firstName: e.target.value })} required
                  />
                   {!validateNameLength(formData().firstName, 2, 20) && (
                <p class="error">First name must be between 2 and 20 characters.</p>
              )}
              </div>
            </div>
            <div class="col_half">
              <div class="input_field"> <span><i aria-hidden="true" class="fa fa-user"></i></span>
                <input type="text" name="name" placeholder="Last Name" 
                 value={formData().lastName}
                 onInput={(e) => setFormData({ ...formData(), lastName: e.target.value })} required />
                  {!validateNameLength(formData().lastName, 2, 20) && (
                <p class="error">Last name must be between 2 and 20 characters.</p>
              )}
              </div>
            </div>
          </div>
          <div class="input_field"> 
            <input type="email" 
            name="email"
            placeholder="Email" 
            value={formData().email}
                  onInput={(e) => setFormData({ ...formData(), email: e.target.value })}
                  required />
            {!/^[\w.%+-]+@bajajfinserv\.in$/.test(formData().email)&& (
              <p class="error">Please enter a valid email address with the domain @bajajfinserv.in</p>
            )}
          </div>
          <div class="input_field"> <span><i aria-hidden="true" class="fa fa-lock"></i></span>
            <input type="text" name="mobileNo" placeholder="Phone number" 
             value={formData().mobileNo}
             onInput={(e) => setFormData({ ...formData(), mobileNo: e.target.value })} required />
               {!validatemobileNo(formData().mobileNo) && (
            <p class="error">Please enter a valid 10-digit phone number.</p> )}
          </div>
          <div class="input_field"> <span><i aria-hidden="true" class="fa fa-lock"></i></span>
            <input type="password" name="password" placeholder="Password" 
             value={formData().password}
             onInput={(e) => setFormData({ ...formData(), password: e.target.value })} required />
          </div>
          {/* <div class="input_field"> <span><i aria-hidden="true" class="fa fa-lock"></i></span>
            <input type="password" name="password" placeholder="Re-type Password" 
             value={formData().retypepassword}
             onInput={(e) => setFormData({ ...formData(), retypepassword: e.target.value })} required />
              {formData().password !== formData().retypepassword && (
            <p class="error">Passwords do not match.</p>
          )}
          </div> */}
        
            
            
            {/* <div class="input_field checkbox_option">
            	<input type="checkbox" 
              name="agreeTerms"
              checked={formData().agreeTerms}
              id="cb1"
              onChange={(e) => setFormData({ ...formData(), agreeTerms: e.target.checked })}
              required/>
    			<label for="cb1">I agree with terms and conditions</label>
          {!formData().agreeTerms && (
            <p class="error">Please agree to the terms!</p>
          )}
            </div> */}
          
          <input class="button" type="submit" value="Register" />
          
        </form>
      </div>
    </div>
  </div>
  
</div>


    // <div class='Form'>
    // <form onSubmit={handleSubmit}>
    //   <div>
    //     <label for="Frist Name">First Name:</label>
    //     <input
    //       type="text"
    //       id="firstname"
    //       value={formData().firstname}
    //       onInput={(e) => setFormData({ ...formData(), firstname: e.target.value })}
    //       required
    //     />
    //   </div>
    //   <div>
    //     <label for="Last Name">Last Name:</label>
    //     <input
    //       type="text"
    //       id="lastname"
    //       value={formData().lastname}
    //       onInput={(e) => setFormData({ ...formData(), lastname: e.target.value })}
    //       required
    //     />
    //   </div>
    //   <div>
    //     <label for="email">Email:</label>
    //     <input
    //       type="email"
    //       id="email"
    //       value={formData().email}
    //       onInput={(e) => setFormData({ ...formData(), email: e.target.value })}
    //       required
    //     />
    //   </div>
    //   <div>
    //     <label for="password">Password:</label>
    //     <input
    //       type="password"
    //       id="password"
    //       value={formData().password}
    //       onInput={(e) => setFormData({ ...formData(), password: e.target.value })}
    //       required
    //     />
    //   </div>
    //   <div>
    //     <label for="Mobile No.">Mobile No.:</label>
    //     <input
    //       type="text"
    //       id="firstname"
    //       value={formData().firstname}
    //       onInput={(e) => setFormData({ ...formData(), firstname: e.target.value })}
    //       required
    //     />
    //   </div>
    //   <button type="submit">Sign Up</button>
    // </form>
   
  );
}

export default SignUpForm;




