exports.formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

exports.generateRandomString = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

exports.paginate = (page, limit) => {
  const offset = (page - 1) * limit;
  return { offset, limit: parseInt(limit) };
};

exports.calculateGPA = (grades) => {
  const gradePoints = { A: 4, B: 3, C: 2, D: 1, F: 0 };
  const totalPoints = grades.reduce(
    (sum, grade) => sum + gradePoints[grade],
    0
  );
  return totalPoints / grades.length;
};
