const { validationResult } = require("express-validator");
const User = require("./../models/User");
const { StatusCodes } = require("http-status-codes");

exports.signup = async (req, res, next) => {
  const validationErrors = validationResult(req);

  //express validator check
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => {
      return {
        msg: error.msg,
      };
    });
    return res.status(StatusCodes.UNAUTHORIZED).json({ errors, data: null });
  }
  const { username, email, password } = req.body;

  const user = await User.findOne({ email });
  const userUsername = await User.findOne({ username });

  if (user) {
    return res.status(StatusCodes.CONFLICT).json({
      errors: [
        {
          msg: "Email already in use",
        },
      ],
      data: null,
    });
  }

  if (userUsername) {
    return res.status(StatusCodes.CONFLICT).json({
      errors: [
        {
          msg: "Username already in use",
        },
      ],
      data: null,
    });
  }

  const newUser = await User.create({
    username,
    email,
    password,
  });
  const token = newUser.createJWT();

  return res.status(StatusCodes.CREATED).json({
    errors: [],
    data: {
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
    },
  });
};

exports.login = async (req, res, next) => {
  const validationErrors = validationResult(req);
  const { email, password } = req.body;

  //express validator check
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => {
      return {
        msg: error.msg,
      };
    });
    return res.status(StatusCodes.UNAUTHORIZED).json({ errors, data: null });
  }

  //check if user exist
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: [
        {
          msg: "Email do not exist",
        },
      ],
      data: null,
    });
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: [
        {
          msg: "Password incorrects",
        },
      ],
      data: null,
    });
  }
  const token = user.createJWT();
  user.password = undefined;

  res.status(StatusCodes.OK).json({
    errors: [],
    data: {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    },
  });
};
