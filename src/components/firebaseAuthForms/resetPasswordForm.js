import React, { useState } from "react";
import useForm from "../../customHooks/useForm";
import { Form } from "react-bootstrap";
import { validateNewPassword } from "./validation";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import {auth, database} from '../../firebase';
import bcrypt from 'bcrypt';
import { useNavigate } from "react-router";
import * as BiIcons from 'react-icons/bi';

/**
 * @function ResetPasswordForm
 * 
 * It's a function that returns a component that takes in user input
 * for resetting of password.
 * @returns The return is a reset password form component. 
 */

/* Create a function for reseting passwords */
const ResetPasswordForm = ({actionCode}) => {

  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);


  /* Initialise state of reset password form */
  const valueState = {
      newPassword: '',
      cfmPassword: '',
  }

  /* Function for checking if password is within 3 generations
  *
  * Retrieve from loginRef based on email and 
  * get the passwordGeneration data based on snapshot and add to array
  * Check if hashedPasswordArray is an array and contains valid hashes
  * If there is any matching hashes in array, prompt error, else add to array
  */
  const checkPasswordGeneration = async (password, email) => {
      try {
        let checkMsg = '';
        let hashedPasswordArray = [];
    
        const HashData = (input) => {
          const saltRounds = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(input, saltRounds);
          return hash;
        };
        
        const snapshot = await database.loginRef.where('email', '==', email).get();
        for (const doc of snapshot.docs) {
          hashedPasswordArray = doc.data().passwordGeneration;

          if (Array.isArray(hashedPasswordArray) && hashedPasswordArray.every(bcrypt.getRounds)) {
            const isPasswordMatch = hashedPasswordArray.some((hashedPassword) => {
              return bcrypt.compareSync(password, hashedPassword);
            });
            if (isPasswordMatch) {
              checkMsg = "";
              setShowMessage(true);
              setMessage('ERROR: The entered password is a recurring password within the last 3 generations.');
            } else {
              const hash = HashData(password); 
    
              if (hashedPasswordArray.length === 3) {
                hashedPasswordArray = hashedPasswordArray.slice(1);
                hashedPasswordArray.push(hash);
              } else {
                hashedPasswordArray.push(hash);
              }
    
              await database.loginRef.doc(doc.id).update({
                passwordGeneration: hashedPasswordArray,
              });
    
              checkMsg = 'SUCCESS';
            }
          } else {
            /* 
            * Handle invalid format/empty array 
            * If hashedPasswordArray is not an array or contains invalid hashes,
            * create a new array with the current hash.
            * 
            * Generate the hash for the password and add the current one to the array
            */
            const hash = HashData(password); 
            hashedPasswordArray = [hash]; 
    
            await database.loginRef.doc(doc.id).update({
              passwordGeneration: hashedPasswordArray,
            });
    
            checkMsg = 'SUCCESS';
          }
        }

        return checkMsg;
      } catch (e) {
        setShowMessage(true);
        setMessage('ERROR: Something went wrong.');
      }
    };

    /* 
    * Function to handle reset password
    *
    * Verify the password reset code is valid
    * 
    * If checkMsg is SUCCESS, update last changed password, 
    * add to DB, and redirect user to login page
    * 
    */
    const handleReset = async () => {
      let checkMsg = '';
      
      verifyPasswordResetCode(auth, actionCode)
        .then(async (email) => {
          const password = values.newPassword;
          
          /* 
          Ensure that the password met requirements before check if the password was used
          in the last 3 generations 
          */
          if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/.test(password)) {
            setShowPasswordRequirements(true);
            setShowMessage(true);
            setMessage('ERROR: Password does not meet the minimum requirements.');
            return;
          }

          checkMsg = await checkPasswordGeneration(password, email);

          if (checkMsg.includes('SUCCESS')) {
            confirmPasswordReset(auth, actionCode,values.newPassword)
            const usersSnapShot = await database.usersRef.where('email', '==', email).get();
            usersSnapShot.forEach(async (doc) => {
              await database.usersRef.doc(doc.id).update({
                lastChangedPassword: new Date(),
              });

            });

            setShowMessage(true);
            setMessage('Reset successful! Redirecting to Login Page in 3 seconds');
          
            setTimeout(() => {
              setShowMessage(false);
              navigate('/');
            }, 3000);
          
          } else {
            setShowMessage(true);
            setMessage('ERROR: Oops, something went wrong. Please try again.');
          }
        });
    };

  /* Destructing objects */
  const { handleChange, handleSubmit, values, errors, loading} = useForm (validateNewPassword, valueState, handleReset)
    return (
      <div className="Login-form-container">
          <Form className="Login-form">
              <div className="Login-form-content">
                  <h3 className="Login-form-title Login-icon">
                      <BiIcons.BiReset/><br/>
                      Reset Password
                      <p className="Login-form-subtitle">Please enter your new password.</p>
                  </h3>

                  <Form.Group id="newPwd" >
                      <Form.Label className="Login-label">New Password</Form.Label><br/>
                      <Form.Control className="login-input-style "
                          name={"newPassword"}
                          type={"password"}
                          value={values.newPassword}
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
                          onChange={handleChange}
                          required
                      />
                      {errors.cfmPassword && ( <p className="validate-error">{errors.cfmPassword}</p> )}
                  </Form.Group>
                  <div className={`message ${message.includes("ERROR") ? 'errorMsg' : 'successMsg'}`}>
                    <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {message}
                    </strong>
                  </div>
                  {showPasswordRequirements && (
                    <div className="errorMsg">
                      Password must meet the following requirements:
                      <ul>
                        <li>8 characters or more</li>
                        <li>At least one lowercase letter</li>
                        <li>At least one uppercase letter</li>
                        <li>At least one special character</li>
                        <li>At least one digit</li>
                      </ul>
                    </div>
                  )}
                  <br/>
                  <button
                      className={"login-button"}
                      type={"submit"}
                      disabled={loading}
                      onClick={handleSubmit}
                  > Reset Password
                  </button>                    
              </div>
          </Form>
      </div>
      )   
        
};

export default ResetPasswordForm;