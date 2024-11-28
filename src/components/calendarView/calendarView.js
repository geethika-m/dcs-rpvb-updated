import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

const events = [
  {
    id: "BKID13",
    title: "test",
    start: "2024-04-11T09:30:00",
    end: "2024-04-11T12:00:00",

    resource: "Black Lake Series",
    location: "Concourse",
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

const MyCalendar = ({ data }) => {
  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const formattedData = useMemo(() => {
    return data?.map((item) => {
      console.log("item", item);
      const startTime = item?.timeSlot?.split(" - ")[0];
      const endTime = item?.timeSlot?.split(" - ")[1];
      const selectedDateParts = item?.selectedDate?.split("-");
      const endDateParts = item?.endDate?.split("-");

      const selectedMonth = monthMap[selectedDateParts[1]];
      const selectedEndMonth = monthMap[endDateParts[1]];
      const selectedDateISO = `${selectedDateParts[2]}-${selectedMonth}-${selectedDateParts[0]}`;
      const endDateISO = `${endDateParts[2]}-${selectedEndMonth}-${endDateParts[0]}`;
      // Create start and end dates
      const startDate = new Date(
        `${selectedDateISO}T${convertTo24Hour(startTime)}`
          .replace(" PM", "")
          .replace(" AM", "")
      );
      const endDate = new Date(
        `${endDateISO}T${convertTo24Hour(endTime)}`
          .replace(" PM", "")
          .replace(" AM", "")
      );

      return {
        title: JSON.stringify(item),
        //start: startDate.toISOString(),
        start: new Date().toISOString(),
        //start: parseISO(format(startDate, "dd-MMM-yyyy")).toISOString(),
        //  end: parseISO(format(endDate, "dd-MMM-yyyy")).toISOString(),
        end: new Date().toISOString(),
      };
    });
  }, [data, monthMap]);

  function convertTo24Hour(time) {
    let [hour, minute] = time.split(":");
    if (hour === "12") {
      hour = "00";
    }
    if (time.includes("PM")) {
      hour = parseInt(hour, 10) + 12;
    }
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  }

  const handleDateClick = (arg) => {
    alert(arg.dateStr);
  };
  const navigate = useNavigate();

  function renderEventContent(eventInfo) {
    const eventData = JSON.parse(eventInfo.event.title);
    return (
      <div className="event-data">
        <p>
          <b>Museum</b>: {eventData.museum}
        </p>
        <p>
          <b>Event Name</b>: {eventData.eventName}
        </p>
        <p>
          <b>Programmes</b>: {eventData.programmes}
        </p>
        <p>
          <b>Organisation</b>: {eventData.organisation}
        </p>
        <p>
          <b>First Location</b>: {eventData.first_location}
        </p>
        <p>
          <b>Second Location</b>: {eventData.second_location}
        </p>
        <p>
          <b>Timeslot</b>: {eventData.timeSlot}
        </p>
        <button
          onClick={() => {
            navigate(`/booking/${eventData.fbId}`);
          }}
        >
          View Booking
        </button>
      </div>
    );
  }

  return (
    <div className="calendar-card">
      <FullCalendar
        plugins={[dayGridPlugin]}
        weekends={true}
        events={formattedData}
        startAccessor="start"
        endAccessor="end"
        eventContent={renderEventContent}
        dateClick={handleDateClick}
      />
    </div>
  );
};

export default MyCalendar;
