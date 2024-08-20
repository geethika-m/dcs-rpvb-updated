import React, { useState } from "react";
import useForm from "../../customHooks/useForm";
import { validateLogin } from "./validation";
import { useAuth } from "../../contexts/authContext";
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import * as RiIcons from 'react-icons/ri';

/**
 * @function LoginForm
 *
 * It's a login form that takes in email and password, and validates the input using the validateLogin
 * function.
 * @returns The return value of the `useForm` hook is an object containing the following
 * properties: values, errors, loading
 **/

const LoginForm = () => {

    const { login } = useAuth();
    const [message, setMessage] = useState('');
    const [showMessage,setShowMessage] = useState(false);

    /* Initializing the state of the form. */
    const valueState = {
        email: '',
        password: ''
    };

    /**
     * When the user clicks the login button, the login function is called with the values of the name
     * and password fields, and if the login is successful, the user is redirected to the homepage.
     */
    const loginUser = async () => {
        try {
            const loginResult = await login(values.email, values.password)
                setMessage(loginResult);
                setShowMessage(true);
        }
        catch{
            setMessage("ERROR: Something went wrong!");
            setShowMessage(true);
        }
    }

    /* Destructuring the object returned by the custom hook `useForm` */
    const { handleChange, handleSubmit, values, errors, loading } = useForm(validateLogin, valueState, loginUser);

    return (
        <div className="Login-form-container">
            <Form className="Login-form">
                <div className="Login-form-content">
                    <h3 className="Login-form-title Login-icon">
                        <div><RiIcons.RiLoginCircleLine size={30} color="black" /></div>
                        Log in to your account
                        <p className="Login-form-subtitle">Welcome back! Please enter your details.</p>
                    </h3>

                    <Form.Group id="email" >
                        <Form.Label className="Login-label">Email:</Form.Label><br/>
                        <Form.Control className="login-input-style "
                            name={"email"}
                            type={"email"}
                            value={values.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && ( <p className="validate-error">{errors.email} </p> )} 
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label className="Login-label">Password:</Form.Label><br/>
                        <Form.Control className="login-input-style "
                            name={"password"}
                            type={"password"}
                            value={values.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && ( <p className="validate-error">{errors.password}</p> )}
                    </Form.Group>
                    <br/>
                    <Link className="forgetPassword-Link" to="/forgetPassword" exact="true">
                        Forgotten Password?
                    </Link>
                    <br />
                    <br/>
                    <div className={`message ${message.includes("ERROR") ? 'errorMsg' : 'successMsg'}`}>
                    <strong style={{overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {message}
                    </strong>
                    </div>
                    <button
                        className={"login-button"}
                        type={"submit"}
                        disabled={loading}
                        onClick={handleSubmit}
                    > Login
                    </button>                   
                </div>
            </Form>
        </div>
        )   
    }    


export default LoginForm;