import React, { useState, useEffect } from 'react';
import CreateBookingForm from '../../components/bookings/createBookingForm';
import CreateBookingApproverForm from '../../components/bookings/createBookingApproverForm';
import { Helmet } from 'react-helmet';
import ContentContainer from '../../components/pageLayout/contentContainer';
import { auth, database } from '../../firebase';

/**
 * @function CreateBooking
 * Create Booking Page for displaying the view.
 * @returns Renders the Create Booking page with the form.
 */

const CreateBooking = () => {
    const [userType,setUserType] = useState(null);

    /* Function to retrieve current logged in user name */
    const getRequestorInfo = async () => {
        const currentUser = auth.currentUser
        const userDB = await database.usersRef
        .where("uid", "==", currentUser.uid)
        .get();

    /* Check if user exists */
    if (!userDB.isEmpty) {
        const userDoc = userDB.docs[0];
        const userData = userDoc.data();
        const userType = userData.userType;

        setUserType(userType);

        } 
    }
    useEffect(() => {
        getRequestorInfo();
    }, []);
    return (
        <React.Fragment>
            <ContentContainer>
                <Helmet><title>RPVB | Create Booking</title></Helmet>
                {userType === "Approver" ? (
                <CreateBookingApproverForm />
                ) : (
                <CreateBookingForm />
                )}
            </ContentContainer>
        </React.Fragment>
    );
};

export default CreateBooking;