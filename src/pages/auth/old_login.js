import React from "react";
import Helmet from "react-helmet";
import PageFooter from "../../components/pageLayout/footer";
import LoginForm from "../../components/firebaseAuthForms/loginForm";

/**
 * @function Login
 * 
 * Login is a function that returns a Helmet, Header, RegisterForm, and Footer component.
 * @returns Login Page.
 */

const Login = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>RPVB | Login</title>
            </Helmet>
            <div className="login-fgtpwd-background sub-container" >
                <LoginForm />
            </div>
            <div className="footer-noscroll">
                <PageFooter />
            </div>
        </React.Fragment>
    )
}

export default Login