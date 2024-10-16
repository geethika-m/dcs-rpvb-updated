import React, { useState } from "react";
import { validateRegister } from "./validation";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import useForm from "../../customHooks/useForm";
import {database, auth} from "../../firebase";
import Form from 'react-bootstrap/Form';
import * as AiIcons from 'react-icons/ai';
import bcrypt from 'bcrypt';
import { museumsList } from "../../utils/constant";

/**
 * @function AddUser
 * 
 * It's a function that returns a component that takes in user input
 * for adding user (administrator only).
 * @returns The return is a create user form component. 
 */

const AddUser = () => {

    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    /* Initializing the state of the form. */
    const valueState = {
        name: '',
        email: '',
        mobileNumber: '',
        password:'',
    };
    /* Function to hash input. */
    const HashData = (input) => {
        const saltRounds = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(input, saltRounds);
        return hash;
    };
    /*
    * It creates a new user, sends an email verification.
    */    
    const createUser = () => {
        createUserWithEmailAndPassword(auth, values.email, values.password)
        .then((newUser) => {
            const hashPassword = HashData(values.password);
            sendEmailVerification(newUser.user);

            database.usersRef.doc(newUser.user.uid).set({
                uid: newUser.user.uid,
                email: values.email,
                museum: values.museum,
                fullName: values.name,
                mobileNumber: values.mobileNumber,
                status: "Active",
                lastActive: "Not Available",
                userType: values.userType,
                department: values.department,                
                createdOn: new Date(),
            });           

            database.loginRef.add({
                email: values.email,
                lock: false,
                lockDate: null,
                loginAttempts: 0,
                passwordGeneration: [hashPassword],
            });

            setShowMessage(true);
            setMessage("Create User success!");
        })
        .catch((e) => {
            if((e.toString()).includes("email-already-in-use")) {
                setShowMessage(true);
                setMessage("ERROR: Email already in use.");
            } else {
                setShowMessage(true);
                setMessage("ERROR: Account Creation unsuccessful.");
            }
        });

    }
    
    /* Destructuring the object returned by the custom hook `useForm` */
    const { handleChange, handleSubmit, values, errors, loading } = useForm(validateRegister, valueState, createUser);

    return (
        <div className="Container">
        <div className="CreateUser-form-container">
            <Form className="CreateUser-form">
                <div className="CreateUser-form-content CreateUser-child1 ">
                    <h3>
                        <div><AiIcons.AiOutlineUserAdd size={30} color="black" /></div>
                        Create User
                    </h3>
                    <Form.Group id="museum">
                        <Form.Label className="CreateUser-label">Select Museum:</Form.Label><br/>
                        <Form.Select className="createBooking-ddl-style2"
                            title={"museum"}
                            name={"museum"}
                            onChange={handleChange}
                            value={values.museum}
                        >
                            <option value={" "}>Please select your museum</option>
                            {museumsList.map((museum) => {
                                const {label, value} = museum;
                                return (
                                    <option value={value} key={value}>{label}</option>
                                )
                            })}
                        </Form.Select>
                        {errors.museum && ( <p className="validate-error">{errors.museum} </p> )}
                    </Form.Group>
                    <Form.Group id="fullName" >
                        <Form.Label className="CreateUser-label">Name:</Form.Label><br/>
                        <Form.Control className="CreateUser-input-style"
                            title={"name"}
                            name={"name"}
                            type={"text"}
                            value={values.name}
                            minLength={"2"}
                            maxLength={"256"}
                            onChange={handleChange}
                            required
                        />
                        {errors.name && <p className="validate-error">{errors.name}</p>}
                    </Form.Group>   
                    <Form.Group id="email">
                        <Form.Label className="CreateUser-label">Email:</Form.Label><br/>
                        <Form.Control className="CreateUser-input-style"
                            title={"email"}
                            name={"email"}
                            type={"email"}
                            id={"email"}
                            value={values.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <p className="validate-error">{errors.email}</p>}
                    </Form.Group>
                    <Form.Group id="mobileNumber">
                        <Form.Label className="CreateUser-label">Mobile Number:</Form.Label><br/>
                        <Form.Control className="CreateUser-input-style"
                            name={"mobileNumber"}
                            type={"text"}
                            value={values.mobileNumber}
                            minLength={"8"}
                            maxLength={"11"}
                            onChange={handleChange}
                            required
                        />
                        {errors.mobileNumber && (
                            <p className="validate-error">{errors.mobileNumber}</p>
                        )}
                    </Form.Group> 
                    <Form.Group id="password">
                        <Form.Label className="CreateUser-label">Password:</Form.Label><br/>
                        <Form.Control className="CreateUser-input-style"
                            name={"password"}
                            type={"password"}
                            value={values.password}
                            minLength={"8"}
                            maxLength={"256"}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && (<p className="validate-error">{errors.password}</p>)}
                    </Form.Group>
                    <div className={`message ${message.includes("ERROR") ? 'errorMsg' : 'successMsg'}`}>
                    <strong style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {message}
                    </strong>
                    </div>
                    <button
                        className={"CreateUser-button"}
                        type={"submit"}
                        disabled={loading}
                        onClick={handleSubmit}
                        title="SubmitBtn"
                    > Create
                    </button>  
                </div>
                <div className="CreateUser-form-content2 CreateUser-child2">      
                    <Form.Group id="department">
                        <Form.Label className="CreateUser-label">Department</Form.Label><br/>
                        <Form.Select className="input-ddl-style"
                            title={"department"}
                            name={"department"}
                            id={"department"}
                            onChange={handleChange}
                            value={values.department}
                        >
                            <option value={""}>Please select a department</option>
                            <option value={"Admin and Quality Service"}>Admin and Quality Service</option>
                            <option value={"Centre Management"}>Centre Management</option>
                            <option value={"Corporate Development and Human Resource"}>CDHR</option>
                            <option value={"Curatorial & Collections"}>Curatorial & Collections</option>
                            <option value={"Data & Technology"}>Data & Technology</option>
                            <option value={"Event Management & Planning"}>Event Management & Planning</option>
                            <option value={"Exhibition & Volunteers Management"}>Exhibition & Volunteers Management</option>
                            <option value={"Finance & Procurement"}>Finance & Procurement</option>
                            <option value={"Group Programmes"}>Group Programmes</option>
                            <option value={"Infrastructure & Sustainability"}>Infrastructure & Sustainability</option>
                            <option value={"Navy Museum"}>Navy Museum</option>
                            <option value={"Partnership"}>Partnership</option>
                            <option value={"Public Engagement"}>Public Engagement</option>
                            <option value={"Sales"}>Sales</option>
                            <option value={"Marketing & Communication"}>Marketing & Communication</option>
                            <option value={"Business Development"}>Business Development</option>
                            <option value={"Singapore Discovery Centre"}>Singapore Discovery Centre</option>
                            <option value={"Upper Management"}>Upper Management</option>
                            <option value={"Visitor Experience"}>Visitor Experience</option>
                        </Form.Select>
                        {errors.department && (<p className="validate-error">{errors.department}</p>)}
                    </Form.Group>    
                    <Form.Group id="userType">
                        <Form.Label className="CreateUser-label">User Type</Form.Label><br/>
                        <Form.Select className="input-ddl-style"
                            title={"userType"}
                            name={"userType"}
                            onChange={handleChange}
                            value={values.userType}
                        >
                            <option value={""}>Please select an user type</option>                                
                            <option value={"Administrator"}>Administrator</option>
                            <option value={"Approver"}>Approver</option>
                            <option value={"User"}>User</option>
                        </Form.Select>
                        {errors.userType && (<p className="validate-error">{errors.userType}</p>)}
                    </Form.Group>                                                                                                                                
                </div>
            </Form>
        </div>
    </div>
    )
}

export default AddUser;