const rateLimiter = require("express-rate-limit");
const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

router.post(
  "/signup",
  body("username")
    .isLength({ min: 3 })
    .withMessage("The username must be at least 3 characters long"),
  body("username")
    .isLength({ max: 12 })
    .withMessage("The username must be less than 12 characters long"),
  body("email").isEmail().withMessage("The email is invalid"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("The password must be at least 5 characters long"),
  apiLimiter,
  authController.signup
);

router.post(
  "/login",
  body("email").not().isEmpty().withMessage("The email is required"),
  body("email").isEmail().withMessage("The email is invalid"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("The password must be at least 5 characters long"),
  apiLimiter,
  authController.login
);
module.exports = router;
