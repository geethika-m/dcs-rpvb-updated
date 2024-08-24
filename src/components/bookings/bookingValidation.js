/**
 * Validate Booking form values
 * @param values - The values of the form
 * @returns An object with the errors.
 */
export function BookingValidation(values, selectedFile) {
    let errors = {};

    if (!values.museum) {
        errors.museum = "Please select museum.";
    } 

    /* 
    * Checks if the eventName field is empty, 
    * and if it is, it returns an error message. 
    */
    if (!values.eventName) {
        errors.eventName = "Please enter event name.";
    } 
    /* 
    * Checks if the programmes field is empty, 
    * and if it is, it returns an error message. 
    */
    if (!values.programmes) {
        errors.programmes = "Please select a programme.";
    } 
    /* 
    * Checks if the location field is empty, 
    * and if it is, it returns an error message. 
    */
    if (!values.first_location) {
        errors.first_location = "Please select first location.";
    } 

    if (!values.second_location) {
        errors.second_location = "Please select second location.";
    } 
    /* 
    * Checks if the nofPax field is empty, negative value or zero 
    * and if it is, it returns error message. 
    */
    if (!values.nofPax) {
        errors.nofPax = "nofPax is required.";
    }
    else if((values.nofPax) < 0) {
        errors.nofPax = "nofPax cannot be negative."
    }
    else if((values.nofPax) === 0){
        errors.nofPax = "nofPax cannot be zero."
    }
    /* 
    * Checks if the organisation field is empty, 
    * and if it is, it returns an error message. 
    */
    if (!values.organisation) {
        errors.organisation = "Please enter organisation.";
    }
    /* 
    * Checks if the start time field is empty, 
    * and if it is, it returns an error message. 
    */
    if (!values.startTime) {
        errors.startTime = "Please select a start time.";
    }

    /* 
    * Checks if the end time field is empty, 
    * and if it is, it returns an error message. 
    */
    if (!values.endTime) {
        errors.endTime = "Please select an end time.";
    }
    
    /* 
    * Checks if the inventory field is empty, 
    * and if it is, it returns an error message. 
    */
    if (!values.inventory || values.inventory.length === 0 || values.inventory.includes(" ")) {
        errors.inventory = "Please select at least one item from inventory.";
    }

    /* 
    * Checks if the selectedDate field is empty, 
    * and if it is, it returns an error message. 
    */
    if (!values.selectedDate) {
        errors.selectedDate = "Please select a start date.";
    } 
    else if (!values.endDate) {
        errors.endDate = "Please select a end date.";
    } else {
       /* const selectedDate = new Date(values.selectedDate);
    
        if (selectedDate.toString() === "Invalid Date") {
            errors.selectedDate = "Invalid date selected.";
        } else {
            const currentDate = new Date();
    
            // Set the time to midnight (00:00:00) for comparing both dates.
            selectedDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);
    
            if (selectedDate.getTime() < currentDate.getTime()) {
                errors.selectedDate = "Invalid date selected.";
            } else {
                // Calculate the minimum allowed date (2 days in advance)
                const minimumDate = new Date(currentDate);
                minimumDate.setDate(currentDate.getDate() + 2);
    
                if (selectedDate.getTime() < minimumDate.getTime()) {
                    errors.selectedDate = "Book date must be booked at least 2 days in advance.";
                }
            }
        }*/
    }
    
    /* 
    * Checks if the setup field is empty, 
    * and if it is, it returns an error message. 
    */
    if (!values.setup) {
        errors.setup = "Setup is required.";
    }
    /* 
    * Checks if setup is selected as "Others" and
    * customiseSetup is empty
    * and if it is, it returns an error message. 
    */
    if (values.setup === "Other" && !selectedFile) {
        errors.customiseSetup = "Please upload a custom layout.";
    }
    
    return errors;
}

export default BookingValidation;