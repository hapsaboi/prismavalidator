const isValidDate = function (date) {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};

module.exports = { isValidDate };
