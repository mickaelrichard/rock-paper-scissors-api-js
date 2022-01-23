const JWT = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const checkAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: [
        {
          msg: "unauthorized",
        },
      ],
    });
  }
  try {
    const user = JWT.verify(token, process.env.JWT_SECRET);
    req.user = user.email;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: [
        {
          msg: "Not authorized to access this router",
        },
      ],
    });
  }
};
module.exports = checkAuth;
