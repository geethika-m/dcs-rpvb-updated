import React, { useEffect, useState, useMemo } from "react";
import Helmet from "react-helmet";
import { useNavigate } from "react-router-dom";
import ContentContainer from "../../components/pageLayout/contentContainer";
import { database, auth } from "../../firebase";
import TableContainer from "../../components/tables/tableContainer";
import { format } from "date-fns";

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

  const columns = useMemo(
    () => [
      { accessor: "bkId", Header: "BkId" },
      { accessor: "requestorName", Header: "Requestor" },
      { accessor: "eventName", Header: "Event Name" },
      { accessor: "programmes", Header: "Programmes" },
      { accessor: "nofPax", Header: "No of Pax" },
      { accessor: "organisation", Header: "Organisation" },
      { accessor: "first_location", Header: "First Location" },
      {
        accessor: "first_location_startDate",
        Header: "First Location Start Date",
      },
      {
        accessor: "first_location_endDate",
        Header: "First Location End Date",
      },
      {
        accessor: "first_location_startTime",
        Header: "First Location Start Time",
      },
      {
        accessor: "first_location_endTime",
        Header: "First Location End Time",
      },
      {
        accessor: "first_location_setup",
        Header: "First Location Setup",
      },
      { accessor: "second_location", Header: "Second Location" },
      {
        accessor: "second_location_startDate",
        Header: "Second Location Start Date",
      },
      {
        accessor: "second_location_endDate",
        Header: "Second Location End Date",
      },
      {
        accessor: "second_location_startTime",
        Header: "Second Location Start Time",
      },
      {
        accessor: "second_location_endTime",
        Header: "Second Location End Time",
      },
      {
        accessor: "second_location_setup",
        Header: "Second Location Setup",
      },
      { accessor: "third_location", Header: "Third Location" },
      {
        accessor: "third_location_startDate",
        Header: "Third Location Start Date",
      },
      {
        accessor: "third_location_endDate",
        Header: "Third Location End Date",
      },
      {
        accessor: "third_location_startTime",
        Header: "third Location Start Time",
      },
      {
        accessor: "third_location_endTime",
        Header: "Third Location End Time",
      },
      {
        accessor: "third_location_setup",
        Header: "Third Location Setup",
      },
      { accessor: "fourth_location", Header: "Fourth Location" },
      {
        accessor: "fourth_location_startDate",
        Header: "Fourth Location Start Date",
      },
      {
        accessor: "fourth_location_endDate",
        Header: "Fourth Location End Date",
      },
      {
        accessor: "fourth_location_startTime",
        Header: "Fourth Location Start Time",
      },
      {
        accessor: "fourth_location_endTime",
        Header: "Fourth Location End Time",
      },
      {
        accessor: "fourth_location_setup",
        Header: "Fourth Location Setup",
      },
      { accessor: "fifth_location", Header: "Fifth Location" },
      {
        accessor: "fifth_location_startDate",
        Header: "Fifth Location Start Date",
      },
      {
        accessor: "fifth_location_endDate",
        Header: "Fifth Location End Date",
      },
      {
        accessor: "fifth_location_startTime",
        Header: "Fifth Location Start Time",
      },
      {
        accessor: "fifth_location_endTime",
        Header: "Fifth Location End Time",
      },
      {
        accessor: "fifth_location_setup",
        Header: "Fifth Location Setup",
      },
      //  { accessor: "selectedDate", Header: "Date" },
      // { accessor: "timeSlot", Header: "Timeslot" },
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

  useEffect(() => {
    const currentUser = auth.currentUser;
    /* 
    Creating a reference to the venue booking collection in Firestore. 
    Filter by current user session uid to retrieve only their records.
    */
    const recordQuery = database.bookingRef.where(
      "userId",
      "==",
      currentUser.uid
    );

    /* Query from database with the reference and store in record state  */
    const unsubscribe = recordQuery.onSnapshot((snapshot) => {
      if (snapshot.docs.length !== 0) {
        const tempItem = [];

        snapshot.docs.forEach((doc) => {
          const SelectedDate = doc.data().selectedDate;
          const formattedSelectedDate = format(
            new Date(SelectedDate),
            "dd-MMM-yyyy"
          );

          tempItem.push({
            bkId: doc.data().bkId,
            requestorName: doc.data().requestorName,
            eventName: doc.data().eventName,
            programmes: doc.data().programmes,
            nofPax: doc.data().nofPax,
            organisation: doc.data().organisation,
            first_location: doc.data().first_location || "—",
            first_location_startDate:
              doc.data().first_location_startDate || "—",
            first_location_endDate: doc.data().first_location_endDate || "—",
            first_location_startTime:
              doc.data().first_location_startTime || "—",
            first_location_endTime: doc.data().first_location_endTime || "—",
            first_location_setup: doc.data().first_location_setup || "—",
            second_location: doc.data().second_location || "—",
            second_location_startDate:
              doc.data().second_location_startDate || "—",
            second_location_endDate: doc.data().second_location_endDate || "—",
            second_location_startTime:
              doc.data().second_location_startTime || "—",
            second_location_endTime: doc.data().second_location_endTime || "—",
            second_location_setup: doc.data().second_location_setup || "—",
            third_location: doc.data().third_location || "—",
            third_location_startDate:
              doc.data().third_location_startDate || "—",
            third_location_endDate: doc.data().third_location_endDate || "—",
            third_location_startTime:
              doc.data().third_location_startTime || "—",
            third_location_endTime: doc.data().third_location_endTime || "—",
            third_location_setup: doc.data().third_location_setup || "—",
            fourth_location: doc.data().fourth_location || "—",
            fourth_location_startDate:
              doc.data().fourth_location_startDate || "—",
            fourth_location_endDate: doc.data().fourth_location_endDate || "—",
            fourth_location_startTime:
              doc.data().fourth_location_startTime || "—",
            fourth_location_endTime: doc.data().fourth_location_endTime || "—",
            fourth_location_setup: doc.data().fourth_location_setup || "—",
            fifth_location: doc.data().fifth_location || "—",
            fifth_location_startDate:
              doc.data().fifth_location_startDate || "—",
            fifth_location_endDate: doc.data().fifth_location_endDate || "—",
            fifth_location_startTime:
              doc.data().fifth_location_startTime || "—",
            fifth_location_endTime: doc.data().fifth_location_endTime || "—",
            fifth_location_setup: doc.data().fifth_location_setup || "—",
            // selectedDate: formattedSelectedDate,
            //timeSlot: doc.data().timeSlot,
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
      }
    });

    return unsubscribe;
  }, []);

  const handleView = (type, fbId) => {
    if (type === "booking") {
      navigate("/booking/" + fbId);
    }
  };

  return (
    <ContentContainer>
      <Helmet>
        <title>RPVB | MyBooking</title>
      </Helmet>
      <div className="form-container">
        <TableContainer
          type="booking"
          columns={columns}
          data={records}
          onView={handleView}
          showViewColumn={true}
        />
      </div>
    </ContentContainer>
  );
};

export default MyBookings;
