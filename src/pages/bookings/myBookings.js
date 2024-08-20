import React, { useEffect, useState, useMemo } from 'react';
import Helmet from "react-helmet";
import { useNavigate } from 'react-router-dom';
import ContentContainer from "../../components/pageLayout/contentContainer";
import { database, auth } from "../../firebase";
import TableContainer from '../../components/tables/tableContainer';
import { format } from 'date-fns';

/**
 * @function MyBookings
 * 
 * It's a function that returns a component that renders a table of data from a firebase database based 
 * on current user session. 
 * @returns The return is a table with the data from the database.
 */

const MyBookings = () => {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();


  const columns = useMemo(() => [
    { accessor: 'bkId', Header: 'BkId' },
    { accessor: 'requestorName', Header: 'Requestor' },
    { accessor: 'eventName', Header: 'Event Name' },
    { accessor: 'programmes', Header: 'Programmes' },
    { accessor: 'nofPax', Header: 'No of Pax' },
    { accessor: 'organisation', Header: 'Organisation' },
    { accessor: 'location', Header: 'Location' },
    { accessor: 'selectedDate', Header: 'Date'},
    { accessor: 'timeSlot', Header: 'Timeslot' },
    {
      accessor: 'approvalStatus',
      Header: 'Approval Status',
      Cell: ({ value }) => (
        <span className={`status-${value.toLowerCase()}`}>
          {value}
        </span>
      ),
    },
    { accessor: 'fbId', Header: 'Firebase ID' },
    ], []
  );

  useEffect(() => {
    const currentUser = auth.currentUser;
    /* 
    Creating a reference to the venue booking collection in Firestore. 
    Filter by current user session uid to retrieve only their records.
    */
    const recordQuery = database.bookingRef
    .where('userId', '==', currentUser.uid )

    /* Query from database with the reference and store in record state  */
    const unsubscribe = recordQuery.onSnapshot((snapshot) => {
      if (snapshot.docs.length !== 0) {
        const tempItem = [];

        snapshot.docs.forEach((doc) => {
          const SelectedDate = doc.data().selectedDate;
          const formattedSelectedDate = format(new Date(SelectedDate), 'dd-MMM-yyyy');

          tempItem.push({
            bkId: doc.data().bkId,
            requestorName: doc.data().requestorName,
            eventName: doc.data().eventName,
            programmes: doc.data().programmes,
            nofPax: doc.data().nofPax,
            organisation: doc.data().organisation,
            location: doc.data().location,
            selectedDate: formattedSelectedDate,
            timeSlot: doc.data().timeSlot,
            approvalStatus: doc.data().approvalStatus,
            fbId: doc.id,
          });  
        });

      // Sort the records by bkId property in ascending order
      tempItem.sort((a, b) => {
        const parseBkId = (bkId) => {
          const parts = bkId.split('BKID'); // Split by the prefix
          if (parts.length === 2) {
            const numericPart = parseInt(parts[1]);
            if (!isNaN(numericPart)) {
              return numericPart;
            }
          }
          return -1; // Return a default value if parsing fails
        };
      
        const bkIdA = parseBkId(a.bkId);
        const bkIdB = parseBkId(b.bkId);
      
        return bkIdB - bkIdA; // Sort in descending numeric order
      });        

      setRecords(tempItem);
      }
    });

    return unsubscribe;
  }, []);

  const handleView = (type, fbId) => {
    if (type === 'booking') {
      navigate('/booking/' + fbId);
    }
  };

    return (
        <ContentContainer>
          <Helmet><title>RPVB | MyBooking</title></Helmet>
          <div className='form-container'>
            <TableContainer 
            type="booking" 
            columns={columns} 
            data={records} 
            onView={handleView}
            showViewColumn={true} 
            />
          </div>
        </ContentContainer>
      )
    }

export default MyBookings