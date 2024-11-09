import ContentContainer from "../../components/pageLayout/contentContainer";
import EventsIcon from "../../images/events_icon.png";
import BookingsIcon from "../../images/bookings_icon.png";
import PendingIcon from "../../images/pending_icon.png";
import { CChart } from "@coreui/react-chartjs";
import { database } from "../../firebase";
import { useEffect, useState } from "react";
import PieChart from "./PieChart";
import MuseumPieChart from "./PieChart";
import BookingBarChart from "./BookingsBarChart";
import { museumsList } from "../../utils/constant";

const Dashboard = () => {
  const [numberOfEvents, setnumberOfEvents] = useState(0);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  useEffect(() => {
    const getnumberOfEvents = () => {
      database.bookingRef.get().then((snapshot) => {
        setnumberOfEvents(snapshot.size);
      });
    };

    const getPendingBookingsCount = () => {
      database.bookingRef.where('approvalStatus', '==', 'Pending').get().then((snapshot) => {
        setPendingBookingsCount(snapshot.size);
      });
    }
    getnumberOfEvents();

    getPendingBookingsCount()
  }, []);

  const [records, setRecords]  = useState([])
  useEffect(() => {
      /* Function to get approver information */
     
      /* Creating a reference to the venue booking collection in Firestore. */
      const recordQuery = database.bookingRef;
  
      /* Query from database with the reference and store in record state  */
      const unsubscribe = recordQuery.orderBy('dateCreated', 'desc').onSnapshot((snapshot) => {
        if (snapshot.docs.length !== 0) {
          const tempItem = [];
  
          snapshot.docs.forEach((doc) => {
            const selectedDate = doc.data().selectedDate;
            console.log('SelectedDate',selectedDate)
              tempItem.push({
                bkId: doc.data().bkId,
                museum: doc.data().museum,
                date: selectedDate
              });
          });
  
          setRecords(tempItem);
        /*  const result = {};
          tempItem.forEach(item => {
              const name = museumsList.find(museum => museum.value === item.museum)?.label;

              if(name !== undefined) {
                  if(!result[name]) {
                      result[name] = 1;
                  } else {
                      result[name] += 1;
                  }
              }
          })
          console.log('records', tempItem);
        //  console.log('result', result);
          
          setRecords(Object.keys(result).map(key => {
              return {
                  name: key, value: result[key]
              }
          }));*/
        }
      });
  
      return unsubscribe;
    }, []);



  const labels = ["Jan", "Feb", "March", "Apr", "May", "June", "July"];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "#8956FF",
        tension: 0.1,
      },
    ],
  };

  const barData = {
    labels: labels,
    datasets: [
      {
        label: "",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColoro: "#8956FF",
        tension: 0.1,
      },
    ],
  };

  const barChartOptions = {
    indexAxis: "y",
  };
  return (
    <ContentContainer>
      <div className="dashboard">
        <div className="top-container">
          <div className="events-container container">
            <div className="left">
              <img src={EventsIcon} alt="events" />
            </div>
            <div className="right">
              <h2 className="heading">No. of Events</h2>
              <div className="count">{numberOfEvents}</div>
            </div>
          </div>
          <div className="bookings-container container">
            <div className="left">
              <img src={BookingsIcon} alt="bookings" />
            </div>
            <div className="right">
              <h2 className="heading">No. of Bookings</h2>
              <div className="count">{numberOfEvents}</div>
            </div>
          </div>
          <div className="pending-container container">
            <div className="left">
              <img src={PendingIcon} alt="Pending Approvals" />
            </div>
            <div className="right">
              <h2 className="heading">Pending Approvals</h2>
              <div className="count">{pendingBookingsCount}</div>
            </div>
          </div>
        </div>
        <div className="middle-container">
          <div className="left container">
            <h6>Number of Bookings Per Month</h6>
            <BookingBarChart records={records}/>
            {/*<CChart type="line" data={data} />*/}
            {/* <CChart type="bar" data={barData} options={barChartOptions} /> */}
          </div>
          <div className="right container">
            <h6>Number of Bookings Per Museum</h6>
            <MuseumPieChart records={records}/>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default Dashboard;
