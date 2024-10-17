import ContentContainer from "../../components/pageLayout/contentContainer";
import EventsIcon from '../../images/events_icon.png'
import BookingsIcon from '../../images/bookings_icon.png'
import PendingIcon from '../../images/pending_icon.png'

const Dashboard = () => {
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
              <div className="count">1123</div>
            </div>
          </div>
          <div className="bookings-container container">
            <div className="left">
              <img src={BookingsIcon} alt="bookings" />
            </div>
            <div className="right">
              <h2 className="heading">No. of Bookings</h2>
              <div className="count">234</div>
            </div>
          </div>
          <div className="pending-container container">
            <div className="left">
              <img src={PendingIcon} alt="Pending Approvals" />
            </div>
            <div className="right">
              <h2 className="heading">No. of Bookings</h2>
              <div className="count">234</div>
            </div>
          </div>
         
        </div>
        <div className="middle-container">
          <div className="left container">
            <h2 className="title">Peak booking timeslots</h2>
          </div>
          <div className="right container">
          bar Chart

            {/*<h2 className="title">Popular Venues</h2>
            <div className="progress-container">
              <div className="progress">
               <div className="info">
                <h3>Direct</h3>
                <div>1,43,382</div>
               </div>
              </div>
              <div className="progress">
                <div className="info">
                  <h3>Referral</h3>
                  <div>1,43,382</div>
                </div>
              </div>
              <div className="progress">
                <div className="info">
                  <h3>Social Media</h3>
                  <div>1,43,382</div>
                </div>
              </div>
            </div>*/}
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default Dashboard;
