const Organization = require("../models/Organization");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const org = await Organization.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ org: { name: org.name } });
};

module.exports = { register };
