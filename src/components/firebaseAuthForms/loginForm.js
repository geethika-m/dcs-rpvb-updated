import React, { useState } from "react";
import useForm from "../../customHooks/useForm";
import { validateLogin } from "./validation";
import { useAuth } from "../../contexts/authContext";
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import * as RiIcons from 'react-icons/ri';
import LoginImage from '../../images/login_image.png'
import DCSLogo from '../../images/dcs_logo.png'

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
       <div className="login-container">
        <div className="left">
            <img src={LoginImage } alt="Login" />
        </div>
        <div className="right">
            <div className="logo-container">
                <img src={DCSLogo} alt="logo" />
                <h2 className="logo-title">Welcome Back DCS Staff!</h2>
                <p className="subtitle">Login with your details here</p>
            </div>
            <Form className="login-form">
                <div className="Login-form-content login-content">
                    
                    <Form.Group id="email" >
                        <Form.Label className="Login-label input-label">Email:</Form.Label><br/>
                        <Form.Control className="input-field"
                            name={"email"}
                            type={"email"}
                            value={values.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && ( <p className="validate-error">{errors.email} </p> )} 
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label className="Login-label input-label">Password:</Form.Label><br/>
                        <Form.Control className="input-field"
                            name={"password"}
                            type={"password"}
                            value={values.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && ( <p className="validate-error">{errors.password}</p> )}
                    </Form.Group>
                    <br/>
                    <Link className="forgot-password" to="/forgetPassword" exact="true">
                        Forgot Password?
                    </Link>
                    <br />
                    <br/>
                    <div className={`message ${message.includes("ERROR") ? 'errorMsg' : 'successMsg'}`}>
                    <strong style={{overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {message}
                    </strong>
                    </div>
                    <button
                        className={"login-btn"}
                        type={"submit"}
                        disabled={loading}
                        onClick={handleSubmit}
                    > Login
                    </button>                   
                </div>
            </Form>
        </div>
        </div>
        )   
    }    


export default LoginForm;