const { User, Organization } = require("../models");
const { NotFoundError, BadRequestError } = require("../errors");

const verifyUser = async (req, res, next) => {
  const { orgId } = req.body;
  const org = await Organization.findById(orgId);
  if (!org) {
    throw new NotFoundError("Organization not found");
  }
  const admin = await User.find({
    $and: [{ orgId: orgId }, { userType: "admin" }],
  });
  console.log(admin);
  if (admin.length !== 0) {
    throw new BadRequestError(
      `Organization ${org.name} has already an admin registered.`
    );
  }
  req.body.orgName = org.name;
  next();
};

module.exports = verifyUser;
