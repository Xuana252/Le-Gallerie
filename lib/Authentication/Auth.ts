import toastError from "@components/Notification/Toaster";
import validator from "validator";

export const handleInvalid = (names: string[]) => {
  names.forEach((name) => {
    // Get all elements with the given name
    const invalidInputs = document.getElementsByName(name);
    // Loop through NodeList and handle each input
    invalidInputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.classList.add("Invalid_input");
      }
    });
  });
};

export const checkInvalidInput = (inputs: any) => {
  let invalidLog: string[] = [];
  const invalidInputs = Object.entries(inputs)
    .filter(([key, value]) => {
      let isInvalid = false;
      let errorMessage = "";
      if (key === "image") return false; // Skip image field
      if (typeof value === "string") {
        if (value.trim() === "") {
          isInvalid = true;
        } else if (key === "email" && !validator.isEmail(value)) {
          errorMessage = "Invalid email";
          isInvalid = true;
        } else if (key === "password" && value.length < 8) {
          errorMessage = "Password must be at least 8 letters long";
          isInvalid = true;
        } else if (
          key === "repeatedPassword" &&
          value !== inputs.password
        ) {
          errorMessage = "Repeated password does not match";
          isInvalid = true;
        }
      } else {
        return false;
      }
      if (isInvalid) {
        errorMessage !== "" ? invalidLog.push(errorMessage) : "";
        return true;
      }
      return value.trim() === ""; // Check for empty fields
    })
    .map(([key]) => key);
  invalidLog ? alertError(invalidLog) : "";
  return invalidInputs;
};

export const alertError = (error: string[]) => {
  error.forEach((error) => toastError(error));
};
