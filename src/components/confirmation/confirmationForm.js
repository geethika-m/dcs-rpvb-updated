import {React, useState, useEffect} from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import * as GiIcons from 'react-icons/gi';
import { database, auth } from '../../firebase';
import { format } from 'date-fns';
import axios from 'axios';
import { useParams } from 'react-router-dom';

/**
 * @function ConfirmationForm
 * 
 * Component for confirming cancellation or approving of booking
 * @returns The component is returning a JSX element.
 */
const ConfirmationForm = () => {
    const [message, setMessage] = useState('');
    const [showMessage,setShowMessage] = useState(false);
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();
    const { bkId, action } = useParams();
    let bookingData;

    /* Function to get approver information */
    const getCurrentUserInfo = async () => {
        const currentUser = auth.currentUser;
        const userDB = await database.usersRef
          .where("uid", "==", currentUser.uid)
          .get();
      
        if (!userDB.isEmpty) {
          const userDoc = userDB.docs[0];
          const userData = userDoc.data();
          const fullName = userData.fullName;

          setFullName(fullName);
        } 
      };
    
      useEffect(() => {
        getCurrentUserInfo();
    }, []);

    const handleExecute = () => {
        if (action == "approve"){
            handleApproveBooking();
        }
        else {
            handleCancelBooking();
        }
        
    }
    const handleApproveBooking = async () => {
        /* Retrieve the database data based on bkId */
        const bookingRef = database.bookingRef.where("bkId", "==" , bkId);

        try {
            /* Get snapshot of the query result */
            const bookingQuery = await bookingRef.get();
            
            if(!bookingQuery.empty){
                /* Get the BkID to update the record */
                const bkIdDocRef = bookingQuery.docs[0].ref;
                const bookingSnapshot = await bkIdDocRef.get();

                if(bookingSnapshot.exists){
                    bookingData = bookingSnapshot.data();

                /* Define a data format and save to DB later */
                const currentDate = new Date();
                const formattedDate = format(currentDate, 'dd-MMM-yyyy');

                /* Update the Approval Status, Book Status, Approved By, Completed Date */
                await bkIdDocRef.update({
                    approvalStatus: "Approved",
                    approverName: fullName,
                    completedDate: formattedDate,
                });

                /* Set the message and set display as true */
                setMessage('Approve Booking Success! Redirecting in 3 seconds')
                setShowMessage(true);

                /* Delay hiding the message */
                setTimeout(() => {
                    setShowMessage(false);

                /* Redirect to completed booking page after 3 seconds */
                    navigate('/completedApproval');
                }, 3000); 

// Send email to the user about the approved status
const customMessage = 
`Dear ${bookingData.requestorName},

Your venue booking for event "${bookingData.eventName}" has been approved. 

No further action required.

Best Regards
`;
                const response = await axios.post('https://us-central1-rpvb-web.cloudfunctions.net/sendEmail', {
                    recipient: bookingData.requestorEmail,
                    subject: `Approve Booking for ${bkId}`,
                    message: customMessage,
                });
                
// Send email to Department about the approved status
const customMessage2 = 
`Dear EMP,

The venue booking request ${bookingData.bkId} has been approved by ${fullName}. 

Requestor Name: ${bookingData.requestorName}
Organisation: ${bookingData.organisation}
Date of Event: ${bookingData.selectedDate}
Timeslots: ${bookingData.timeSlot}

No further action required.

Best Regards
`;
                const response2 = await axios.post('https://us-central1-rpvb-web.cloudfunctions.net/sendEmail', {
                    recipient: "events_management@defencecollectivesg.com",
                    subject: `Venue Booking request ${bkId} Approved`,
                    message: customMessage2,
                });
                }

            } else {
                setMessage('No matching booking found for the provided bkId.')
                setShowMessage(true);
            }
        } catch (error) {
            setMessage('Error approving booking.')
            setShowMessage(true);
            console.log(error)
        }
    }
    const handleCancelBooking = async () => {
        try {
            // Retrieve the booking based on BKID 
            const bookingQuery = await database.bookingRef.where("bkId", "==", bkId).get();

              if(!bookingQuery.empty){
                // Get the value of BkID to update the booking details.
                const bkIdDocRef = bookingQuery.docs[0].ref;
                const bookingSnapshot = await bkIdDocRef.get();

                if(bookingSnapshot.exists){
                    bookingData = bookingSnapshot.data();

                    // Define a data format and save to DB later 
                const currentDate = new Date();
                const formattedDate = format(currentDate, 'dd-MMM-yyyy');

                // Update the Book Status, Cancelled By, Completed Date
                await bkIdDocRef.update({
                    approvalStatus: "Cancelled",
                    bookStatus: "Cancelled",
                    approverName: fullName,
                    completedDate: formattedDate,
                    availableStatus: true,  
                });

                // Set the message and set display as true
                setMessage('Cancel Booking Success! Redirecting in 3 seconds')
                setShowMessage(true);

                // Delay hiding the message
                setTimeout(() => {
                    setShowMessage(false);

                // Redirect to completed booking after 3 seconds
                    navigate('/completedApproval');
                }, 3000); 
               
// Send email to the user about the cancellation 
const customMessage = 
`Dear ${bookingData.requestorName},

Your venue booking for event "${bookingData.eventName}" has been cancelled.

Best Regards
`;
                const response = await axios.post('https://us-central1-rpvb-web.cloudfunctions.net/sendEmail', {
                    recipient: bookingData.requestorEmail,
                    subject: `Booking Confirmation for ${bkId}`,
                    message: customMessage,
                });

// Send email to EMP Dept about cancellation
const customMessage2 = 
`Dear EMP,

The venue booking request ${bookingData.bkId} has been cancelled by ${fullName}.

Requestor Name: ${bookingData.requestorName}
Organisation: ${bookingData.organisation}
Date of Event: ${bookingData.selectedDate}
Timeslots: ${bookingData.timeSlot}

No further action required.

Best Regards
`;
                const response2 = await axios.post('https://us-central1-rpvb-web.cloudfunctions.net/sendEmail', {
                    recipient: "events_management@defencecollectivesg.com",
                    subject: `Venue Booking request ${bkId} Cancelled`,
                    message: customMessage2,
                });
                }
                else {
                    setMessage('No matching booking found for the provided bkId.')
                    setShowMessage(true);
                } 
            } 
        } catch (error) {
            // Other error, display error. 
            setMessage('Error cancelling booking.')
            setShowMessage(true);
        }
    }
    const RedirectToPending = () => {
        setMessage("Redirecting back to previous page in 3 seconds");
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
            navigate('/pendingApproval');
        }, 3000);
    }
   
    return (
        <div className='confirmation-form-container'>
            <div className='confirmation-form'>
            <Form>
            <h3 className="Confirmation-form-title Confirmation-icon">
                        <div><GiIcons.GiConfirmed/></div>
                        Confirmation
                        <p className="Confirmation-form-subtitle">
                        Are you sure you want to proceed to {action} the booking?
                        <br/>Once confirmed, you can't undo this action!
                        </p>
                    </h3>
                    <div className='btn-flex'>
                        <Button className='confirmation-confirm-btn' onClick={handleExecute}>
                            Confirm
                        </Button>
                        <Button className='confirmation-cancel-btn' onClick={RedirectToPending}>
                            Cancel
                        </Button>
                    </div>
            </Form>
            <div className='Cfm-message'>
                <div className={`message ${message.includes("ERROR") ? 'errorMsg' : 'successMsg'}`}>
                    <strong>
                        {message}
                    </strong>
                </div>
            </div>
            </div>
        </div>
    );
};

export default ConfirmationForm;