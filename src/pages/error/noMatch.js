import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "react-bootstrap";
import PageFooter from '../../components/pageLayout/footer';
import '../../styling/main.css';
import * as RiIcons from 'react-icons/ri'

const NoMatch = () => {
  const navigate = useNavigate();

  const redirectHome = () => {
    navigate('/homepage'); 
  }
    return (
      <React.Fragment>
        <div className="login-fgtpwd-background sub-container" >
            <div className="Login-form-container">
                <div className="Login-form">
                  <Card className="Login-form-content">
                    <h3 className="Login-form-title Login-icon">
                        <div><RiIcons.RiErrorWarningFill size={30} color="black" /></div>
                        Page Not Found.
                        <p className="Login-form-subtitle">
                        Huh, it seems like the page you are looking for does not exist.</p>
                    </h3>
                    <button
                        className={"login-button"}
                        type={"button"}
                        onClick={redirectHome}
                    >
                        Back to Homepage
                    </button>
                    <div className="footer-noscroll">
                            <PageFooter />
                    </div>
                  </Card>
                </div>
            </div>
        </div>
        
      </React.Fragment>
      
    )
  }
  
  export default NoMatch