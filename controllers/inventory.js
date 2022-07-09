const createHardwareRecord = (req, res) => {
  console.log(req.body);
  res.send("create hardware");
};
const getHardwareRecord = (req, res) => {
  res.send("get hardware");
};
const getAllHardwareRecords = (req, res) => {
  res.send("get all hardwares");
};
const updateHardwareRecord = (req, res) => {
  res.send("update hardware");
};
const deleteHardwareRecord = (req, res) => {
  res.send("delete hardware");
};

module.exports = {
  createHardwareRecord,
  getHardwareRecord,
  getAllHardwareRecords,
  updateHardwareRecord,
  deleteHardwareRecord,
};
