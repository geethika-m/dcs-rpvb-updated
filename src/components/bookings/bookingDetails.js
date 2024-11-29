import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { database, auth, storage } from "../../firebase";
import * as FaIcons from "react-icons/fa";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useParams } from "react-router-dom";
import axios from "axios";
import { museumsList } from "../../utils/constant";

/**
 * @function BookingDetails
 *
 * Component to get the booking's data from the database and displays the booking details
 * @returns The component is returning a JSX element.
 */

const BookingDetails = (props) => {
  const currentUser = auth.currentUser;

  /* Destructuring the props object. */
  const { recordData } = props;

  /* Setting the initial state of the component. */
  const { bkId } = useParams();
  const [formState, setFormState] = useState(true);
  const [proceed, setProceed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [view, setView] = useState(false);
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [userType, setUserType] = useState(null);
  const [customLayout, setCustomLayout] = useState(recordData.customiseSetup);
  const [nofPax, setNofPax] = useState(recordData.nofPax);
  const [setup, setSetup] = useState(recordData.setup);
  const [selectedInventory, setSelectedInventory] = useState([]);
  let downloadUrl = " ";

  /* Define the array of inventory items */
  /* const inventoryList = [
        "Chairs","Banquet Chairs","GS Table","Kids Chair","Kids Table"
    ] */

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

  useEffect(() => {
    getCurrentUserInfo();
  }, []);

  useEffect(() => {
    // Initialize values when component mounts or when data is first loaded
    setNofPax(recordData.nofPax);
    setSelectedInventory(recordData.inventory);
    setSetup(recordData.setup);
    setCustomLayout(recordData.customiseSetup);
  }, [recordData]);

  /**
   * When the user clicks the button, the form state is toggled and the following fields input is set to the
   * record's current status.
   */
  const toggleFormState = () => {
    setFormState((p) => !p);
    if (!proceed) {
      setNofPax(recordData.nofPax);
      setSelectedInventory(recordData.inventory);
      setSetup(recordData.setup);
      setCustomLayout(recordData.customiseSetup);
    }
  };

  /* Function to update booking data */
  const updateData = async () => {
    try {
      var bookingUpdate = database.bookingRef.doc(bkId);
      if (setup === "Others") {
        await bookingUpdate.update({
          nofPax: nofPax,
          inventory: selectedInventory,
          setup: setup,
          customiseSetup: "Not Applicable",
        });
      } else {
        await bookingUpdate.update({
          nofPax: nofPax,
          inventory: selectedInventory,
          setup: setup,
          customiseSetup: customLayout,
        });
      }
      setMessage("SUCCESS: Booking updated successfully!");
      setShowMessage(true);
      return true;
    } catch (error) {
      setMessage("ERROR: Something went wrong");
      setShowMessage(true);
      console.log(error);
      return false;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (proceed) {
      try {
        const flag = await updateData();
        if (flag) {
          setMessage("SUCCESS: Booking updated successfully!");
          setShowMessage(true);

          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          throw new Error();
        }
      } catch {
        setMessage("ERROR: Something went wrong!");
        setShowMessage(true);
      }
    } else {
      setMessage("ERROR: Invalid Operation!");
      setShowMessage(true);
    }
    toggleFormState();
    setLoading(false);
  };

  /* Function for handling cancelling bookings */
  const handleCancelBooking = () => {
    navigate(`/confirmation/${recordData.bkId}/cancel`);
  };

  /* Function for handling approving bookings */
  const handleApproveBooking = () => {
    navigate(`/confirmation/${recordData.bkId}/approve`);
  };
  /* Function to handle request for booking cancellation */
  const handleRequestCancelBooking = async () => {
    try {
      const customMessage = `Dear EMP,

${recordData.requestorName} has requested for cancellation of booking request of ${recordData.bkId}.

Please proceed to cancel the booking request.

Best Regards
`;
      const response = await axios.post(
        "https://us-central1-rpvb-web.cloudfunctions.net/sendEmail",
        {
          recipient: "events_management@defencecollectivesg.com",
          subject: `Request for booking cancellation for ${recordData.bkId}`,
          message: customMessage,
        }
      );

      setMessage("Cancellation request sent successfully!");
      setShowMessage(true);
    } catch (error) {
      setMessage("ERROR: Cancellation request sent failed! Please try again.");
      setShowMessage(true);
      console.error(error);
    }
  };

  const handleNofPaxChange = (e) => {
    const { value } = e.target;
    setNofPax(value);
  };

  const handleSetupChange = (e) => {
    const { value } = e.target;
    setSetup(value);
  };

  /* Handler for inventory */
  /* const handleInventoryChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedInventory(selectedOptions);
    }; */

  /* Handler for upload files */
  const handleCustomisedSetupUpload = async (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const customLayoutRef = ref(
        storage,
        `customlayouts/${recordData.bkId}/${file.name}`
      );
      await uploadBytes(customLayoutRef, file);
      downloadUrl = await getDownloadURL(customLayoutRef);
      setCustomLayout(downloadUrl);
    }
  };

  useEffect(() => {
    if (recordData.length !== 0) {
      setLoad(true);
    }
  }, [recordData]);

  const museum = museumsList.find(
    (museum) => museum.value === recordData.museum
  )?.label;

  return (
    <React.Fragment>
      {load && (
        <div className="ViewBooking-form-container">
          <Form className="ViewBooking-form" onSubmit={handleSubmit}>
            <div className="ViewBooking-form-content ViewBooking-child1 ">
              <h3>
                <div>
                  <FaIcons.FaBook size={30} color="black" />
                </div>
                Booking Details
              </h3>
              <Form.Group id="museum">
                <Form.Label className="ViewBooking-label">Museum:</Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={museum || ""}
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="eventName">
                <Form.Label className="ViewBooking-label">
                  Event Name:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={recordData.eventName}
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>

              <Form.Group id="programmes">
                <Form.Label className="ViewBooking-label">
                  Programme Name:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={recordData.programmes}
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>

              <Form.Group id="nofPax">
                <Form.Label className="ViewBooking-label">
                  No Of Pax:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  type="number"
                  disabled={formState}
                  defaultValue={recordData.nofPax}
                  onChange={handleNofPaxChange}
                />
              </Form.Group>

              <Form.Group id="organisation">
                <Form.Label className="ViewBooking-label">
                  Organisation:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={recordData.organisation}
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  First Location:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={recordData.first_location || "Not Available"}
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  First Location Start Date:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.first_location_startDate || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  First Location End Date:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.first_location_endDate || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  First Location Start Time:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.first_location_startTime || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  First Location End Time:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.first_location_endTime || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  First Location Setup:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.first_location_setup || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Second Location:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={recordData.second_location || "Not Available"}
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Second Location Start Date:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.second_location_startDate || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Second Location End Date:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.second_location_endDate || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>

              {userType === "Approver" &&
              recordData.approvalStatus !== "Cancelled" &&
              !formState ? (
                <div className="btn-flex">
                  <Button
                    className="ViewBooking-Edit-button"
                    type="submit"
                    disabled={loading || proceed === false ? true : false}
                  >
                    Update
                  </Button>
                  <Button
                    className="ViewBooking-Cancel-button"
                    onClick={toggleFormState}
                    disabled={loading}
                  >
                    Discard
                  </Button>
                </div>
              ) : (
                userType === "Approver" &&
                recordData.approvalStatus !== "Cancelled" && (
                  <Button
                    className={"ViewUser-Edit-button"}
                    onClick={toggleFormState}
                    disabled={loading}
                  >
                    Edit
                  </Button>
                )
              )}
              <div
                className={`message ${
                  message.includes("ERROR") ? "errorMsg" : "successMsg"
                }`}
              >
                <strong
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {message}
                </strong>
              </div>
            </div>
            <div className="ViewBooking-form-content2 ViewBooking-child2">
              <div className="information">
                <p>
                  <strong>BookID:</strong>
                  <br /> {recordData.bkId}
                </p>
                <p>
                  <strong>Requestor Name:</strong>
                  <br /> {recordData.requestorName}
                </p>
              </div>
              {/* Tempoary hidden */}
              {/*   {formState ? (
                         <Form.Group id='inventory'>
                         <Form.Label className="ViewBooking-label">Inventory:</Form.Label><br/>
                         <Form.Control className="ViewBooking-input-style"
                            placeholder={recordData.inventory}
                            type={"text"}
                            disabled
                            readOnly
                            />
                         </Form.Group>      
                    ) : ((
                        <Form.Group controlId="inventory" >
                        <Form.Label className="ViewBooking-label">Inventory:</Form.Label><br/>
                            <Form.Select className="viewBooking-ddl-inventory"
                            title={"inventory"}
                            name={"inventory"}
                            onChange={handleInventoryChange}
                            defaultValue={recordData.inventory}
                            multiple={true}
                         >
                             <option value={"Not Applicable"}>Not Applicable</option>
                             {inventoryList.map((inventory, index) => (
                                 <option key={index} value={inventory}>{inventory}</option>
                             ))}
                         </Form.Select>
                        </Form.Group>
                    ))} */}
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Second Location Start Time:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.second_location_startTime || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Second Location End Time:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.second_location_endTime || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Second Location Setup:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.second_location_setup || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Third Location:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={recordData.third_location || "Not Available"}
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Third Location Start Date:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.third_location_startDate || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Third Location End Date:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.third_location_endDate || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Third Location Start Time:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.third_location_startTime || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Third Location End Time:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.third_location_endTime || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Third Location Setup:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.third_location_setup || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Fourth Location
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={recordData.fourth_location || "Not Available"}
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Fourth Location Start Date:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.fourth_location_startDate || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Fourth Location End Date:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.fourth_location_endDate || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Fourth Location Start Time:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.fourth_location_startTime || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>

              <div className="btn-flex">
                {userType === "Approver" &&
                  recordData.approvalStatus === "Pending" &&
                  formState && (
                    <Button
                      className={"ViewBooking-Approve-button"}
                      onClick={handleApproveBooking}
                      disabled={loading}
                    >
                      {" "}
                      Approve
                    </Button>
                  )}
                {userType === "Approver" &&
                  recordData.approvalStatus !== "Cancelled" &&
                  formState && (
                    <Button
                      className={"ViewBooking-Cancel-button"}
                      onClick={handleCancelBooking}
                      disabled={loading}
                    >
                      {" "}
                      Cancel
                    </Button>
                  )}
              </div>
            </div>

            <div className="ViewBooking-form-content3 ViewBooking-child3">
              <div className="information">
                <p>
                  <strong>Date Created:</strong> <br />
                  {recordData.dateCreated}
                </p>

                {(recordData.approvalStatus === "Approved" ||
                  recordData.approvalStatus === "Cancelled") && (
                  <p>
                    <strong>Approver:</strong> <br />
                    {recordData.approverName}
                  </p>
                )}
              </div>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Fourth Location End Time:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.fourth_location_endTime || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="setup">
                <Form.Label className="ViewBooking-label">
                  Fourth Location Setup:
                </Form.Label>
                <br />
                {!formState ? (
                  <Form.Select
                    className="viewBooking-ddl-style2"
                    disabled={formState}
                    defaultValue={recordData.setup || "Not Available"}
                    type={"text"}
                    onChange={handleSetupChange}
                  >
                    <option value={"Theatre Style"}>Theatre Style</option>
                    <option value={"Meeting U Shape"}>Meeting U Shape</option>
                    <option value={"Meeting Round Shape"}>
                      Meeting Round Shape
                    </option>
                    <option value={"Other"}>Other</option>
                  </Form.Select>
                ) : recordData.setup === "Other" ? (
                  <div className="ViewBooking-input-style">
                    <a href={recordData.customiseSetup} download>
                      Download Setup
                    </a>
                  </div>
                ) : (
                  <Form.Control
                    className="ViewBooking-input-style"
                    placeholder={recordData.setup}
                    type={"text"}
                    disabled
                    readOnly
                  />
                )}
                {!formState && setup === "Other" && (
                  <Form.Group id="customisedSetup">
                    <Form.Label className="ViewBooking-label">
                      Please upload custom layout:
                    </Form.Label>
                    <br />
                    <Form.Control
                      className="uploadFile"
                      title={"customiseSetup"}
                      name={"customiseSetup"}
                      type={"file"}
                      accept="image/*" // Limit file selection to image files
                      onChange={handleCustomisedSetupUpload}
                    />
                  </Form.Group>
                )}
              </Form.Group>
              {recordData.bookStatus !== "Cancelled" && (
                <Form.Group id="approvalStatus">
                  <Form.Label className="ViewBooking-label">
                    Approval Status:
                  </Form.Label>
                  <br />
                  <Form.Control
                    className="ViewBooking-input-style"
                    placeholder={recordData.approvalStatus}
                    type={"text"}
                    disabled
                    readOnly
                  />
                </Form.Group>
              )}
              {recordData.bookStatus === "Cancelled" && (
                <Form.Group id="bookStatus">
                  <Form.Label className="ViewBooking-label">
                    Booking Status:
                  </Form.Label>
                  <br />
                  <Form.Control
                    className="ViewBooking-input-style"
                    placeholder={recordData.bookStatus}
                    type={"text"}
                    disabled
                    readOnly
                  />
                </Form.Group>
              )}
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Fifth Location:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={recordData.fifth_location || "Not Available"}
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Fifth Location Start Date:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.fifth_location_startDate || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Fifth Location End Date:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.fifth_location_endDate || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Fifth Location Start Time:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.fifth_location_startTime || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Fifth Location End Time:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.fifth_location_endTime || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="location">
                <Form.Label className="ViewBooking-label">
                  Fifth Location Setup:
                </Form.Label>
                <br />
                <Form.Control
                  className="ViewBooking-input-style"
                  placeholder={
                    recordData.fifth_location_setup || "Not Available"
                  }
                  type={"text"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group id="completedDate">
                <Form.Label className="ViewBooking-label">
                  Completed Date:
                </Form.Label>
                <br />
                {recordData.completedDate ? (
                  <Form.Control
                    className="ViewBooking-input-style"
                    placeholder={recordData.completedDate}
                    type={"text"}
                    disabled
                    readOnly
                  />
                ) : (
                  <Form.Control
                    className="ViewBooking-input-style"
                    placeholder="No data available."
                    type={"text"}
                    disabled
                    readOnly
                  />
                )}
              </Form.Group>

              <Form.Group id="remarks">
                <Form.Label className="ViewBooking-label">Remarks:</Form.Label>
                <br />
                <Form.Control
                  className="View-input-style2"
                  as="textarea"
                  rows={6}
                  value={recordData.remarks || "No remarks available"}
                  disabled
                  readOnly
                />
              </Form.Group>
              <div className="requestCancel-btn">
                {recordData.userId === currentUser.uid &&
                  recordData.approvalStatus !== "Cancelled" &&
                  formState && (
                    <Button
                      className={"ViewBooking-Cancel-button"}
                      onClick={handleRequestCancelBooking}
                      disabled={loading}
                    >
                      {" "}
                      Request cancellation
                    </Button>
                  )}
              </div>
            </div>
          </Form>
        </div>
      )}
    </React.Fragment>
  );
};

export default BookingDetails;
