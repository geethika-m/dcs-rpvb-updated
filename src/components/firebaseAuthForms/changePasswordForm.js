import React, { useState } from "react";
import ReactDOM from 'react-dom';
import { Form, Toast } from "react-bootstrap";
import useForm from "../../customHooks/useForm";
import { validateChangePassword } from "./validation";
import { useAuth } from "../../contexts/authContext";
import * as RiIcons from 'react-icons/ri';

/**
 * @function ChangePasswordForm
 *
 * It returns a form that allows user to change their password
 * @returns The return value of the `useForm` hook is an object containing the following
 * properties: values, errors, loading
 */

const ChangePasswordForm = () => {

    /* Setting the initial state of the form. */
    const valueState = {
        currentPassword: '',
        newPassword: '',
        cfmPassword: ''
    };

    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [view, setView] = useState(false);
    const {changePassword} = useAuth();

    /**
     * ChangePassword() is a function that takes two arguments, the current password and the new
     * password, and returns a promise that resolves if the current password is valid and rejects if it
     * is invalid.
     */
    const changePwd = async () => {
        try{
            const changePwdResult = await changePassword(values.currentPassword, values.newPassword)
            if(changePwdResult.includes("SUCCESS"))
            {
                setShowMessage(true);
                setMessage("Change Password Successful!");
            }
            else {
                setShowMessage(true);
                setMessage(changePwdResult);
            }
        }
        catch {
            setShowMessage(true);
                setMessage("ERROR: Something went wrong.")
        }
    }
    
    /* Destructuring the object returned by the custom hook `useForm` */
    const { handleChange, handleSubmit, values, errors, loading } = useForm(validateChangePassword, valueState, changePwd);  
        
    return (
        <div className="ChangePassword-form-container">
            <Form className="ChangePassword-form">
                <div className="Login-form-content">
                    <h3 className="Login-form-title Login-icon">
                        <div><RiIcons.RiLoginCircleLine size={30} color="black" /></div>
                        Change Password
                        <p className="Login-form-subtitle">Please enter your new password.</p>
                    </h3>
                    <Form.Group id="currentPassword" >
                        <Form.Label className="Login-label">Current Password:</Form.Label><br/>
                        <Form.Control className="login-input-style "
                            name={"currentPassword"}
                            type={"password"}
                            value={values.currentPassword}
                            minLength={"8"} 
                            maxLength={"256"}
                            onChange={handleChange}
                            required
                        />
                        {errors.currentPassword && ( <p className="validate-error">{errors.currentPassword} </p> )}  
                    </Form.Group>
                    <Form.Group id="newPassword">
                        <Form.Label className="Login-label">New Password:{/* <AiIcons.AiFillQuestionCircle
                                onMouseEnter={() => setIsHover(true)}
                                onMouseLeave={() => setIsHover(false)}/>  */}
                        </Form.Label><br/>
                        <Form.Control className="login-input-style "
                            name={"newPassword"}
                            type={"password"}
                            value={values.newPassword}
                            minLength={"8"} 
                            maxLength={"256"}
                            onChange={handleChange}
                            required
                        /> 
                        {errors.newPassword && ( <p className="validate-error">{errors.newPassword} </p> )}        
                    </Form.Group>
                    <Form.Group id="cfmPassword">
                        <Form.Label className="Login-label">Confirm Password:</Form.Label><br/>
                        <Form.Control className="login-input-style "
                            name={"cfmPassword"}
                            type={"password"}
                            value={values.cfmPassword}
                            minLength={"8"} 
                            maxLength={"256"}
                            onChange={handleChange}
                            required
                        />
                        {errors.cfmPassword && ( <p className="validate-error">{errors.cfmPassword} </p> )}                    
                    </Form.Group>
                   {/*  {IsHover && (
                                <Form.Text>
                                Please ensure your new password matches the follow standard:<br />&emsp;&bull; 8 Characters long
                                <br />&emsp;&bull; Minimum 1 lowercase alphabet<br />&emsp;&bull; Minimum 1 uppercase alphabet
                                <br />&emsp;&bull; Minimum 1 special character<br />&emsp;&bull; Minimum 1 digit
                                </Form.Text>
                                )} */}
                    <br/>
                    <div className={`message ${message.includes("ERROR") ? 'errorMsg' : 'successMsg'}`}>
                    <strong>
                        {message}
                    </strong>
                    </div>
                    <strong>
                    {errors.newPassword && errors.newPassword.includes("minimum requirements") && (
                    <div className="errorMsg">
                        Password requirements:
                        <ul>
                        <li>8 characters or more</li>
                        <li>At least one lowercase letter</li>
                        <li>At least one uppercase letter</li>
                        <li>At least one special character</li>
                        <li>At least one digit</li>
                        </ul>
                    </div>
                    )}
                    </strong>
                    <button
                        className={"changepwd-button"}
                        type={"submit"}
                        disabled={loading}
                        onClick={handleSubmit}
                    > Change Password
                    </button>                    
                </div>
            </Form>
            {view && ReactDOM.createPortal(
                <div style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    background: "#FFFBC0",
                }}  >
                    <Toast onClose={() => setView(false)} show={view} delay={2400} autohide>
                        <Toast.Header>
                            <strong className={message.includes('ERROR') ? 'mr-auto text-danger' : 'mr-auto text-success'}>{message}</strong>
                        </Toast.Header>
                    </Toast>
                </div>,
                document.body
            )}
        </div>
    )       
}

export default ChangePasswordForm;