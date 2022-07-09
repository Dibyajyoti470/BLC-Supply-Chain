const express = require("express");
const router = express.Router();
const {
  createHardwareRecord,
  getHardwareRecord,
  getAllHardwareRecords,
  updateHardwareRecord,
  deleteHardwareRecord,
} = require("../controllers/inventory");

router.route("/:orgId").get(getAllHardwareRecords).post(createHardwareRecord);
router
  .route("/:orgId/:itemId")
  .get(getHardwareRecord)
  .patch(updateHardwareRecord)
  .delete(deleteHardwareRecord);

module.exports = router;
