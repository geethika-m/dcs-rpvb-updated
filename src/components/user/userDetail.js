import React, { useEffect, useRef, useState } from 'react';
import { Form, Alert, Row, Col} from "react-bootstrap";
import { database } from "../../firebase";
import { convertEpoch } from '../../global/epochTime';
import * as BiIcons from 'react-icons/bi';
import * as HiIcons from 'react-icons/hi';

/**
 * @function UserDetail
 * 
 * Component to get the user's data from the database and displays it in the form and logging block
 * @returns The component is returning a JSX element.
 */

const UserDetail = (props) => {

    /* Destructuring the props object. */
    const { userData, archived } = props;

    /* Used to get the value of the select element. */
    const statusRef = useRef(userData.status);

    /* Setting the initial state of the component. */
    const [formState, setFormState] = useState(true);
    const [showConfirmationModal,setShowConfirmationModal] = useState(false);
    const [proceed, setProceed] = useState(true);
    const [message,setMessage] = useState('');
    const [warning, setWarning] = useState('');
    const [loading, setLoading] = useState(false);
    const [archive, setArchive] = useState(false);
    const [load, setLoad] = useState(false);
    const [view, setView] = useState(false);
        
    useEffect(() => {
        if (userData && userData.uid) {
            const fetchUserArchivedStatus = async () => {
                try {
                    const userDoc = await database.usersRef.doc(userData.uid).get();
                    const userStatus = userDoc.data()?.status;
    
                    if (userStatus === 'Archive') {
                        setArchive(true);
                    }
                } catch (error) {
                    console.error('Error fetching user status:', error);
                }
            };
    
            fetchUserArchivedStatus();
            setLoad(true); // Set load to true once the data is fetched
        }
    }, [userData]);
    
    /**
     * When the user clicks the button, the form state is toggled and the status input is set to the
     * user's current status.
     */
    const toggleFormState = () => {
        setFormState(p => !p);

        if (!proceed) {
            statusRef.current.value = userData.status;
        }
    }
    /**
     * Toggle the value of the showConfirmationModal state variable.
     */
    const toggleConfirmationModal = () => {
        setWarning("Archiving user will not allow account to be used again.");
        setShowConfirmationModal(p => !p)
    }

    const updateData = async () => {
        try {
            var userUpdate = database.usersRef.doc(userData.uid);
            await userUpdate.update({
                status: statusRef.current.value,
                archivedDate: statusRef.current.value === "Archive" ? new Date() : null
            })
            setMessage("SUCCESS: User updated successfully!");
            setView(true);
            return true;
        } catch {
            return false;
        }

    }
    /**
     * Function to update the user's data in the database.
     * @param e - event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (proceed) {
            try {
                const flag = await updateData();
                if (flag) {
                    setArchive(true);
                } else {
                    throw new Error();
                }
            } catch {
                setMessage("ERROR: Something went wrong!");
                setView(true);
            }
        }
        else {
            statusRef.current.value = userData.status
            setMessage("ERROR: Invalid Operation!");
            setView(true);
        }

        toggleFormState();
        setLoading(false);
    }

    /**
     * If the value of the status dropdown is "Archive", then show the confirmation modal.
     */
    const handleChange = () => {
        if (statusRef.current.value === "Archive") {
            toggleConfirmationModal();
        }
    }

    useEffect(() => {
        if(userData.length !== 0) {
            setLoad(true);
        }
    }, [userData])

    return (
        <React.Fragment>
            {load &&
            <div className="ViewUser-form-container">
                <div className='ViewUser-form'>
                    <div className="ViewUser-form-content ViewUser-child1">
                        <h3 className="ViewUser-title login-icon">
                            <div><BiIcons.BiSolidUserDetail size={30} color="black" /></div>
                            User Profile
                        </h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group as={Row} id="fullName">
                                <Form.Label className='ViewUser_label'>Name:</Form.Label><br/>
                                <Col>
                                    <Form.Control className="ViewUser-input-style"
                                        placeholder={userData.fullName}
                                        type={"text"}
                                        disabled
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} id="email">
                                <Form.Label className='ViewUser_label'>Email:</Form.Label><br/>
                                <Col >
                                    <Form.Control className="ViewUser-input-style"
                                        placeholder={userData.email}
                                        type={"email"}
                                        disabled
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} id="mobileNumber">
                                <Form.Label className='ViewUser_label'>Mobile Number:</Form.Label><br/>
                                <Col >
                                    <Form.Control className="ViewUser-input-style"
                                        placeholder={userData.mobileNumber}
                                        type={"number"}
                                        disabled
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} id="department">
                                <Form.Label className='ViewUser_label'>Department:</Form.Label><br/>
                                <Col >
                                    <Form.Control className="ViewUser-input-style"
                                        placeholder={userData.department}
                                        type={"text"}
                                        disabled
                                        readOnly
                                    />   
                                </Col>                                                                 
                            </Form.Group>
                            <Form.Group as={Row} id="userType">
                                <Form.Label className='ViewUser_label'>User Type:</Form.Label><br/>
                                <Col >
                                    <Form.Control className="ViewUser-input-style"
                                        placeholder={userData.userType}
                                        type={"text"}
                                        disabled
                                        readOnly
                                    />   
                                </Col>                                                                 
                            </Form.Group>
                            <Form.Group as={Row} id="status">
                                <Form.Label className='ViewUser_label'>Status:</Form.Label><br/>
                                <Col >
                                    <Form.Select className="ViewUser-ddl-style"
                                        ref={statusRef}
                                        disabled={formState}
                                        readOnly={archived}
                                        onChange={handleChange} 
                                        defaultValue={userData.status} >
                                        <option value={"Active"}>Active</option>
                                        <option value={"Archive"}>Archive</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                            {!formState
                                ? (
                                    <div>
                                        <button
                                            className={"ViewUser-Edit-button"}
                                            type={"submit"}
                                            disabled={(loading || proceed === false) ? true : false}>Update</button>
                                        <button
                                            className={"ViewUser-Cancel-button"}
                                            onClick={toggleFormState}
                                            disabled={loading}>Cancel</button>
                                    </div>
                                )
                                : (!archived &&
                                    <button
                                        className={"ViewUser-Edit-button"}
                                        onClick={toggleFormState}
                                        disabled={loading}>Edit</button>                                        
                                )
                                
                            }
                            {archive &&
                            <Alert className='archivedAlert' variant="info">Account is archived, no editing is available.</Alert>
                            }
                        </Form>
                    </div>
                <div className="ViewUser-form-content2 ViewUser-child2">
                    <h3 className="ViewUser-title login-icon">
                        <div><HiIcons.HiInformationCircle size={30} color="black" /></div>
                        User Logging
                    </h3>
                    <Form.Group as={Row} id="createdOn">
                            <Form.Label className='ViewUser_label'>Account Created on:</Form.Label><br/>
                            <div className="ViewUser-data-style">{convertEpoch(userData.createdOn)}</div>       
                        </Form.Group>    
                        <Form.Group as={Row} id="lastLogin">
                            <Form.Label className='ViewUser_label'>User Last Log in:</Form.Label><br/>
                            <div className="ViewUser-data-style">{userData.lastActive ? convertEpoch(userData.lastActive) : "User has not login before"}</div>       
                        </Form.Group>                              
                        <Form.Group as={Row} id="passwordChange">
                            <Form.Label className='ViewUser_label'>Last Password Change:</Form.Label><br/>
                            <div className="ViewUser-data-style">{userData.lastChangedPassword ? convertEpoch(userData.lastChangedPassword): "User have no record of changing password"}</div>       
                        </Form.Group>  
                        {userData.archivedDate &&
                        <Form.Group as={Row} id="arhivedDate">
                            <Form.Label className='ViewUser_label'>User Archived Date:</Form.Label><br/>
                            <div className="ViewUser-data-style">{convertEpoch(userData.archivedDate)}</div>       
                        </Form.Group> }
                </div>
            </div>
            </div>
            }
        </React.Fragment>
    )
}

export default UserDetail