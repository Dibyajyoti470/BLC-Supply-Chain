const { StatusCodes } = require("http-status-codes");
const { User } = require("../models");
const { UnauthenticatedError } = require("../errors");

const registerAdmin = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  console.log(`Admin has been registered successfully.`);
  console.log(
    `{id: ${user._id}, type: ${user.userType}, orgID: ${user.orgId}}`
  );
  res.status(StatusCodes.CREATED).json({ admin: { name: user.name }, token });
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ admin: { name: user.name }, token });
};

module.exports = {
  registerAdmin,
  loginAdmin,
};
