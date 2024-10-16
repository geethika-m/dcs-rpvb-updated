import React, { useEffect, useState, useMemo } from 'react';
import Helmet from "react-helmet";
import { useNavigate, useParams } from 'react-router-dom';
import ContentContainer from "../../components/pageLayout/contentContainer";
import { database, auth } from "../../firebase";
import TableContainer from '../../components/tables/tableContainer';
import * as XLSX from 'xlsx';

/**
 * @function CompletedBookings
 * 
 * It's a function that returns a component that renders a table of data from a firebase database based 
 * on approval status. 
 * @returns The return is a table with the data from the database.
 */

const CompletedBookingsPage = () => {
  const [records, setRecords] = useState([]);
  const [userType, setUserType] = useState('');/*  */
  const navigate = useNavigate();
  const {name} = useParams();

  const columns = useMemo(() => [
    { accessor: 'bkId', Header: 'BkId' },
    { accessor: 'requestorName', Header: 'Requestor' },
    { accessor: 'dateCreated', Header: 'Created On'},
    { accessor: 'eventName', Header: 'Event Name' },
    { accessor: 'programmes', Header: 'Programmes' },
    { accessor: 'nofPax', Header: 'No of Pax' },
    { accessor: 'organisation', Header: 'Organisation' },
    { accessor: 'location', Header: 'Location' },
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
    { accessor: 'bookStatus', Header: 'Book Status'},
    { accessor: 'fbId', Header: 'Firebase ID' },
    ], []
  );

  const handleExportExcel = () => {
    // Prepare data for Excel export
    const xlsxFormattedData = records.map(item => [
      item.bkId,
      item.requestorName,
      item.dateCreated,
      item.eventName,
      item.programmes,
      item.nofPax,
      item.organisation,
      item.location,
      item.timeSlot,
      item.approvalStatus,
      item.bookStatus,
    ]);

  // Create worksheet data
  const worksheetData = [
    columns.map(column => column.Header),
    ...xlsxFormattedData
  ];

  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Create the worksheet from the data
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');

  // Save the workbook as a file
  XLSX.writeFile(workbook, 'venuebooking-data.xlsx');

  }

  useEffect(() => {
    /* Function to get approver information */
    const getCurrentUserInfo = async () => {
      const currentUser = auth.currentUser;
      const userDB = await database.usersRef
        .where("uid", "==", currentUser.uid)
        .get();
    
      if (!userDB.isEmpty) {
        const userDoc = userDB.docs[0];
        const userData = userDoc.data();
        const userType = userData.userType;
      
        setUserType(userType);
      } 
    };

    getCurrentUserInfo();
    /* 
    Creating a reference to the venue booking collection in Firestore. 
    Filter by approval status = "Completed".
    */
    const recordQuery = database.bookingRef
    .where('approvalStatus', '!=', 'Pending')

    /* Query from database with the reference and store in record state  */
    const unsubscribe = recordQuery.onSnapshot((snapshot) => {
      if (snapshot.docs.length !== 0) {
        const tempItem = [];

        snapshot.docs.forEach((doc) => {
          console.log('doc', doc.data());

          if(doc.data().museum === name) {

            tempItem.push({
              bkId: doc.data().bkId,
              museum: doc.data().museum,
              requestorName: doc.data().requestorName,
              dateCreated: doc.data().dateCreated,
              eventName: doc.data().eventName,
              programmes: doc.data().programmes,
              nofPax: doc.data().nofPax,
              organisation: doc.data().organisation,
              location: doc.data().location,
              selectedDate: doc.data().selectedDate,
              timeSlot: doc.data().timeSlot,
              approvalStatus: doc.data().approvalStatus,
              bookStatus: doc.data().bookStatus,
              approvedBy: doc.data().approvedBy,
              fbId: doc.id,
            });
          }
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
          <Helmet><title>RPVB | CompletedBookings</title></Helmet>
          <div className='form-container'>
            <TableContainer 
            type="booking" 
            columns={columns} 
            data={records} 
            onView={handleView}
            showViewColumn={true} 
            />
          </div>

          {userType !== "User" &&
          (
              <button onClick={handleExportExcel} className='ExportVB-button'>
                Download in Excel
              </button>
          )}
        </ContentContainer>
      )
    }

export default CompletedBookingsPage