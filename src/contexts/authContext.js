import React, { useContext, useState, useEffect } from "react";
import {database, auth} from "../firebase";
import { sendEmailVerification, signInWithEmailAndPassword, getAuth, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword} from "firebase/auth";
import {encryptData } from "../global/utils";
import bcrypt from "bcrypt";

const AuthContext = React.createContext();

/**
 * @function useAuth
 * 
 * This function returns the value of the AuthContext object, which is the current user object.
 * @returns The AuthContext object
 */
export function useAuth() {
    return useContext(AuthContext);
};
/**
 * @function AuthProvider
 *
 * AuthProvider for connection with firebase Auth
 * 
 * @returns The AuthContext.Provider is being returned.
 */
export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isArchived, setIsArchived] = useState(null);
    const [sessionTimer, setSessionTimer] = useState(15 * 60); // 15 minutes in seconds
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    // Function to reset the session timer
    const resetSessionTimer = () => {
        setSessionTimer(15 * 60); // Reset to 15 minutes when there is user activity
    };

    // Function to add event listeners for user activity
    function addActivityEventListener(resetSessionTimer) {
        const activityEvents = ["mousemove", "keydown", "click"];

        activityEvents.forEach((eventName) => {
        document.addEventListener(eventName, resetSessionTimer);
        });
    }

    useEffect(() => {
        let alertShown = false;

        if (userLoggedIn) {
          // Start the session timer only if the user is logged in
          const timer = setInterval(() => {
            if (sessionTimer > 0) {
              setSessionTimer(sessionTimer - 1);
            } else {
              if (!alertShown) {
                alert("Session has expired, please login again.");
                alertShown = true; // Set the flag to true 
                // Session timeout, log the user out
                logout();
                }
            }
          }, 1000); // Update the timer every second
          
          // Add an event listener for user activity
          addActivityEventListener(resetSessionTimer);
    
          // Clear the timer when the component unmounts
          return () => {
            clearInterval(timer);
    
            // Remove the event listeners for user activity
            const activityEvents = ["mousemove", "keydown", "click"];
            activityEvents.forEach((eventName) => {
              document.removeEventListener(eventName, resetSessionTimer);
            });
          };
        }
      }, [sessionTimer, userLoggedIn]);

    /**
     * Function that check if user is in registered user collection "loginData", 
     * Check if lock boolean value is true, if it is, check if 15 minutes past, 
     * if so, unlock account, if not, return error message, if not, proceed with sign in.
     * 
     * @param email - email address of the user
     * @returns a promise.
     */
    const checkAccountStatus = async(email) => {

        let accountStatusMsg = '';

        /* Check if user is in registered user collection "loginData" */
        /* Set lock and datelock as null if user is not locked, else set lock date and lock time */
        await database.loginRef.where("email", "==", email)
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    const id = doc.id;
                    const lock = doc.data().lock;
                    const dateLock = doc.data().lockDate !== null ? doc.data().lockDate.seconds : 0;

                    /* Check if lock boolean value is true */
                    if (lock) {
                        // Check how long has it been lock (in seconds)
                        let diff = new Date().getTime() / 1000 - dateLock 

                        // If more than 900 seconds (15 minutes)
                        if (diff > 900) {
                            database.loginRef.doc(id).update({
                                loginAttempts: 0,
                                lock: false,
                                lockDate: null
                            })
                            accountStatusMsg = '';
                        }
                        else {
                            const timeLeft = (15 - Math.floor(diff / 60)).toString();
                            accountStatusMsg = "ERROR: Account locked. Try again in " + timeLeft + " minutes.";
                        }
                    }
                    else {
                        /* Check if lock boolean value is false */
                        accountStatusMsg = '';
                    }
                })
            })

            /* Catch any other error that occurs. */
            .catch((e) => {
                accountStatusMsg = "ERROR: Invalid Username/Password."
            }); 
            /* Return the account status, if any. */             
        return accountStatusMsg;
    }

    /**
     * Functions runs on invalid credentials, to update user's account status in the database.
     * 
     * If the user is in the collection, check if they have 2 or 1 login attempts. If they have 2, lock
     * the account. If they have 1, set the login attempts to 2. If they have 0, set the login attempts
     * to 1.
     * 
     * @param email - email address of the user
     * @returns The message variable is being returned.
     */
    const setAccountLockStatus = async(email) => {

        let lockStatusMsg = '';

        /* Check if user is in registered user collection "loginData" */
        await database.loginRef.where("email", "==", email)
            .get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    const id = doc.id;
                    const attempt = doc.data().loginAttempts;

                    if (attempt === 2) {
                        database.loginRef.doc(id).update({
                            loginAttempts: 0,
                            lock: true,
                            lockDate: new Date()
                        })
                        lockStatusMsg = "ERROR: Account locked. Try again in 15 minutes.";
                    } 
                    else if (attempt === 1) {
                        database.loginRef.doc(id).update({
                            loginAttempts: 2
                        })
                        lockStatusMsg = "ERROR: Invalid Email/Password.";
                    } 
                    else 
                    /*  To capture undefined and if it is the first attempt */ {
                        database.loginRef.doc(id).update({
                            loginAttempts: 1
                        })
                        lockStatusMsg = "ERROR: Invalid Email/Password.";
                    }
                })
            })
            .catch((e) => {
                lockStatusMsg = "ERROR: Invalid Email/Password."
            });
        return lockStatusMsg;    
    }

    /**
     * The logout function clears the local storage and signs out the user with the authenticate
     * function.
     * 
     * @returns The auth.signOut() method is being returned.
     */
    const logout = () => {

        if (message !== '') {
            alert(message);
            setMessage('');
        }
        // Sign out user with authenticate
        localStorage.clear();
        return auth.signOut();
    }


    /**
     * Functions that handles the after successful login.
     * It updates the user's last active time and sets the user's type in session storage.
     * 
     * @param email - email address of the user
     * @returns A promise <String>.
     */
    const loggedInSuccess = async (email) => {

        let loginMsg = '';
        let daysLeft = '';

        /* Retrieve User Document for update */
        await database.usersRef.where("email", "==", email)
            .get()
            .then((userRefSnapShot) => {
                userRefSnapShot.forEach((doc) => {

                    /* get epoch time now */
                    const epochTimeNow = new Date().getTime() / 1000;

                    /* Check if user has changed password before */
                    if (doc.data().lastChangedPassword !== undefined) {
                        const changeSecondsDifference = epochTimeNow - doc.data().lastChangedPassword.seconds;

                        /* Check if time since account created is more than 90 days */
                        if (changeSecondsDifference > 7776000) {
                            logout();
                            throw new Error("Password");
                        }
                        else if (changeSecondsDifference >= 7344000) {
                            daysLeft = Math.ceil((90 - (((changeSecondsDifference / 60) / 60) / 24))).toString();
                            alert("User has " + daysLeft + " days to change your password before password expiration.");
                        }
                        localStorage.setItem('dateOfLastChange', encryptData((doc.data().lastChangedPassword.seconds).toString()));
                    }
                    else {
                        const createdSecondsDifference = epochTimeNow - doc.data().createdOn.seconds;

                        /* Check if time since last changed password is more than 90 days */
                        if (createdSecondsDifference > 7776000) {
                            logout();
                            throw new Error("Password");
                        }
                        else if (createdSecondsDifference >= 7344000) {
                            daysLeft = Math.ceil((90 - (((createdSecondsDifference / 60) / 60) / 24))).toString();
                            alert("User has " + daysLeft + " days to change your password before password expiration.");
                        }
                        localStorage.setItem('dateOfLastChange', encryptData((doc.data().createdOn.seconds).toString()));
                    }

                    /* Setting user type in session storage */
                    if (doc.data().userType === "Administrator") {
                        localStorage.setItem('admin', encryptData("true"));
                    }
                    else {
                        localStorage.setItem('admin', encryptData("false"));
                    }
                    localStorage.setItem('userId', encryptData(doc.id));

                    /* Update User last active timing */
                    database.usersRef.doc(doc.id).update({
                        lastActive: new Date(), 
                    });
                    setIsArchived(false);
                });

                database.loginRef.where("email", "==", email)
                    .get()
                    .then((loginDataSnapShot) => {
                        loginDataSnapShot.forEach((doc) => {
                            database.loginRef.doc(doc.id).update({
                                loginAttempts: 0,
                                lock: false,
                                lockDate: null
                            });
                        });
                    });
                
                loginMsg = "SUCCESS";  
            })
            .catch((e) => {
                if (e.toString().includes("Archived")) {
                    loginMsg = "ERROR: Account has been Archived.";
                }
                else if (e.toString().includes("Password")) {
                    loginMsg = "ERROR: Password has Expired. Please reset your account password."
                }
                else {
                    loginMsg = "ERROR: Something went wrong.";
                }
            })

        return loginMsg;    
    }

    /**
     * Function to handle the log in logic
     * 
     * @param email - User's email input
     * @param password - User's password input
     * @returns The return a string with "ERROR" or "SUCCESS"
     */
    const login = async (email, password) => {
        try {
            // Check the user's account status in Firestore
            const userDoc = await database.usersRef.where("email", "==", email).get();
            if (userDoc.empty) {
                return "ERROR: User not found";
            }
    
            const userData = userDoc.docs[0].data();
    
            if (userData.status === "Archive") {
                return "ERROR: Your account has been archived. Please contact IT support.";
            }
    
            // Check the user's login status
            const loginStatus = await checkAccountStatus(email);
    
            if (loginStatus.includes("ERROR")) {
                return loginStatus;
                
            }
    
            // Attempt to sign in
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            if (user.emailVerified) {
                // User is successfully logged in
                await loggedInSuccess(email);
                return "Login successful!";
            } else {
                // User's email is not verified
                sendEmailVerification(user);
                await logout();
                return "ERROR: Please verify your email and try again.";
            }
        } catch (e) {
            // Handle login-related errors here and provide custom error messages
            if (e.code === "auth/user-not-found") {
                return "ERROR: User not found";
            } else if (e.code === "auth/wrong-password") {
                const lockStatusMsg = await setAccountLockStatus(email);
                return lockStatusMsg;
            } else if (e.code === "auth/too-many-requests") {
                const lockStatusMsg = await setAccountLockStatus(email);
                return lockStatusMsg;
            } else {
                return "ERROR: Something went wrong";
            }
        }
    };
    
    /**
     * Use Firebase Authenticate to send a reset password email
     * 
     * @param email - The email address of the user.
     * @returns The promise from the Firebase API call.
     */
    const forgetPassword = (email) => {
        // Use Firebase Authenticate to send a reset password email
        const auth = getAuth();
        return sendPasswordResetEmail(auth, email);
    }    

    const checkPasswordGeneration = async (password, email) => {
        try {
          let checkerMsg = false;
          let hashedPasswordArray = [];
      
          const HashData = (input) => {
            const saltRounds = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(input, saltRounds);
            return hash;
          };
      
          const snapshot = await database.loginRef.where('email', '==', email).get();
      
          for (const doc of snapshot.docs) {
            hashedPasswordArray = doc.data().passwordGeneration;
      
            // Check if hashedPasswordArray is an array and contains valid hashes
            if (Array.isArray(hashedPasswordArray) && hashedPasswordArray.every(bcrypt.getRounds)) {
              const isPasswordMatch = hashedPasswordArray.some((hashedPassword) => {
                return bcrypt.compareSync(password, hashedPassword);
              });
      
              if (isPasswordMatch) {
                return checkerMsg =
                  'ERROR: The entered password is a recurring password within the last 3 generations.';
              } else {
                const hash = HashData(password); // Generate the hash for the password
      
                if (hashedPasswordArray.length === 3) {
                  hashedPasswordArray = hashedPasswordArray.slice(1);
                  hashedPasswordArray.push(hash);
                } else {
                  hashedPasswordArray.push(hash);
                }
      
                await database.loginRef.doc(doc.id).update({
                  passwordGeneration: hashedPasswordArray,
                });
      
                checkerMsg = 'SUCCESS';
              }
            } else {
              // If hashedPasswordArray is not an array or contains invalid hashes, create a new array with the current hash
              const hash = HashData(password); // Generate the hash for the password
              hashedPasswordArray = [hash];
      
              await database.loginRef.doc(doc.id).update({
                passwordGeneration: hashedPasswordArray,
              });
      
              checkerMsg = 'SUCCESS';
            }
          }
      
          return checkerMsg;
        } catch (e) {
          return 'ERROR: Something went wrong.';
        }
      };
      
      
    /**
     * Function to connect with Firebase Auth and change user's current password to the 
     * newly given one.
     * 
     * @param oldPassword - The current password of the user
     * @param newPassword - The new password input from UI
     * @returns a promise.
     */
    const changePassword = async (oldPassword, newPassword) => {
        let changePwdMsg = '';
        const currentUser = auth.currentUser;
    
        try {
            const userCredential = EmailAuthProvider.credential(currentUser.email, oldPassword);
    
            // Attempt to reauthenticate the user with the provided old password.
            await reauthenticateWithCredential(currentUser, userCredential);
    
            // If reauthentication is successful, proceed to change the password.
            const checkMsg = await checkPasswordGeneration(newPassword, currentUser.email);
    
            if (checkMsg.includes("SUCCESS")) {
                await updatePassword(currentUser, newPassword);
                const snapshot = await database.usersRef.where("email", "==", currentUser.email).get();
    
                const updatePromises = snapshot.docs.map((doc) => {
                    return database.usersRef.doc(doc.id).update({
                        lastChangedPassword: new Date()
                    });
                });
    
                await Promise.all(updatePromises);
    
                changePwdMsg = "SUCCESS";
            } else {
                changePwdMsg = "ERROR: The entered password is a recurring password within the last 3 generations.";
            }
        } catch (error) {
            // Handle the error thrown by reauthenticateWithCredential.
            if (error.code === "auth/wrong-password") {
                // This code indicates that the provided old password is incorrect.
                changePwdMsg = "ERROR: Invalid current password.";
            } else {
                // Handle other error cases.
                changePwdMsg = "ERROR: Something went wrong.";
            }
        }
    
        return changePwdMsg;
    };

    /**
     * It checks if the user's account has been archived, if it has, it sets a message and returns
     * true.
     * @returns A function.
     */
    /* const monitorUserStatus = () => {
        try {
            let flag = false;
            const userId = decryptData(localStorage.getItem("userId"));

            database.usersRef.doc(userId)
                .get((snapShot) => {
                    if (snapShot.data().userStatus === "Archived") {
                        setMessage("Account has been Archived.");
                        flag = true;
                    }
                });
            return flag;
        } catch {
            logout();
        }
    }      */   
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setLoading(false)

            if (user !== null && user.emailVerified) {
                setCurrentUser(user);
                setUserLoggedIn(true);
            } else {
                setCurrentUser(null);
                setUserLoggedIn(false);
            }
        })

        if ((localStorage.getItem("userId") ?? '') !== '') {
            /* if (monitorUserType() || monitorUserStatus()) {
                logout();
            } */
        } 

        return unsubscribe
    }, [isArchived, message])

    const value = {
        currentUser,
        login,
        logout,
        loggedInSuccess,
        forgetPassword,
        checkPasswordGeneration,
        changePassword,
    }    

    return (
        <AuthContext.Provider value={value}>
        {!loading && (userLoggedIn || currentUser === null) && children}
        {/* Render children only if the user is logged in or currentUser is null (i.e., on the login page) */}
        </AuthContext.Provider>
    )
}
