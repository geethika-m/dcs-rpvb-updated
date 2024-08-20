import React from 'react'
import { Helmet } from 'react-helmet';
import ContentContainer from "../../components/pageLayout/contentContainer";
import ChangePasswordForm from "../../components/firebaseAuthForms/changePasswordForm";


/**
 * @function ForgetPassword
 * 
 * It returns a JSX element that contains the Header, ForgottenPasswordForm, and Footer components.
 * @returns The Header, ForgottenPasswordForm, and Footer components are being returned.
 */
const ChangePassword = () => {
    return (
        <ContentContainer >
            <Helmet>
                <title>RPVB | Change Password</title>
            </Helmet>
            <ChangePasswordForm />
        </ContentContainer>
    )
}

export default ChangePassword