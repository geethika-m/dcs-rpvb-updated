const emailRegex = RegExp(/^(([a-zA-Z\d!#$%&'*+/=?^_`{|}~-]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\d]+\.)+[a-zA-Z]{2,}))$/)
const mobileRegex = RegExp(/^(\+65)?[689]\d{7}$/);
const nameRegex = RegExp(/^[A-Za-z\s]{2,}$/);

/**
 * Validate Register form values
 * @param values - The values of the form
 * @returns An object with the errors.
 */
export function validateRegister(values) {
    let errors = {};

    /**
     * It checks if the name field is empty, and if it is, it returns an error message.
     * If the name field is not empty, it checks if the name is valid.
     * If the name is not valid, it returns an error message. 
     **/
    if (!values.name) {
        errors.name = "Name required";
    } else if (!nameRegex.test(values.name)) {
        errors.name = "Invalid Name";
    }

    /**
     * It checks if the password field is empty, and if it is, it returns an error message.
     * If password field is not empty, checks the length and format of the password,
     * if either don't match the requirements, prompt error message.
     **/
    if (!values.password) {
        errors.password = "Password required";
    } else if (values.password.length < 8) {
        errors.password = "Password needs to be 8 characters or more";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/.test(values.password)
    ) {
        errors.password = "New Password does not meet the minimum requirement";
    }

    /**
     * It checks if the mobileNumber field is empty, and if it is, it returns an error message.
     * If the mobileNumber field is not empty, it checks if the mobileNumber is valid.
     * If the mobileNumber is not valid, it returns an error message.
     **/
     if (!values.mobileNumber) {
        errors.mobileNumber = "Mobile Number required";
    } 
    else if (!mobileRegex.test(values.mobileNumber)) {
        errors.mobileNumber = "Mobile Number is invalid";
    }

    /**
     * It checks if the email field is empty, and if it is, it returns an error message.
     * If the email field is not empty, it checks if the email is valid.
     * If the email is not valid, it returns an error message.
     **/
    if (!values.email) {
        errors.email = "Email required";
    } else if (!emailRegex.test(values.email)) {
        errors.email = "Email address is invalid";
    }


     /**
     * It checks if the museum field is empty, and if it is, it returns an error message.
     **/
     if (!values.museum) {
        errors.museum = "Please select a museum.";
    } 
    /**
     * It checks if the department field is empty, and if it is, it returns an error message.
     **/
    if (!values.department) {
        errors.department = "Please select a department.";
    } 

    /**
     * It checks if the userType field is empty, and if it is, it returns an error message.
     **/
    if (!values.userType) {
        errors.userType = "Please select a user type.";
    } 

    return errors;
}

/**
 * If the current password is not entered, then the error message is "Password is required".
 * 
 * If the new password is not entered, then the error message is "New Password is required".
 * 
 * If the new password is less than 8 characters, then the error message is "New Password needs to be 8
 * characters or more".
 * 
 * If the new password does not meet the minimum requirement, then the error message is "New Password
 * does not meet the minimum requirement".
 * 
 * If the confirm password is not entered, then the error message is "Password is required".
 * 
 * If the new password and confirm password do not match, then the error message is "Password do not
 * match".
 * @param values - the values of the form
 * @returns An object with the following properties:
 */
export function validateChangePassword(values) {
    let errors = {};

    if (!values.currentPassword) {
        errors.currentPassword = "Current Password is required";
    }

    if (!values.newPassword) {
        errors.newPassword = "New Password is required";
    } else if (values.newPassword.length < 8) {
        errors.newPassword = "New Password needs to be 8 characters or more";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/.test(values.newPassword)
    ) {
        errors.newPassword = "New Password does not meet the minimum requirements";
    }

    if (!values.cfmPassword) {
        errors.cfmPassword = "Confirm Password is required";
    } else if (values.newPassword !== values.cfmPassword) {
        errors.cfmPassword = "Password do not match";
    }

    return errors;
}

/**
 * Function for Reset Password.
 * 
 * @param values - the values of the form
 * @returns An object with the following properties:
 */
export function validateNewPassword(values) {
    let errors = {};

    if (!values.newPassword) {
        errors.newPassword = "New Password is required";
    } else if (values.newPassword.length < 8) {
        errors.newPassword = "New Password needs to be 8 characters or more";
    } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{6,})/.test(
            values.newPassword
        )
    ) {
        errors.newPassword = "New Password does not meet the minimum requirements";
    }

    if (!values.cfmPassword) {
        errors.cfmPassword = "Password is required";
    } else if (values.newPassword !== values.cfmPassword) {
        errors.cfmPassword = "Password do not match";
    }

    return errors;
}

/**
 * If the email field is empty, return an error message. If the email field is not empty, check if it's
 * a valid email address. If it's not a valid email address, return an error message.
 * @param values - The values of all the fields in the form.
 * @returns An object with a key of email and a value of "Email required" or "Email address is invalid"
 */
export function validateEmail(values) {
    let errors = {};

    if (!values.email) {
        errors.email = "Email required";
    } else if (!emailRegex.test(values.email)) {
        errors.email = "Email address is invalid";
    }

    return errors;
}


/**
 * If the email or password field is empty, then return an error
 * @param values - The values of the form
 * @returns An object with the keys of email and password.
 */
export function validateLogin(values) {
    let errors = {};

    if (!values.email) {
        errors.email = "Email required";
    }

    if (!values.password) {
        errors.password = "Password required";
    }

    return errors;
}

/**
 * Validate Update Profile form values
 * @param values - The values of the form
 * @returns An object with the errors.
 */
export function validateProfile(values) {
    let errors = {};

    /**
     * It checks if the name field is empty, and if it is, it returns an error message.
     * If the name field is not empty, it checks if the name is valid.
     * If the name is not valid, it returns an error message. 
     **/
    if (!values.name) {
        errors.name = "Name required";
    } else if (!nameRegex.test(values.name)) {
        errors.name = "Invalid Name";
    }

    /**
     * It checks if the mobileNumber field is empty, and if it is, it returns an error message.
     * If the mobileNumber field is not empty, it checks if the mobileNumber is valid.
     * If the mobileNumber is not valid, it returns an error message.
     **/
    if (!values.mobileNumber) {
        errors.mobileNumber = "Mobile Number required";
    } else if (!mobileRegex.test(values.mobileNumber)) {
        errors.mobileNumber = "Mobile Number is invalid";
    }

    return errors;
}