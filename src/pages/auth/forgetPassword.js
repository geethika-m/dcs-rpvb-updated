import React from 'react'
import { Helmet } from 'react-helmet';
import PageFooter from "../../components/pageLayout/footer";
import ForgetPasswordForm from '../../components/firebaseAuthForms/forgetPasswordForm';

/**
 * @function ForgetPassword
 * 
 * It returns a JSX element that contains the Header, ForgottenPasswordForm, and Footer components.
 * @returns The Header, ForgottenPasswordForm, and Footer components are being returned.
 */
const ForgetPassword = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>RPVB | Forgotten Password</title>
            </Helmet>
            <div className="login-fgtpwd-background sub-container" >
                <ForgetPasswordForm />
            </div>
            <div className="footer-noscroll">
                <PageFooter />
            </div>
        </React.Fragment>
    )
}

export default ForgetPassword