import React, { useEffect, useState, useMemo } from "react";
import Helmet from "react-helmet";
import ContentContainer from "../../components/pageLayout/contentContainer";
import { database, auth } from "../../firebase";
import TableContainer from "../../components/tables/tableContainer";
import * as XLSX from "xlsx";
import { format } from "date-fns";

/**
 * @function Homepage
 *
 * It's a function that returns a component that renders a table of data from a firebase database.
 * @returns The return is a table with the data from the database.
 */

const Homepage = () => {
  const [records, setRecords] = useState([]);
  const [userType, setUserType] = useState("");

  const columns = useMemo(
    () => [
      { accessor: "bkId", Header: "BkId" },
      { accessor: "requestorName", Header: "Requestor" },
      { accessor: "dateCreated", Header: "Date Created" },
      { accessor: "eventName", Header: "Event Name" },
      { accessor: "programmes", Header: "Programmes" },
      { accessor: "nofPax", Header: "No of Pax" },
      { accessor: "organisation", Header: "Organisation" },
      { accessor: "first_location", Header: "First Location" },
      { accessor: "second_location", Header: "Second Location" },
      {
        accessor: "selectedDate",
        Header: "Start Date",
        // Format the data to 'DD-MMM-YYYY"
        Cell: ({ value }) => format(new Date(value), "dd-MMM-yyyy"),
      },
      { accessor: "endDate", Header: "End Date" },
      { accessor: "timeSlot", Header: "Timeslot" },
      {
        accessor: "approvalStatus",
        Header: "Approval Status",
        Cell: ({ value }) => (
          <span className={`status-${value.toLowerCase()}`}>{value}</span>
        ),
      },
      { accessor: "fbId", Header: "Firebase ID" },
    ],
    []
  );

  const handleExportExcel = () => {
    // Prepare data for Excel export
    const xlsxFormattedData = records.map((item) => [
      item.bkId,
      item.requestorName,
      item.dateCreated,
      item.eventName,
      item.programmes,
      item.nofPax,
      item.organisation,
      item.location,
      item.selectedDate,
      item.timeSlot,
      item.approvalStatus,
    ]);

    // Create worksheet data
    const worksheetData = [
      columns.map((column) => column.Header),
      ...xlsxFormattedData,
    ];

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create the worksheet from the data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");

    // Save the workbook as a file
    XLSX.writeFile(workbook, "venuebooking-data.xlsx");
  };
  useEffect(() => {
    /* Function to get approver information */
    const getCurrentUserInfo = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDB = await database.usersRef
          .where("uid", "==", currentUser.uid)
          .get();

        if (!userDB.isEmpty) {
          const userDoc = userDB.docs[0];
          const userData = userDoc.data();

          setUserType(userData.userType);
        }
      }
    };

    getCurrentUserInfo();

    /* Creating a reference to the venue booking collection in Firestore. */
    const recordQuery = database.bookingRef;

    /* Query from database with the reference and store in record state  */
    const unsubscribe = recordQuery
      .orderBy("dateCreated", "desc")
      .onSnapshot((snapshot) => {
        if (snapshot.docs.length !== 0) {
          const tempItem = [];
          try {
            snapshot.docs.forEach((doc) => {
              const SelectedDate = doc.data().selectedDate;
              const formattedSelectedDate =
                SelectedDate &&
                typeof SelectedDate === "string" &&
                !SelectedDate.includes(",")
                  ? format(new Date(SelectedDate), "dd-MMM-yyyy")
                  : "";

              tempItem.push({
                bkId: doc.data().bkId,
                requestorName: doc.data().requestorName,
                dateCreated: doc.data().dateCreated,
                museum: doc.data().museum,
                eventName: doc.data().eventName,
                programmes: doc.data().programmes,
                nofPax: doc.data().nofPax,
                organisation: doc.data().organisation,
                first_location: doc.data().first_location,
                second_location: doc.data().second_location,
                selectedDate: formattedSelectedDate,
                endDate: doc.data().endDate,
                timeSlot: doc.data().timeSlot,
                approvalStatus: doc.data().approvalStatus,
                fbId: doc.id,
              });
            });

            // Sort the records by bkId property in ascending order
            tempItem.sort((a, b) => {
              const parseBkId = (bkId) => {
                const parts = bkId.split("BKID"); // Split by the prefix
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
          } catch (error) {
            console.log("error_loading", error);
          }
        }
      });

    return unsubscribe;
  }, []);

  return (
    <ContentContainer>
      <Helmet>
        <title>RPVB | Homepage</title>
      </Helmet>
      <div className="form-container">
        <TableContainer
          type="booking"
          columns={columns}
          data={records}
          showViewColumn={true}
          showPendingApprovalCount={true}
          enableCalender={true}
        />
      </div>
      {userType !== "User" && (
        <button onClick={handleExportExcel} className="ExportVB-button">
          Download in Excel
        </button>
      )}
    </ContentContainer>
  );
};

export default Homepage;
