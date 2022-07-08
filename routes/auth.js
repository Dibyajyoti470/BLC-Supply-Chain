const express = require("express");
const {
  fabricEnrollUser,
  fabricEnrollAdmin,
  verifyUser,
  verifyAdmin,
  verifyWallet,
} = require("../middlewares");
const { register, login } = require("../controllers/auth");
const { registerAdmin, loginAdmin } = require("../controllers/adminAuth");
const router = express.Router();

router.post("/register", verifyUser, fabricEnrollUser, register);
router.post("/login", verifyWallet, login);
router.post("/admin/register", verifyAdmin, fabricEnrollAdmin, registerAdmin);
router.post("/admin/login", verifyWallet, loginAdmin);

module.exports = router;
