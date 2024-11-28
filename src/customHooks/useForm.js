import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";

/**
 * @function useForm
 *
 * It takes in a validate function, a valueState object, and a callback function, and returns an object
 * with a handleChange function, a handleSubmit function, a values object, an errors object, and a
 * loading boolean.
 */
const useForm = (validate, valueState, callback) => {
  /* Setting the initial state of the component. */
  const [values, setValues] = useState(valueState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  console.log("errors", errors);
  /**
   * The handleChange function takes an event as an argument, and then sets the state of the values
   * object to the value of the event target.
   * @param e - the event object
   */
  const handleChange = (e) => {
    const { name, value } = e.target || {};
    console.dir(e.target);

    // Handle array fields for inventory separately
    if (name === "inventory") {
      // Ensure values.inventory is always an array
      const updatedInventory = Array.isArray(values.inventory)
        ? [...values.inventory]
        : [];

      // Check if the selected item is already in the array
      if (updatedInventory.includes(value)) {
        // If yes, remove it
        const index = updatedInventory.indexOf(value);
        if (index !== -1) {
          updatedInventory.splice(index, 1);
        }
      } else {
        // If not, add it
        updatedInventory.push(value);
      }

      // Update the form state
      setValues({ ...values, [name]: updatedInventory });
    } else if (name === "customiseSetup" && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    } else if (name === "selectedDate" || name === "endDate") {
      setValues({ ...values, [name]: format(parseISO(value), "dd-MMM-yyyy") });
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  /**
   * When the form is submitted, prevent the default action, set the loading state to true, set the
   * errors state to the result of the validate function, and set the isSubmitting state to true.
   * @param e - the event object
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(validate(values));
    setIsSubmitting(true);
  };

  /* Checking if the errors object is empty and if the form is submitting. If it is, then it will
    call the updateData function. If not, then it will set the loading state to false. */
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [errors, isSubmitting]);

  return { handleChange, handleSubmit, selectedFile, values, errors, loading };
};

export default useForm;
