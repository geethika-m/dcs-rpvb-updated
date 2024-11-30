import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { location_labels, museumLocations } from "../../utils/constant";

function BookingLocationsModal({
  showModal,
  handleModalToggle,
  validateLocations,
  locations,
  availableStartTimes,
  availableEndTimes,
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
            {locations.map((location, index) => {
              // const selectedLoc = locations.find(loc => loc.label === selectedMuseum);
              const matchingLocation = museumLocations.find(
                (location) => location.label === selectedMuseum
              );
              const locationLabel = location_labels.find(
                (loc) => loc.index === index
              )?.label;
              const value = `${locationLabel}_selectedSetup`;
              const actualValue = location[value];
              const selectedSetup = locations.find(
                (location) => location[value] === actualValue
              );
              const combined = locationLabel + "_selectedSetup";
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
                          key: locationLabel,
                          value: e.target.value,
                        })
                      }
                    >
                      <option value={""}>select location</option>
                      {matchingLocation.first_locations.map((location) => {
                        return (
                          <option value={location} key={location}>
                            {location}
                          </option>
                        );
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
                            key: locationLabel + "_startDate",
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
                            key: locationLabel + "_endDate",
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
                            key: locationLabel + "_startTime",
                            value: e.target.value,
                          })
                        }
                      >
                        <option value={""}>Please select a start time</option>
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
                            key: locationLabel + "_endTime",
                            value: e.target.value,
                          })
                        }
                      >
                        <option value={""}>Please select an end time</option>
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
                        onChange={(e) => {
                          const value = e.target.value;
                          updateLocation({
                            id: location.id,
                            key: locationLabel + "_setup",
                            value,
                          });

                          updateLocation({
                            id: location.id,
                            key: locationLabel + "_selectedSetup",
                            value,
                          });
                        }}
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
                  </td>
                  <td>
                    {" "}
                    {selectedSetup[combined] === "Other" && (
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
                          onChange={(event) => {
                            updateLocation({
                              id: location.id,
                              key: locationLabel + "_customiseSetup",
                              value: event.target.value,
                            });
                            updateLocation({
                              id: location.id,
                              key: locationLabel + "_setupFile",
                              value: event.target.files?.[0],
                            });
                          }}
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
        <Button variant="primary" onClick={validateLocations}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BookingLocationsModal;
