import React, { useState } from 'react'
import useForm from "../../customHooks/useForm";
import { validateEmail } from './validation';
import { useAuth } from "../../contexts/authContext";
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import * as BiIcons from 'react-icons/bi';

/**
 * @function ForgetPasswordForm
 *
 * It renders a form that takes in an email address and sends a link to reset the password to the email
 * address
 * @returns The return value of the `useForm` hook is an object containing the following
 * properties: values, errors, loading
 */

const ForgetPasswordForm = () => {
    
    /* Setting the initial state of the component. */
    const valueState = {
        email: ''
    };
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const { forgetPassword } = useAuth();    
    
    /**
     * The function is called when the user clicks the submit button. It calls the forgetPassword
     * function from the auth.js file, which sends an email to the user with a link to reset their
     * password. If the email is not registered, an error message is displayed.
     */
    const sendEmail = () => {
        setMessage("");
        forgetPassword(values.email)
        .then(() => {
            setShowMessage(true);
            setMessage("SUCCESS: Reset Password link sent to registered email.");
        })
        .catch((error) => {
            if (error.code === "auth/user-not-found") {
                setShowMessage(true);
                setMessage("ERROR: Email is not a registered email.");
            } else {
                setShowMessage(true);
                setMessage("ERROR: Failed to send password reset email.");
            }
        });
    };
  
    /* Destructuring the object returned by the custom hook `useForm` */
    const { handleChange, handleSubmit, values, errors, loading } = useForm(validateEmail, valueState, sendEmail);

    return (
        <div className="ForgetPassword-form-container">
            <Form className="ForgetPassword-form ">
                <div className="ForgetPassword-form-content">
                    <h3 className="ForgetPassword-form-title ForgetPassword-icon">
                    <div><BiIcons.BiReset size={30} color="black" /></div>
                    Recover Account
                    <p className="ForgetPassword-form-subtitle">Please provide the email associated with your account for recovery.</p>
                    </h3>

                    <Form.Group id="email" >
                        <Form.Label className='ForgetPassword-label '>Email:</Form.Label><br/>
                        <Form.Control className="ForgetPassword-input-style "
                            name={"email"}
                            type={"email"}
                            value={values.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && ( <p className="validate-error">{errors.email} </p> )} 
                        <div className={`message ${message.includes("ERROR") ? 'errorMsg' : 'successMsg'}`}>
                            <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {message}
                            </strong>
                        </div>
                        <br/>
                    </Form.Group>
                    <button
                        className={"ForgetPassword-button"}
                        type={"submit"}
                        disabled={loading}
                        onClick={handleSubmit}
                    > Submit Email
                    </button><br/>
                    <div className='ForgetPassword-Link'>Go back to <Link to="/" exact="true">Login page</Link>. </div>    
                </div>
            </Form>
        </div>
    )
}

export default ForgetPasswordForm