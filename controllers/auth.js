const { User } = require("../models");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  console.log(`👍 User "${user.name}" has been successfully registered.`);
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email }).populate("orgId");

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();

  console.log(`👍 User "${user.name}" has been successfully logged in.`);
  console.log(`🔑 Wallet path: ${user.walletPath}`);
  res.status(StatusCodes.OK).json({
    user: { name: user.name, email: user.email, org: user.orgId.name },
    token,
  });
};

module.exports = {
  register,
  login,
};
