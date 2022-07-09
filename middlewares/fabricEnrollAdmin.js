const fs = require("fs");
const path = require("path");
const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");
const { BadRequestError, NotFoundError } = require("../errors");

const fabricEnrollAdmin = async (req, res, next) => {
  const { orgName } = req.body;
  const adminUserId = "admin";
  const adminUserPasswd = "adminpw";

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
  if (identity) {
    throw new BadRequestError(
      'An identity for the admin user "admin" already exists in the wallet!'
    );
  }

  // Enroll the admin user
  const mspID = ccp.organizations[matchedOrgName].mspid;
  const enrollment = await ca.enroll({
    enrollmentID: adminUserId,
    enrollmentSecret: adminUserPasswd,
  });

  const x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: mspID,
    type: "X.509",
  };
  await wallet.put(adminUserId, x509Identity);
  console.log(
    "Successfully enrolled admin user and imported it into the wallet"
  );

  req.body.walletPath = walletPath;
  next();
};

module.exports = fabricEnrollAdmin;
