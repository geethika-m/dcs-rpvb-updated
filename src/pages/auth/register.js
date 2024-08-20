import React from "react";
import Helmet from "react-helmet";
import ContentContainer from "../../components/pageLayout/contentContainer";
import AddUser from "../../components/firebaseAuthForms/addUserForm";


/**
 * @function Register
 * 
 * Register is a function that returns a ContentContainer component that contains a RegisterForm
 * component.
 * @returns A function that returns a JSX element.
 */
const Register = () => {
    return (
        <ContentContainer >
            <Helmet>
                <title>RPVB | Add New User</title>
            </Helmet>
            <AddUser />
        </ContentContainer>
    )
}

export default Register