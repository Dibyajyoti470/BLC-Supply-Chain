// const User = require("../models/User");
// const Organization = require("../models/Organization");
const { User, Organization } = require("../models");
const { NotFoundError, BadRequestError } = require("../errors");

const verifyUser = async (req, res, next) => {
  const { email, orgId } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new BadRequestError(`A user with email ${email} already exists.`);
  }
  const org = await Organization.findById(orgId);
  if (!org) {
    throw new NotFoundError("Organization not found");
  }
  req.body.orgName = org.name;
  next();
};

module.exports = verifyUser;
