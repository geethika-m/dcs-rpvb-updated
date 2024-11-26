import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { museumLocations } from "../../utils/constant";

function LocationModal({
  showModal,
  handleModalToggle,
  locations,
  availableStartTimes,
  availableEndTimes,
  setup,
  updateLocation,
  selectedMuseum,
}) {
  return (
    <Modal show={showModal} onHide={handleModalToggle} fullscreen={true}>
      <Modal.Header closeButton>
        <Modal.Title>Add Location Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Setup</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => {
              // const selectedLoc = locations.find(loc => loc.label === selectedMuseum);
              const matchingLocation = museumLocations.find(
                (location) => location.label === selectedMuseum
              );
              return (
                <tr key={location.id}>
                  <td>
                    <Form.Select
                      className="createBooking-ddl-style2"
                      title={"first_location"}
                      name={"first_location"}
                      onChange={(e) =>
                        updateLocation({
                          id: location.id,
                          key: "locations",
                          value: e.target.value,
                        })
                      }
                    >
                      <option value={" "}>select location</option>
                      {matchingLocation.locations.map((location) => {
                        return <option value={location}>{location}</option>;
                      })}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Group id="selectedDate">
                      <Form.Control
                        className="createBooking-ddl-style3"
                        title={"selectedDate"}
                        name={"selectedDate"}
                        type={"date"}
                        required
                        onChange={(e) =>
                          updateLocation({
                            id: location.id,
                            key: "startDate",
                            value: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group id="endDate">
                      <Form.Control
                        className="createBooking-ddl-style3"
                        title={"endDate"}
                        name={"endDate"}
                        type={"date"}
                        required
                        onChange={(e) =>
                          updateLocation({
                            id: location.id,
                            key: "endDate",
                            value: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group id="startTime">
                      <Form.Select
                        className="createBooking-ddl-style2"
                        title={"startTime"}
                        name={"startTime"}
                        required
                        onChange={(e) =>
                          updateLocation({
                            id: location.id,
                            key: "startTime",
                            value: e.target.value,
                          })
                        }
                      >
                        <option value={" "}>Please select a start time</option>
                        {availableStartTimes.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group id="endTime">
                      <Form.Select
                        className="createBooking-ddl-style2"
                        title={"endTime"}
                        name={"endTime"}
                        required
                        onChange={(e) =>
                          updateLocation({
                            id: location.id,
                            key: "endTime",
                            value: e.target.value,
                          })
                        }
                      >
                        <option value={" "}>Please select an end time</option>
                        {availableEndTimes.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className="createBooking-ddl-style2"
                        title={"setup"}
                        name={"setup"}
                        onChange={(e) =>
                          updateLocation({
                            id: location.id,
                            key: "setup",
                            value: e.target.value,
                          })
                        }
                      >
                        <option value={""}>Please select a setup</option>
                        <option value={"Theatre Style"}>Theatre Style</option>
                        <option value={"Meeting U Shape"}>
                          Meeting U Shape
                        </option>
                        <option value={"Meeting Round Shape"}>
                          Meeting Round Shape
                        </option>
                        <option value={"Other"}>Other</option>
                      </Form.Select>
                    </Form.Group>
                    {setup === "Other" && (
                      <Form.Group controlId="customiseSetup" className="mb-3">
                        <Form.Label className="CreateUser-label">
                          Please upload custom layout
                        </Form.Label>
                        <br />
                        <Form.Control
                          className="uploadFile"
                          title={"customiseSetup"}
                          name={"customiseSetup"}
                          type={"file"}
                          accept="image/*" // Limit file selection to image files
                        />
                      </Form.Group>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleModalToggle}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LocationModal;
