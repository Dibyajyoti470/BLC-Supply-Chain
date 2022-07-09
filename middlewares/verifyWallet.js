const path = require("path");
const { Wallets } = require("fabric-network");
const { User } = require("../models");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");

const verifyWallet = async (req, res, next) => {
  const { email, orgName } = req.body;
  const user = await User.findOne({ email }).populate("orgId");

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), "wallet", user.orgId.name);
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  // Check to see if we've already enrolled the admin user.
  const identity = await wallet.get("admin");
  if (!identity) {
    throw new NotFoundError(
      'An identity for the admin user "admin" does not exist in the wallet!'
    );
  }

  // Check to see if the user type is admin
  if (user.userType === "admin") {
    next();
    return;
  }

  // Check to see if we've already enrolled the user.
  const userIdentity = await wallet.get(email);
  if (!userIdentity) {
    throw new BadRequestError(
      `An identity for the user with email=${email} does not exist in the wallet!`
    );
  }

  next();
};

module.exports = verifyWallet;
