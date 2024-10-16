import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Helmet from 'react-helmet';
import ContentContainer from '../../components/pageLayout/contentContainer';
import TableContainer from '../../components/tables/tableContainer';
import { convertEpoch } from '../../global/epochTime';
import {database } from "../../firebase";
import * as XLSX from 'xlsx';
import { deleteDoc, doc } from 'firebase/firestore';

/**
 * @function ManageUser
 * 
 * It's a function that returns a component that retrieve the data of the user
 * and displays it in a table. 
 * @returns The return is table with the following data.
 */

const ManageUserPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const {name }  = useParams();

  const columns = useMemo(() => [
      { accessor: 'id', Header: 'Index' },
      { accessor: 'museum', Header: 'Museum' },
      { accessor: 'fullName', Header: 'Name' },
      { accessor: 'email', Header: 'Email' },
      { accessor: 'mobileNumber', Header: 'Mobile Number' },
      { accessor: 'userType', Header: 'User Type' },
      { accessor: 'status', Header: 'Status' },
      { accessor: 'lastActive', Header: 'Last Active' },
      { accessor: 'fbId', Header: 'Firebase ID' },
    ], []
  );

  const updateUsersList = (updatedUsers) => {
    setUsers(updatedUsers)
  }

  console.log('users outside', users);

  const handleExportExcel = () => {
    // Prepare data for Excel export
    const xlsxFormattedData = users.map(item => [
      item.id,
      item.museum,
      item.fullName,
      item.email,
      item.mobileNumber,
      item.userType,
      item.status,
      item.lastActive,
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
    XLSX.writeFile(workbook, 'user-data.xlsx');
  };
   

  useEffect(() => {
    /* Creating a reference to the user collection in Firestore. */
    const userQuery = database.usersRef;

    /* Query from database with the reference and store in users state  */
    const unsubscribe = userQuery.orderBy('createdOn', 'desc').onSnapshot((snapshot) => {
      if (snapshot.docs.length !== 0) {
        var id = 1;
        const tempItem = [];

        snapshot.docs.forEach((doc) => {
          if(doc.data().museum === name) { 
            tempItem.push({
              id: id,
              museum: doc.data().museum,
              fullName: doc.data().fullName,
              email: doc.data().email,
              mobileNumber: doc.data().mobileNumber,
              userType: doc.data().userType,
              status: doc.data().status,
              lastActive: convertEpoch(doc.data().lastActive),
              fbId: doc.id,
            });
            id++;
           }
        });
        setUsers(tempItem);
      }
    });

    return unsubscribe;
  }, []);

  const handleView = (type, fbId) => {
    if (type === 'venueBooking') {
      navigate('/venueBooking/' + fbId);
    } else {
      navigate('/user/' + fbId);
    }
  };

  return (
    <ContentContainer>
      <Helmet>
        <title>RPVB | Manage User</title>
      </Helmet>
      <div className='form-container'>
        <TableContainer type="user" columns={columns} data={users} updateUsersList={updateUsersList} onView={handleView} showViewColumn={true} />
      </div>
      <button onClick={handleExportExcel} className='ExportUser-button'>
        Download in Excel
      </button>
    </ContentContainer>
  );
};

export default ManageUserPage;
