const fs = require("fs");
const path = require("path");
const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");
const { NotFoundError, BadRequestError } = require("../errors");

const fabricEnrollUser = async (req, res, next) => {
  const { name, email, orgName } = req.body;

  // load the network configuration
  const ccpPath = path.resolve(
    __dirname,
    "..",
    "connection",
    "connection.json"
  );

  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
  const orgs = Object.keys(ccp.organizations);
  const match = orgs.filter((s) => s.includes(orgName));
  if (!match) {
    throw new NotFoundError("Organization not found in the fabric network");
  }
  const matchedOrgName = match[0];
  const caName = ccp.organizations[matchedOrgName].certificateAuthorities;

  // Create a new CA client for interacting with the CA.
  const caInfo = ccp.certificateAuthorities[caName];
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const ca = new FabricCAServices(
    caInfo.url,
    { trustedRoots: caTLSCACerts, verify: false },
    caInfo.caName
  );
  console.log(`Built a CA Client named ${caInfo.caName}`);

  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), "wallet", orgName);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  // Check to see if we've already enrolled the admin user.
  const identity = await wallet.get("admin");
  if (!identity) {
    throw new NotFoundError(
      'An identity for the admin user "admin" does not exist in the wallet!'
    );
  }

  // Check to see if we've already enrolled the user.
  const useridentity = await wallet.get(email);
  if (useridentity) {
    throw new BadRequestError(
      `An identity for the user with email=${email} already exist in the wallet!`
    );
  }

  // build a user object for authenticating with the CA
  const provider = wallet.getProviderRegistry().getProvider(identity.type);
  const adminUser = await provider.getUserContext(identity, "admin");

  // Register the user, enroll the user, and import the new identity into the wallet.
  const mspID = ccp.organizations[matchedOrgName].mspid;
  const secret = await ca.register(
    {
      enrollmentID: name,
      role: "client",
    },
    adminUser
  );
  const enrollment = await ca.enroll({
    enrollmentID: name,
    enrollmentSecret: secret,
  });
  const x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: mspID,
    type: "X.509",
  };
  await wallet.put(email, x509Identity);
  console.log(
    `Successfully registered and enrolled user ${name} and imported it into the wallet`
  );

  req.body.walletPath = walletPath;
  next();
};

module.exports = fabricEnrollUser;
