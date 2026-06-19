export const validateField = (name, value, currentForm, sDate, eDate) => {
  switch (name) {
    case "leaveType":
      return currentForm.leaveType ? null : "Leave Type is required";

    case "leaveFor":
      return currentForm.leaveFor ? null : "Leave For is required";

    case "noOfDays": {
      const v = value ?? currentForm.noOfDays;
      return !v || Number(v) <= 0
        ? "Number of days should be greater than 0"
        : null;
    }

    case "fromDate": {
      const has = !!sDate;
      return has ? null : "From date is required";
    }

    case "toDate": {
      const has = !!eDate;
      return has ? null : "To date is required";
    }

    default:
      return null;
  }
};

export const validateForm = (form, startDate, endDate) => {
  const errors = {};
  if (!form.leaveType) errors.leaveType = "Leave Type is required";
  if (!form.leaveFor) errors.leaveFor = "Leave For is required";
  if (!startDate) errors.fromDate = "From date is required";
  if (!endDate) errors.toDate = "To date is required";
  if (!form.noOfDays || Number(form.noOfDays) <= 0)
    errors.noOfDays = "Number of days should be greater than 0";

  return errors;
};

export default { validateField, validateForm };
