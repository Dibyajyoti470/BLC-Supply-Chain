const CustomAPIError = require("./custom-api");
const CustomError = require("./customError");
const UnauthenticatedError = require("./unauthenticated");
const NotFoundError = require("./notFound");
const BadRequestError = require("./badRequest");

module.exports = {
  CustomAPIError,
  CustomError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
};
