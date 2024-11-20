import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { database, auth, storage } from '../../firebase';
import BookingValidation from './bookingValidation';
import useForm from '../../customHooks/useForm';
import { useNavigate } from 'react-router';
import * as FaIcons from 'react-icons/fa';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axios from 'axios';
import { format, parseISO } from 'date-fns';
//import DatePicker from 'react-multi-date-picker';
//import DatePanel from "react-multi-date-picker/plugins/date_panel"
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { museumLocations, museumsList } from '../../utils/constant';


/**
 * @function CreateBookingForm
 *
 * Creates a form component for user to create new venue booking that is to be stored
 * in Firebase DB, customised layout will be save in storage, download url will be added to DB
 * @returns The component is returning a Card component.
 */

const CreateBookingForm = () => {    
    /* 
    Define the timeslots in 30 min interval in an array 
    Ensure that there is time buffer of at least 15 mins between each booked timeslots.
    */
    const timeSlotsList = [
        "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
        "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
        "8:00 PM"
    ]; 

    /* Define the array of inventory items */
    const inventoryList = [
        "Chairs","Banquet Chairs","GS Table","Kids Chair","Kids Table"
    ]

    /* Define other variables and states */
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [userType, setUserType] = useState(null);
    const [fullName, setFullName] = useState('');
    const [availableStartTimes, setAvailableStartTimes] = useState([...timeSlotsList]);
    const [availableEndTimes, setAvailableEndTimes] = useState([...timeSlotsList]);
    const [isInventoryFocused,setIsInventoryFocused] = useState(' ');
    const [selectedDates, setSelectedDates] = useState([]); // State for storing selected dates
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [firstLocations, setFirstLocations] = useState([]);
    const [secondLocations, setSecondLocations] = useState([]);
    let combinedTimeSlot = '';
    /* Function to create Customised Booking ID */
    const customisedBkId = async (prefix) => {
    /* Query to get total number of records */
        const records = database.bookingRef;
        const snapshot = await records.get();
        const totalCount = snapshot.size;

    /* Create and return the new id incremented by 1 */
        const bkId = totalCount + 1;
        const newBKID = prefix + bkId;
        return newBKID;
    }

    /* Set initial state of the form. */
    const valueState = {
        eventName: '',
        programmes: '',
        nofPax: '',        
        organisation: '',
        inventory: [],
        location: '',
        selectedDate: '',
        startTime: '',
        endTime: '',
        setup: '',
        formFile: '',
        remarks: '', 
    };

    
    /* Function to Check Booking Availability */
    const checkAvailability = async () => {
        /* 
        Based on user selected timeslot, spit and retrieve the time seperately.
        startTime: start time of the timeslot user selected (first value of selected slot)
        endTime: end time of the timeslot user selected (last value of selected slot)
        combinedTimeSlot: combine both startTime and endTime and save as a string
        for saving to database later.
        */
        const startTime = values.startTime;
        const endTime = values.endTime; 

        let overlapInformationRequestorName = '';
        let overlapInformationTimeslot = '';

        /*convert the selected timeslot to date format with selectedDate for comparison */
        const startDateTime = new Date(`${values.selectedDate} ${startTime}`);
        const endDateTime = new Date(`${values.endDate} ${endTime}`);

        /* Include 15 minutes buffer time calculation */
        startDateTime.setMinutes(startDateTime.getMinutes() - 15);
        endDateTime.setMinutes(endDateTime.getMinutes() + 15);

        /* Initialize the availableStatus variable */
        let availableStatus = false; 

        /* Retrieve the data based on location, date selected for the booking */
        const bookingSnapshot = await database.bookingRef
        .where("first_location" , "==", values.first_location)
        .where("second_location" , "==", values.second_location)
        .where("selectedDate", "==", values.selectedDate)
        .get();

        /* Retrieve the available status from database */
        if (!bookingSnapshot.empty) {
            const bookedDoc = bookingSnapshot.docs[0]; 
            const bookingData = bookedDoc.data();
            availableStatus = bookingData.availableStatus;
        }
        
        /* 
        Retrieve all the existing record and split the timeslot into startBookTime and 
        endBookTime
         */
        const overlapsWithBooked = bookingSnapshot.docs.some(doc => {
        const bookedTimeSlot = doc.data().timeSlot; 
        const [startBookedTime, endBookedTime] = bookedTimeSlot.split(" - "); 

        /* Convert the timeslots from existing record to data format for comparison */
        const bookedStartDateTime = new Date(`${values.selectedDate} ${startBookedTime}`);
        const bookedEndDateTime = new Date(`${values.endDate} ${endBookedTime}`);

        /* Check for overlaps, if true there is overlap, else no overlap. */
        if ((startDateTime < bookedEndDateTime && endDateTime > bookedStartDateTime) || 
            (endDateTime < bookedEndDateTime && endDateTime > bookedStartDateTime) ||
            (startDateTime < bookedEndDateTime && startDateTime > bookedStartDateTime)) 
        { 
            overlapInformationRequestorName = doc.data().requestorName;
            overlapInformationTimeslot = doc.data().timeSlot;
            return true; 
        }
            return false;
        });
    
        /* 
        Check for cancel booking logic, whether the resources are freed for others to book
        If availableStatus and overlapsWithBooked is true, allow to book.
        Else if both are false, return overlap error message. 
        */
        if (overlapsWithBooked) {
            if (availableStatus === true)
            { return true; }
            else {
                setShowMessage(true);
                setMessage(`ERROR: Selected timeslot overlaps with 
                ${overlapInformationRequestorName} at ${overlapInformationTimeslot}.`);
                return false; 
            }   
        }
        /* Return true if there isn't any issue, availability is true */
        return true;
}

    /* Function to retrieve current logged in user name */
    const getRequestorInfo = async () => {
        const currentUser = auth.currentUser
        const userDB = await database.usersRef
        .where("uid", "==", currentUser.uid)
        .get();

    /* Check if user exists */
    if (!userDB.isEmpty) {
        const userDoc = userDB.docs[0];
        const userData = userDoc.data();
        const fullName = userData.fullName;
        const userType = userData.userType;

        setUserType(userType);
        setFullName(fullName);

        } 
    }
    useEffect(() => {
        getRequestorInfo();
    }, []);
       
    /* 
    Function to handle Create Booking requests.
    1.) Use checkAvailability function to check for availability,
    Get user name, current user and customised id.

    2.) If isAvailable is true, try to save to firebase database,
    Show success message, send email to the user for confirmation.

    2.2) If there are other issues, return error message.
    */
    const handleBookingRequest = async () => {
        const isAvailable = await checkAvailability();
        const newBKID = await customisedBkId('BKID');
        const currentUser = auth.currentUser;

        const currentDate = new Date();
        const formattedDate = format(currentDate, 'dd-MMM-yyyy');
       // const formattedStartDate = format(parseISO(values.selectedDate), "dd-MMM-yyyy");
        //const formattedEndDate = format(parseISO(values.endDate), "dd-MMM-yyyy");
        combinedTimeSlot = `${values.startTime} - ${values.endTime}`

        let downloadUrl = '';
        
        /* Upload the image to storage, then generate the download url and add to database */
        if(!selectedFile)
        {
            downloadUrl = 'Not Applicable';
        }
        else {
            const fileName = `${selectedFile.name}`;
            const customLayoutRef = ref(storage, `customlayouts/${newBKID}/${fileName}`);
            await uploadBytes(customLayoutRef, selectedFile);
            downloadUrl = await getDownloadURL(customLayoutRef);
        }
    
        if(isAvailable) {
            try {     

                database.bookingRef.add({
                    bkId: newBKID,
                    userId: currentUser.uid,
                    requestorName: fullName,
                    requestorEmail: currentUser.email,
                    dateCreated: formattedDate,
                    startDate: values.selectedDate,
                    endDate: values.endDate,
                    museum: values.museum,
                    eventName: values.eventName,
                    programmes: values.programmes,
                    nofPax: values.nofPax,
                    organisation: values.organisation,
                    inventory: values.inventory,
                    first_location: values.first_location,
                    second_location: values.second_location,
                    selectedDate: values.selectedDate,
                    timeSlot: combinedTimeSlot,
                    setup: values.setup,
                    customiseSetup: downloadUrl,
                    remarks: values.remarks,
                    approvalStatus: "Pending",
                    bookStatus: "Booked",
                    availableStatus: false,
                })
            
                /* 
                Set and delay hiding the message for successful booking 
                Redirect user to Homepage after 3 seconds
                */
                setShowMessage(true);
                setMessage("Create booking successful!");
                setTimeout(() => {
                    setShowMessage(false);
                    navigate('/homepage');
                }, 3000);   

                /* Send Email to requestor that their request was submitted successfully */
                const customMessage = 
`Dear ${fullName},

Your venue booking for event "${values.eventName}" has been confirmed. 

Book ID: ${newBKID}
Event Name: ${values.eventName}
Programme Name: ${values.programmes}
No. of Pax: ${values.nofPax}
Organisation: ${values.organisation}
Inventory: ${values.inventory}
Selected Date: ${values.selectedDate}
Location : ${values.location}
Time Slot: ${combinedTimeSlot}

No further action required.

If you wish to cancel your booking, please contact EMP Department.

Best Regards
`;
                const response = await axios.post('https://us-central1-rpvb-web.cloudfunctions.net/sendEmail', {
                    recipient: currentUser.email,
                    subject: `Booking Confirmation for ${newBKID}`,
                    message: customMessage,
                    });
                    
                // Send email to the whole department about the new booking request
                const customMessage2 = 
`Dear EMP,

A new venue booking ${newBKID} has been created by ${fullName}. 

Event: ${values.eventName}
Organisation: ${values.organisation}
Date of Event: ${values.selectedDate}
Timeslot: ${combinedTimeSlot}

Please assist in approving this booking.

Best Regards
`;
                const response2 = await axios.post('https://us-central1-rpvb-web.cloudfunctions.net/sendEmail', {
                    recipient: "events_management@defencecollectivesg.com",
                    subject: `New Venue Booking Request ${newBKID} Created`,
                    message: customMessage2,
                });
                }
            catch(error){
                console.log('occ error', error);
                setShowMessage(true);
                setMessage("ERROR: An error occurred while processing your booking request. Please try again.");
            }
        }        
    }

    /* Destructuring object returned by the custom hook `useForm` */
    const { handleChange, handleSubmit, selectedFile, values, errors, loading} = 
    useForm((values) => BookingValidation(values, selectedFile), valueState, handleBookingRequest);  

    const handleMuseumChange = (e) => {
        setFirstLocations([])
        setSecondLocations([])
        const value = e.target.value;
        const list = museumLocations.find(loc => loc.label === value);
        const first = list.first_locations;
        const second = list.second_locations;
        setFirstLocations(first);
        setSecondLocations(second);
        handleChange(e);
    };

    const filterStartTimes = () => {
        if (values.endTime) {
          const selectedEndTimeIndex = timeSlotsList.indexOf(values.endTime);
          return timeSlotsList.slice(0, selectedEndTimeIndex);
        }
        return timeSlotsList;
      };
      
      // Filter available end times based on selected start time
      const filterEndTimes = () => {
        if (values.startTime) {
          const selectedStartTimeIndex = timeSlotsList.indexOf(values.startTime);
          return timeSlotsList.slice(selectedStartTimeIndex + 1);
        }
        return timeSlotsList;
      };
      
      useEffect(() => {
        setAvailableStartTimes(filterStartTimes());
        setAvailableEndTimes(filterEndTimes());
      }, [values.startTime, values.endTime]);

    return (
        <div className="CreateBooking-form-container">
        <Form className="CreateBooking-form">
            <div className="CreateBooking-form-content CreateBooking-child1 ">
                <h3>
                    <div><FaIcons.FaWpforms size={30} color="black" /></div>
                    Create Booking Form
                </h3>
                <Form.Group id="museum">
                    <Form.Label className="CreateUser-label">Select Museum:</Form.Label><br/>
                    <Form.Select className="createBooking-ddl-style2"
                        title={"museum"}
                        name={"museum"}
                        onChange={handleMuseumChange}
                        value={values.museum}
                    >
                        <option value={" "}>Please select your museum</option>
                        {museumsList.map((museum) => {
                            const {label, value} = museum;
                            return (
                                <option value={value}>{label}</option>
                            )
                        })}
                    </Form.Select>
                    {errors.museum && ( <p className="validate-error">{errors.museum} </p> )} 
                </Form.Group> 
                <Form.Group id="eventName" >
                    <Form.Label className="CreateUser-label">Event Name:</Form.Label><br/>
                    <Form.Control className="CreateUser-input-style"
                        title={"eventName"}
                        name={"eventName"}
                        type={"text"}
                        value={values.eventName}
                        minLength={"2"}
                        maxLength={"256"}
                        onChange={handleChange}
                        required
                    />
                    {errors.eventName && ( <p className="validate-error">{errors.eventName} </p> )} 
                </Form.Group>   
                <Form.Group>
                    <Form.Label className="CreateUser-label">Programmes:</Form.Label><br/>
                    <Form.Select className="createBooking-ddl-style"
                        title={"programmes"}
                        name={"programmes"}
                        onChange={handleChange}
                        value={values.programmes}
                    >
                        <option value={""}>Please select a programme</option>
                        <option value={"Other Programmes"}>Other Programmes</option>
                        <option value={"Black Lake Series"}>Black Lake Series</option>
                        <option value={"Crossfire Paintball"}>Crossfire Paintball</option>
                        <option value={"Escape Quest"}>Escape Quest</option>
                        <option value={"Knock Knock Hello Neighbour"}>Knock Knock  Hello Neighbour</option>
                        <option value={"Oh What Farm"}>Oh What Farm</option>
                        <option value={"Ready & Decisive Option 1"}>Ready & Decisive Option 1</option>
                        <option value={"Ready & Decisive Option 2"}>Ready & Decisive Option 2</option>
                        <option value={"Ready & Decisive Option 3"}>Ready & Decisive Option 3</option>
                        <option value={"SG Story Guided Tour"}>SG Story Guided Tour</option>
                        <option value={"Undersiege"}>Undersiege</option>
                    </Form.Select>
                    {errors.programmes && ( <p className="validate-error">{errors.programmes} </p> )} 
                </Form.Group>
                <Form.Group id="nofPax">
                    <Form.Label className="CreateUser-label">No.of Pax:</Form.Label><br/>
                    <Form.Control className="CreateUser-input-style"
                        title={"nofPax"}
                        name={"nofPax"}
                        type={"number"}
                        value={values.nofPax}
                        onChange={handleChange}
                        required
                    />
                    {errors.nofPax && ( <p className="validate-error">{errors.nofPax} </p> )} 
                </Form.Group> 
                <Form.Group id="organisation">
                    <Form.Label className="CreateUser-label">Organisation:</Form.Label><br/>
                    <Form.Control className="CreateUser-input-style"
                        title={"organisation"}
                        name={"organisation"}
                        type={"text"}
                        value={values.organisation}
                        onChange={handleChange}
                        required
                    />
                    {errors.organisation && ( <p className="validate-error">{errors.organisation} </p> )} 
                </Form.Group> 
                <Form.Group id='inventory'>
                    <Form.Label className="CreateUser-label">Inventory:</Form.Label><br/>
                    <Form.Select className="createBooking-ddl-inventory"
                        title={"inventory"}
                        name={"inventory"}
                        onChange={handleChange}
                        value={values.inventory}
                            multiple={true}
                    >
                        <option value={" "}>Select the resources needed</option>
                        <option value={"Not Applicable"}>Not Applicable</option>
                        {inventoryList.map((inventory, index) => (
                            <option key={index} value={inventory}>{inventory}</option>
                        ))}
                    </Form.Select>
                    {errors.inventory && ( <p className="validate-error">{errors.inventory} </p> )} 
                </Form.Group>  

                <div className={`message ${message.includes("ERROR") ? 'errorMsg' : 'successMsg'}`}>
                <strong style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {message}
                </strong>
                </div>
            </div>
            <div className="CreateBooking-form-content2 CreateBooking-child2"> 
                <Form.Group id="museum">
                    <Form.Label className="CreateUser-label">First Location:</Form.Label><br/>
                    <Form.Select className="createBooking-ddl-style2"
                        title={"first_location"}
                        name={"first_location"}
                        onChange={handleChange}
                        value={values.first_location}
                    >
                        <option value={" "}>Please select your first location</option>
                        {firstLocations.map(location => {
                            return (
                                <option value={location}>{location}</option>
                            )
                        })}
                    </Form.Select>
                    {errors.location && ( <p className="validate-error">{errors.location} </p> )} 
                </Form.Group> 
                <Form.Group id="second_location">
                    <Form.Label className="CreateUser-label">Second Location:</Form.Label><br/>
                    <Form.Select className="createBooking-ddl-style2"
                        title={"second_location"}
                        name={"second_location"}
                        onChange={handleChange}
                        value={values.second_location}
                    >
                        <option value={" "}>Please select your second location</option>
                        {secondLocations.map(location => {
                            return (
                                <option value={location}>{location}</option>
                            )
                        })}
                    </Form.Select>
                    {errors.location && ( <p className="validate-error">{errors.location} </p> )} 
                </Form.Group>              
                <Form.Group id="selectedDate">
                    <Form.Label className="CreateUser-label">Start Date:</Form.Label><br/>
                    <Form.Control className="createBooking-ddl-style3"
                        title={"selectedDate"}
                        name={"selectedDate"}
                        type={"date"}
                        value={startDate}
                        onChange={handleChange}
                        required
                    />
                    {/*<DatePicker startDate={startDate} endDate={endDate} selected={startDate}   title={"selectedDate"}
                         onChange={(selectedDate) => {
                            const [start, end] = selectedDate;
                            setStartDate(start);
                            setEndDate(end);
                            handleChange({
                                target: {
                                    name: 'selectedDate',
                                    value: selectedDate
                                }
                            });
                        }} selectsRange    />
                        *'/}
                    {/*<Form.Control className="createBooking-ddl-style3"
                        title={"selectedDate"}
                        name={"selectedDate"}
                        type={"date"}
                        value={values.selectedDate}
                        onChange={handleChange}
                        required
                    />*/}
                    {errors.selectedDate && ( <p className="validate-error">{errors.selectedDate}</p> )}
                </Form.Group>     
                <Form.Group id="endDate">
                    <Form.Label className="CreateUser-label">End Date:</Form.Label><br/>
                    <Form.Control className="createBooking-ddl-style3"
                        title={"endDate"}
                        name={"endDate"}
                        type={"date"}
                        value={endDate}
                        onChange={handleChange}
                        required
                    />
                    {errors.endDate && ( <p className="validate-error">{errors.endDate}</p> )}
                </Form.Group>     
                <Form.Group id="startTime">
                    <Form.Label className="CreateUser-label">Start Time:</Form.Label><br />
                    <Form.Select className="createBooking-ddl-style2"
                        title={"startTime"}
                        name={"startTime"}
                        value={values.startTime}
                        onChange={handleChange}
                        required
                    >
                        <option value={" "}>Please select a start time</option>
                        {availableStartTimes.map((time, index) => (
                        <option key={index} value={time}>
                            {time}
                        </option>
                        ))}
                    </Form.Select>
                    {errors.startTime && <p className="validate-error">{errors.startTime}</p>}
                    </Form.Group>

                    <Form.Group id="endTime">
                    <Form.Label className="CreateUser-label">End Time:</Form.Label><br />
                    <Form.Select className="createBooking-ddl-style2"
                        title={"endTime"}
                        name={"endTime"}
                        value={values.endTime}
                        onChange={handleChange}
                        required
                    >
                        <option value={" "}>Please select an end time</option>
                        {availableEndTimes.map((time, index) => (
                        <option key={index} value={time}>
                            {time}
                        </option>
                        ))}
                    </Form.Select>
                    {errors.endTime && <p className="validate-error">{errors.endTime}</p>}
                </Form.Group>
                <Form.Group>
                    <Form.Label className="CreateUser-label">Setup:</Form.Label><br/>
                    <Form.Select className="createBooking-ddl-style2"
                        title={"setup"}
                        name={"setup"}
                        onChange={handleChange}
                        value={values.setup}
                    >
                        <option value={""}>Please select a setup</option>
                        <option value={"Theatre Style"}>Theatre Style</option>
                        <option value={"Meeting U Shape"}>Meeting U Shape</option>
                        <option value={"Meeting Round Shape"}>Meeting Round Shape</option>
                        <option value={"Other"}>Other</option>
                    </Form.Select>
                    {errors.setup && ( <p className="validate-error">{errors.setup}</p> )}
                </Form.Group>  
                {values.setup === "Other" && ( 
                    <Form.Group controlId="customiseSetup" className="mb-3">
                        <Form.Label className="CreateUser-label">Please upload custom layout</Form.Label><br/>
                        <Form.Control
                        className="uploadFile"
                        title={"customiseSetup"}
                        name={"customiseSetup"}
                        type={"file"}
                        accept="image/*" // Limit file selection to image files
                        value={values.customiseSetup}
                        onChange={handleChange}
                        />
                    </Form.Group>  
                )}
                {errors.customiseSetup && ( <p className="validate-error">{errors.customiseSetup}</p> )} 
                                                                                                                                   
            </div>
            <div className="CreateBooking-form-content3 CreateUser-child3">      
            <Form.Group>
                    <Form.Label className="CreateUser-label">Remarks:</Form.Label><br/>
                        <Form.Control className="CreateUser-input-style2"
                            name={"remarks"}
                            as={"textarea"}
                            value={values.remarks}
                            onChange={handleChange}
                            maxLength={500}
                        />
                        {errors.remarks && ( <p className="validate-error">{errors.remarks}</p> )}
                        <p className="character-counter">
                            {values.remarks.length} / 500 characters left
                        </p>
                </Form.Group>                                                                                                                    
                        <button
                                title='submitbtn'
                                className={"CreateBooking-button"}
                                type={"submit"}
                                disabled={loading}
                                onClick={handleSubmit}
                            > Submit
                            </button>   
            </div>
        </Form>
    </div>
    );
};

export default CreateBookingForm;