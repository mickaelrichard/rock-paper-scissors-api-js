const User = require("./../models/User");
const { StatusCodes } = require("http-status-codes");

exports.me = async (req, res, next) => {
  const user = await User.findOne({ email: req.user });
  return res.status(StatusCodes.OK).json({
    errors: [],
    data: {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    },
  });
};
