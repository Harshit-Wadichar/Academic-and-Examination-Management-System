exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

exports.isValidPassword = (password) => {
  // At least 6 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
  return passwordRegex.test(password);
};

exports.isValidRollNumber = (rollNumber) => {
  // Assume roll number format: 3 letters + 6 digits
  const rollRegex = /^[A-Z]{3}\d{6}$/;
  return rollRegex.test(rollNumber);
};

exports.isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

exports.isValidRole = (role) => {
  const validRoles = [
    "student",
    "admin",
    "seating-manager",
    "club-coordinator",
  ];
  return validRoles.includes(role);
};
