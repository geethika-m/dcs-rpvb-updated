import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Card } from "react-bootstrap";
import { auth } from '../../firebase';
import { applyActionCode } from "firebase/auth";
import * as RiIcons from 'react-icons/ri'
import PageFooter from '../pageLayout/footer';

/**
 * It takes in the action code and verifies the email address
 * @param props - { actionCode }
 * @returns The component is being returned.
 */
const EmailVerification = (props) => {

    /**
     * Redirect user to the login page.
     */
    const redirectUser = () => {
        navigate("/");
    }

    /* Setting the state of the component. */
    const [proceed, setProceed] = useState(false);
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    /* Destructuring objects */
    const { actionCode } = props;

    useEffect(() => {
        applyActionCode(auth, actionCode)
            .then(() => {
                /* Email address has been verified. */
                setMessage('Account has been Successfully Verified!');
                setStatus('Success!');
                setProceed(true);
            }).catch(() => {
                setMessage('Invalid or expired action code. Please try resetting the password again.');
                setStatus('Something went wrong!');
                setProceed(true);
            });
    }, [actionCode]);

    return (
        <div className="login-fgtpwd-background sub-container" >
            <div className="Login-form-container">
                <div className="Login-form">
                {proceed &&
                    <Card className="Login-form-content">
                        <Card.Body>
                        <h3 className="Login-form-title Login-icon">
                        <div><RiIcons.RiErrorWarningFill size={30} color="black" /></div>
                        {status}
                        <p className="Login-form-subtitle">{message}</p>
                    </h3>
                            <button
                                className={"login-button"}
                                type={"button"}
                                onClick={() => redirectUser()}
                            >
                                Back to Log in
                            </button>
                        </Card.Body>
                        <div className="footer-noscroll">
                            <PageFooter />
                        </div>
                    </Card>
                }
                </div>
            </div>
        </div>
    )
}

export default EmailVerification