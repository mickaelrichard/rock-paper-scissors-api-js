const express = require("express");
const userController = require("./../controllers/userController");
const router = express.Router();
const checkAuth = require("./../middleware/checkAuth");

router.get("/me", checkAuth, userController.me);

module.exports = router;
