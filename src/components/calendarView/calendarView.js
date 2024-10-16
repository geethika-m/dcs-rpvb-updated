import React from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import { useNavigate } from "react-router-dom";

const events = [
  {
    id: 'BKID13',
    title: 'test',
    start: '2024-04-11T09:30:00',
    end: '2024-04-11T12:00:00',
    
    resource: 'Black Lake Series',
    location: 'Concourse',
  },
  // Add more events here
];


const EventComponent = ({ event }) => {
  return (
    <div>
      <strong>{event.title}</strong>
      <br />
      <span>{event.location}</span>
    </div>
  );
};



    
//     return formattedData;

const MyCalendar = ({data}) => {
console.log('data' , data)
  const monthMap = {
    "Jan": "01",
    "Feb": "02",
    "Mar": "03",
    "Apr": "04",
    "May": "05",
    "Jun": "06",
    "Jul": "07",
    "Aug": "08",
    "Sep": "09",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12"
  };
  
  const formattedData = data?.map((item) => {
    const startTime = item?.timeSlot?.split(' - ')[0];
    const endTime = item?.timeSlot?.split(' - ')[1];
    
    
    const selectedDateParts = item?.selectedDate?.split('-');
    const endDateParts = item?.endDate?.split('-');
    
    const selectedMonth = monthMap[selectedDateParts[1]];
    const selectedEndMonth = monthMap[endDateParts[1]];
    const selectedDateISO = `${selectedDateParts[2]}-${selectedMonth}-${selectedDateParts[0]}`;
    const endDateISO = `${endDateParts[2]}-${selectedEndMonth}-${endDateParts[0]}`;
  
    // Create start and end dates
    const startDate = new Date(`${selectedDateISO}T${convertTo24Hour(startTime)}`.replace(' PM','').replace(' AM',''));
    const endDate = new Date(`${endDateISO}T${convertTo24Hour(endTime)}`.replace(' PM','').replace(' AM',''));
    
    return {
      title: JSON.stringify(item),
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      
    };

  });
  
  function convertTo24Hour(time) {
    const [hour, minute] = time.split(':');
    let newHour = parseInt(hour);
    if (time.includes('PM')) {
      newHour += 12;
    }
    return `${newHour.toString().padStart(2, '0')}:${minute}`;
  }

  const handleDateClick = (arg) => {
    alert(arg.dateStr)
  }
  const navigate = useNavigate();

  
  function renderEventContent(eventInfo) {
  
    const eventData = JSON.parse(eventInfo.event.title);
    return(
      <div className='event-data'>
        <p><b>BkId</b>: {eventData.bkId}</p>
        <p><b>Museum</b>: {eventData.museum}</p>
        <p><b>Requestor</b>: {eventData.requestorName}</p>
        <p><b>Date Created</b>: {eventData.dateCreated}</p>
        <p><b>Event Name</b>: {eventData.eventName}</p>
        <p><b>Programmes</b>: {eventData.programmes}</p>
        <p><b>No of Pax</b>: {eventData.nofPax}</p>
        <p><b>Organisation</b>: {eventData.organisation}</p>
        <p><b>First Location</b>: {eventData.first_location}</p>
        <p><b>Second Location</b>: {eventData.second_location}</p>
        <p><b>Timeslot</b>: {eventData.timeSlot}</p>
        <p><b>Approval Status</b>: {eventData.approvalStatus}</p>
        <button onClick={()=>{
          navigate(`/booking/${eventData.fbId}`);
        }}>View Booking</button>
      </div>
    )
  }
    

  return (
    <div className="calendar-card">
      <FullCalendar
        plugins={[dayGridPlugin]}
        weekends={false}
        events={formattedData}
        startAccessor="start"
        endAccessor="end"
        eventContent={renderEventContent}
        dateClick={handleDateClick}
      />
    </div>
  );
}


  
  


export default MyCalendar;
