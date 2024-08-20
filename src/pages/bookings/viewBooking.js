import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { database } from "../../firebase";
import { Helmet } from 'react-helmet';
import ContentContainer from "../../components/pageLayout/contentContainer";
import BookingDetails from '../../components/bookings/bookingDetails';

/**
 * @function ViewBooking
 * 
 * It's a function that returns a component that retrieve the data of the booking
 * based on its unique book id and displays the data. 
 * @returns The return is a form with the following data from the booking.
 */

const ViewBooking = () => {

  /* Getting the bkID from the URL. */
  const { bkId } = useParams();
  const [recordData, setRecordData] = useState([]);
  const [exist, setExist] = useState(true);

  useEffect(() => {
  
  /* It gets the booking data from the database and sets the booking data to the state. */
  const getRecordData = () => {
    database.bookingRef.doc(bkId).get().then((snapshot) => {
        /* if there is record, set the data */
        if (snapshot.exists) {
            setRecordData(snapshot.data())
        }
        else {
            setExist(false)
        }
    });
  }
  getRecordData();
}, [bkId])

return (
    <ContentContainer>
        <Helmet>
        <title>RPVB | View Booking</title>
        </Helmet>
            <div className='form-container'>
            {
            exist
            ? (
                <BookingDetails recordData={recordData} />
            )
            : (
                <p>There is no such Booking.</p>
            )
            }             
            </div>
    </ContentContainer>    
    )
}

export default ViewBooking