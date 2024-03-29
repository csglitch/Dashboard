import { createSignal, createEffect } from "solid-js";
import styles from "./App.module.css";
import SignUpForm from "./form/signup";
import "./App.scss";
import LoginForm from "./form/login";
import AdminPage from "./dashboard/Admin";

function App() {
  const [isLoading, setIsLoading] = createSignal(true);
  const [isSignup, setIsSignup] = createSignal(true);
  const [isLogin, setIsLogin] = createSignal(false);
  const [tokenChecked, setTokenChecked] = createSignal(false);

  const toggleFormMode = () => {
    setIsSignup(!isSignup());
  };

  const checkToken = async () => {
    try {
      const response = await fetch("http://localhost:4000/validate", {
        method: "POST",
        credentials: "include",
      });
      // console.log(response);
      if (response.ok) {
        setIsLogin(true);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Error checking token:", error);
      handleLogout();
    } finally {
      setTokenChecked(true);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsLogin(false);
      }
    } catch (error) {
      console.error("Logout failed");
    }
  };

  createEffect(() => {
    checkToken();
  }, []);

  return (
    <div class={styles.App}>
      {isLoading() ? (
        <div>Loading...</div>
      ) : (
        <>
          {tokenChecked() && (
            <>
              {isLogin() ? (
                <>
                  <AdminPage />
                  <button onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  {isSignup() ? (
                    <LoginForm isLogin={isLogin()} setIsLogin={setIsLogin} />
                  ) : (
                    <SignUpForm
                      isSignup={isSignup()}
                      setIsSignup={setIsSignup}
                    />
                  )}
                  <button onClick={toggleFormMode}>
                    {isSignup()
                      ? "New user? Sign Up"
                      : "Already have an account? Login"}
                  </button>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
